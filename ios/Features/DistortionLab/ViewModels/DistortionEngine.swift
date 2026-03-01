import Foundation
import MetalKit
import CoreImage

/// Real-time distortion engine using Metal compute shaders.
/// All processing happens on-device. No image data leaves memory.
/// Images are NEVER persisted unless user explicitly saves to journal.
final class DistortionEngine: ObservableObject {

    // MARK: - Published State

    @Published var smoothing: Float = 0.0    // 0.0 (real) → 1.0 (max smooth)
    @Published var contrast: Float = 0.0     // 0.0 (real) → 1.0 (max compression)
    @Published var lightingPreset: LightingPreset = .natural

    @Published var isProcessing = false
    @Published private(set) var originalImage: CGImage?
    @Published private(set) var distortedImage: CGImage?

    // MARK: - Metal

    private let device: MTLDevice
    private let commandQueue: MTLCommandQueue
    private let smoothingPipeline: MTLComputePipelineState
    private let contrastPipeline: MTLComputePipelineState
    private let ciContext: CIContext

    // Textures
    private var sourceTexture: MTLTexture?
    private var intermediateTexture: MTLTexture?
    private var outputTexture: MTLTexture?

    // MARK: - Init

    init?() {
        guard let device = MTLCreateSystemDefaultDevice(),
              let commandQueue = device.makeCommandQueue() else {
            return nil
        }

        self.device = device
        self.commandQueue = commandQueue
        self.ciContext = CIContext(mtlDevice: device)

        // Load shader library
        guard let library = device.makeDefaultLibrary() else {
            return nil
        }

        // Create compute pipelines
        guard let smoothFunc = library.makeFunction(name: "gaussianSmooth"),
              let contrastFunc = library.makeFunction(name: "contrastCompress") else {
            return nil
        }

        do {
            self.smoothingPipeline = try device.makeComputePipelineState(function: smoothFunc)
            self.contrastPipeline = try device.makeComputePipelineState(function: contrastFunc)
        } catch {
            return nil
        }
    }

    // MARK: - Load Image

    func loadImage(_ cgImage: CGImage) {
        self.originalImage = cgImage

        // Create Metal texture from CGImage
        let textureLoader = MTKTextureLoader(device: device)
        let options: [MTKTextureLoader.Option: Any] = [
            .SRGB: false,
            .origin: MTKTextureLoader.Origin.topLeft
        ]

        guard let texture = try? textureLoader.newTexture(cgImage: cgImage, options: options) else {
            return
        }

        self.sourceTexture = texture

        // Create intermediate and output textures with matching dimensions
        let descriptor = MTLTextureDescriptor.texture2DDescriptor(
            pixelFormat: texture.pixelFormat,
            width: texture.width,
            height: texture.height,
            mipmapped: false
        )
        descriptor.usage = [.shaderRead, .shaderWrite]
        descriptor.storageMode = .private

        self.intermediateTexture = device.makeTexture(descriptor: descriptor)
        self.outputTexture = device.makeTexture(descriptor: descriptor)

        // Initial render with no distortion
        processImage()
    }

    // MARK: - Process

    func processImage() {
        guard let source = sourceTexture,
              let intermediate = intermediateTexture,
              let output = outputTexture,
              let commandBuffer = commandQueue.makeCommandBuffer() else {
            return
        }

        isProcessing = true

        // Pass 1: Gaussian smoothing (source → intermediate)
        if smoothing > 0.001 {
            encodeSmoothing(
                commandBuffer: commandBuffer,
                source: source,
                destination: intermediate,
                sigma: smoothing * 8.0 // Map 0-1 to 0-8 sigma
            )
        } else {
            // No smoothing — blit source to intermediate
            encodeBlit(commandBuffer: commandBuffer, source: source, destination: intermediate)
        }

        // Pass 2: Contrast compression (intermediate → output)
        if contrast > 0.001 {
            encodeContrast(
                commandBuffer: commandBuffer,
                source: intermediate,
                destination: output,
                amount: contrast
            )
        } else {
            encodeBlit(commandBuffer: commandBuffer, source: intermediate, destination: output)
        }

        commandBuffer.addCompletedHandler { [weak self] _ in
            guard let self = self else { return }

            // Convert Metal texture to CGImage
            if let cgImage = self.textureToCGImage(output) {
                // Apply lighting preset via CIFilter (runs on GPU via Metal-backed CIContext)
                let finalImage = self.applyLighting(to: cgImage)

                DispatchQueue.main.async {
                    self.distortedImage = finalImage
                    self.isProcessing = false
                }
            }
        }

        commandBuffer.commit()
    }

    // MARK: - Metal Encoding

    private func encodeSmoothing(
        commandBuffer: MTLCommandBuffer,
        source: MTLTexture,
        destination: MTLTexture,
        sigma: Float
    ) {
        // Two-pass separable Gaussian for O(n) performance
        // Pass H: horizontal blur (source → temp via intermediate)
        // Pass V: vertical blur (intermediate → destination)
        // For simplicity in MVP, using single-pass with clamped radius

        guard let encoder = commandBuffer.makeComputeCommandEncoder() else { return }
        encoder.setComputePipelineState(smoothingPipeline)
        encoder.setTexture(source, index: 0)
        encoder.setTexture(destination, index: 1)

        var sig = sigma
        encoder.setBytes(&sig, length: MemoryLayout<Float>.size, index: 0)

        let threadGroupSize = MTLSize(width: 16, height: 16, depth: 1)
        let threadGroups = MTLSize(
            width: (source.width + 15) / 16,
            height: (source.height + 15) / 16,
            depth: 1
        )

        encoder.dispatchThreadgroups(threadGroups, threadsPerThreadgroup: threadGroupSize)
        encoder.endEncoding()
    }

    private func encodeContrast(
        commandBuffer: MTLCommandBuffer,
        source: MTLTexture,
        destination: MTLTexture,
        amount: Float
    ) {
        guard let encoder = commandBuffer.makeComputeCommandEncoder() else { return }
        encoder.setComputePipelineState(contrastPipeline)
        encoder.setTexture(source, index: 0)
        encoder.setTexture(destination, index: 1)

        var amt = amount
        encoder.setBytes(&amt, length: MemoryLayout<Float>.size, index: 0)

        let threadGroupSize = MTLSize(width: 16, height: 16, depth: 1)
        let threadGroups = MTLSize(
            width: (source.width + 15) / 16,
            height: (source.height + 15) / 16,
            depth: 1
        )

        encoder.dispatchThreadgroups(threadGroups, threadsPerThreadgroup: threadGroupSize)
        encoder.endEncoding()
    }

    private func encodeBlit(commandBuffer: MTLCommandBuffer, source: MTLTexture, destination: MTLTexture) {
        guard let encoder = commandBuffer.makeBlitCommandEncoder() else { return }
        encoder.copy(
            from: source, sourceSlice: 0, sourceLevel: 0,
            sourceOrigin: MTLOrigin(x: 0, y: 0, z: 0),
            sourceSize: MTLSize(width: source.width, height: source.height, depth: 1),
            to: destination, destinationSlice: 0, destinationLevel: 0,
            destinationOrigin: MTLOrigin(x: 0, y: 0, z: 0)
        )
        encoder.endEncoding()
    }

    // MARK: - Lighting (CIFilter)

    private func applyLighting(to cgImage: CGImage) -> CGImage {
        let ciImage = CIImage(cgImage: cgImage)
        let filtered = lightingPreset.apply(to: ciImage)

        guard let output = ciContext.createCGImage(filtered, from: filtered.extent) else {
            return cgImage
        }
        return output
    }

    // MARK: - Texture → CGImage

    private func textureToCGImage(_ texture: MTLTexture) -> CGImage? {
        let width = texture.width
        let height = texture.height
        let bytesPerPixel = 4
        let bytesPerRow = width * bytesPerPixel
        let byteCount = bytesPerRow * height

        // Need a texture we can read from CPU
        let descriptor = MTLTextureDescriptor.texture2DDescriptor(
            pixelFormat: texture.pixelFormat,
            width: width,
            height: height,
            mipmapped: false
        )
        descriptor.storageMode = .shared
        descriptor.usage = .shaderRead

        guard let readableTexture = device.makeTexture(descriptor: descriptor),
              let commandBuffer = commandQueue.makeCommandBuffer(),
              let blitEncoder = commandBuffer.makeBlitCommandEncoder() else {
            return nil
        }

        blitEncoder.copy(
            from: texture, sourceSlice: 0, sourceLevel: 0,
            sourceOrigin: MTLOrigin(x: 0, y: 0, z: 0),
            sourceSize: MTLSize(width: width, height: height, depth: 1),
            to: readableTexture, destinationSlice: 0, destinationLevel: 0,
            destinationOrigin: MTLOrigin(x: 0, y: 0, z: 0)
        )
        blitEncoder.endEncoding()
        commandBuffer.commit()
        commandBuffer.waitUntilCompleted()

        var bytes = [UInt8](repeating: 0, count: byteCount)
        readableTexture.getBytes(
            &bytes,
            bytesPerRow: bytesPerRow,
            from: MTLRegion(origin: MTLOrigin(x: 0, y: 0, z: 0),
                           size: MTLSize(width: width, height: height, depth: 1)),
            mipmapLevel: 0
        )

        let colorSpace = CGColorSpaceCreateDeviceRGB()
        guard let context = CGContext(
            data: &bytes,
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: bytesPerRow,
            space: colorSpace,
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else {
            return nil
        }

        return context.makeImage()
    }

    // MARK: - Distortion Description (Explanation Layer)

    var distortionDescription: DistortionInfo {
        DistortionInfo(
            blurRadius: smoothing * 8.0,
            contrastReduction: contrast * 60.0,
            lightingName: lightingPreset.rawValue,
            isDistorted: smoothing > 0.01 || contrast > 0.01 || lightingPreset != .natural
        )
    }

    // MARK: - Cleanup

    func clearImage() {
        originalImage = nil
        distortedImage = nil
        sourceTexture = nil
        intermediateTexture = nil
        outputTexture = nil
        smoothing = 0
        contrast = 0
        lightingPreset = .natural
    }
}

// MARK: - Supporting Types

struct DistortionInfo {
    let blurRadius: Float
    let contrastReduction: Float
    let lightingName: String
    let isDistorted: Bool

    var summary: String {
        guard isDistorted else { return "No distortion applied. This is the real image." }
        var parts: [String] = []
        if blurRadius > 0.1 {
            parts.append(String(format: "Blur radius: %.1fpx", blurRadius))
        }
        if contrastReduction > 1 {
            parts.append(String(format: "Contrast reduced: %.0f%%", contrastReduction))
        }
        if lightingName != LightingPreset.natural.rawValue {
            parts.append("Lighting: \(lightingName)")
        }
        return parts.joined(separator: " · ")
    }
}

enum LightingPreset: String, CaseIterable, Identifiable {
    case natural = "Natural"
    case ringLight = "Ring Light"
    case goldenHour = "Golden Hour"
    case studio = "Studio Flat"

    var id: String { rawValue }

    func apply(to image: CIImage) -> CIImage {
        switch self {
        case .natural:
            return image

        case .ringLight:
            return image
                .applyingFilter("CIVignette", parameters: [
                    "inputIntensity": -0.8,
                    "inputRadius": 1.5
                ])
                .applyingFilter("CIExposureAdjust", parameters: [
                    "inputEV": 0.3
                ])

        case .goldenHour:
            return image
                .applyingFilter("CITemperatureAndTint", parameters: [
                    "inputNeutral": CIVector(x: 5500, y: 0),
                    "inputTargetNeutral": CIVector(x: 4500, y: 0)
                ])
                .applyingFilter("CIExposureAdjust", parameters: [
                    "inputEV": 0.15
                ])

        case .studio:
            return image
                .applyingFilter("CIHighlightShadowAdjust", parameters: [
                    "inputShadowAmount": 0.8,
                    "inputHighlightAmount": 0.9
                ])
                .applyingFilter("CIExposureAdjust", parameters: [
                    "inputEV": 0.2
                ])
        }
    }
}
