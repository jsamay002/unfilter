import SwiftUI
import PhotosUI

struct DistortionLabView: View {
    @StateObject private var engine = DistortionEngine() ?? DistortionEngine()!
    @State private var showPhotoPicker = false
    @State private var showCamera = false
    @State private var selectedPhotoItem: PhotosPickerItem?
    @State private var showSideBySide = false
    @State private var showExplanation = true

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.bgPrimary.ignoresSafeArea()

                if engine.originalImage != nil {
                    // Image loaded — show distortion controls
                    distortionView
                } else {
                    // No image — show capture prompt
                    capturePrompt
                }
            }
            .navigationTitle("Distortion Lab")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                if engine.originalImage != nil {
                    ToolbarItem(placement: .topBarLeading) {
                        Button("New Photo") {
                            engine.clearImage()
                        }
                        .font(Theme.caption())
                        .foregroundStyle(Theme.accent)
                    }

                    ToolbarItem(placement: .topBarTrailing) {
                        Button {
                            showSideBySide.toggle()
                        } label: {
                            Image(systemName: showSideBySide ? "square.split.2x1.fill" : "square.split.2x1")
                                .foregroundStyle(Theme.accent)
                        }
                    }
                }
            }
        }
    }

    // MARK: - Capture Prompt

    private var capturePrompt: some View {
        VStack(spacing: 32) {
            Spacer()

            // Icon
            ZStack {
                Circle()
                    .fill(Theme.accentLight)
                    .frame(width: 96, height: 96)
                Image(systemName: "camera.filters")
                    .font(.system(size: 36))
                    .foregroundStyle(Theme.accent)
            }

            VStack(spacing: 12) {
                Text("See what filters actually do")
                    .font(Theme.display(28))
                    .foregroundStyle(Theme.textPrimary)
                    .multilineTextAlignment(.center)

                Text("Take or select a photo to see how digital\nsmoothing changes what you see.")
                    .font(Theme.body())
                    .foregroundStyle(Theme.textSecondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
            }

            VStack(spacing: 12) {
                // Camera button
                Button {
                    showCamera = true
                } label: {
                    Label("Take a Photo", systemImage: "camera")
                        .font(Theme.title(16))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Theme.accent)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.radiusMd))
                }

                // Photo picker
                PhotosPicker(selection: $selectedPhotoItem, matching: .images) {
                    Label("Choose from Library", systemImage: "photo")
                        .font(Theme.title(16))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Theme.bgSecondary)
                        .foregroundStyle(Theme.textPrimary)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.radiusMd))
                }
            }
            .padding(.horizontal, 24)

            // Privacy badge
            OnDeviceBadge()
                .padding(.horizontal, 24)

            Spacer()
        }
        .padding(.horizontal, Theme.paddingLg)
        .onChange(of: selectedPhotoItem) { _, newItem in
            loadPhoto(from: newItem)
        }
        .fullScreenCover(isPresented: $showCamera) {
            CameraView { cgImage in
                engine.loadImage(cgImage)
            }
        }
    }

    // MARK: - Distortion View

    private var distortionView: some View {
        VStack(spacing: 0) {
            // Image display
            if showSideBySide {
                sideBySideView
            } else {
                singleImageView
            }

            // Explanation overlay
            if showExplanation && engine.distortionDescription.isDistorted {
                explanationBanner
            }

            // Controls
            controlsPanel
        }
    }

    // MARK: - Single Image

    private var singleImageView: some View {
        GeometryReader { geo in
            if let image = engine.distortedImage {
                Image(decorative: image, scale: 1.0)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .clipShape(RoundedRectangle(cornerRadius: Theme.radiusMd))
                    .padding(.horizontal, Theme.paddingMd)
                    .padding(.top, 8)
            }
        }
    }

    // MARK: - Side by Side

    private var sideBySideView: some View {
        GeometryReader { geo in
            HStack(spacing: 4) {
                // Original
                VStack(spacing: 6) {
                    if let original = engine.originalImage {
                        Image(decorative: original, scale: 1.0)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .clipShape(RoundedRectangle(cornerRadius: Theme.radiusSm))
                    }
                    Text("Real")
                        .font(Theme.label())
                        .foregroundStyle(Theme.accent)
                }

                // Distorted
                VStack(spacing: 6) {
                    if let distorted = engine.distortedImage {
                        Image(decorative: distorted, scale: 1.0)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .clipShape(RoundedRectangle(cornerRadius: Theme.radiusSm))
                    }
                    Text("Filtered")
                        .font(Theme.label())
                        .foregroundStyle(Theme.coral)
                }
            }
            .padding(.horizontal, Theme.paddingMd)
            .padding(.top, 8)
        }
    }

    // MARK: - Explanation Banner

    private var explanationBanner: some View {
        HStack(spacing: 10) {
            Image(systemName: "info.circle.fill")
                .foregroundStyle(Theme.accent)
                .font(.system(size: 16))

            VStack(alignment: .leading, spacing: 2) {
                Text("What changed:")
                    .font(Theme.label(11))
                    .foregroundStyle(Theme.textTertiary)
                    .textCase(.uppercase)
                    .tracking(0.5)

                Text(engine.distortionDescription.summary)
                    .font(Theme.caption())
                    .foregroundStyle(Theme.textPrimary)
            }

            Spacer()

            Button {
                showExplanation = false
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundStyle(Theme.textMuted)
            }
        }
        .padding(Theme.paddingSm)
        .background(Theme.bgSecondary)
        .clipShape(RoundedRectangle(cornerRadius: Theme.radiusMd))
        .padding(.horizontal, Theme.paddingMd)
        .padding(.top, 8)
        .transition(.move(edge: .top).combined(with: .opacity))
    }

    // MARK: - Controls Panel

    private var controlsPanel: some View {
        VStack(spacing: 16) {
            Divider()
                .padding(.horizontal, Theme.paddingMd)

            // Smoothing slider
            DistortionSlider(
                label: "Smoothing",
                detail: String(format: "Blur radius: %.1fpx", engine.smoothing * 8.0),
                value: $engine.smoothing,
                icon: "drop.fill",
                tint: Theme.accent
            )
            .onChange(of: engine.smoothing) { _, _ in
                engine.processImage()
                showExplanation = true
            }

            // Contrast slider
            DistortionSlider(
                label: "Tone Evening",
                detail: String(format: "Contrast reduced: %.0f%%", engine.contrast * 60.0),
                value: $engine.contrast,
                icon: "circle.lefthalf.filled",
                tint: Theme.amber
            )
            .onChange(of: engine.contrast) { _, _ in
                engine.processImage()
                showExplanation = true
            }

            // Lighting presets
            VStack(alignment: .leading, spacing: 8) {
                Text("Lighting")
                    .font(Theme.label())
                    .foregroundStyle(Theme.textTertiary)
                    .textCase(.uppercase)
                    .tracking(0.5)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(LightingPreset.allCases) { preset in
                            Button {
                                engine.lightingPreset = preset
                                engine.processImage()
                                showExplanation = true
                            } label: {
                                Text(preset.rawValue)
                                    .font(Theme.caption())
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 10)
                                    .background(
                                        engine.lightingPreset == preset
                                            ? Theme.accent
                                            : Theme.bgSecondary
                                    )
                                    .foregroundStyle(
                                        engine.lightingPreset == preset
                                            ? .white
                                            : Theme.textSecondary
                                    )
                                    .clipShape(RoundedRectangle(cornerRadius: Theme.radiusSm))
                            }
                        }
                    }
                }
            }
            .padding(.horizontal, Theme.paddingMd)

            // "This is what apps do" callout
            if engine.distortionDescription.isDistorted {
                HStack(spacing: 8) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundStyle(Theme.coral)
                        .font(.system(size: 14))
                    Text("This is what beauty filters do to photos you see online.")
                        .font(Theme.caption())
                        .foregroundStyle(Theme.textSecondary)
                }
                .padding(Theme.paddingSm)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Theme.coralLight)
                .clipShape(RoundedRectangle(cornerRadius: Theme.radiusMd))
                .padding(.horizontal, Theme.paddingMd)
            }

            // On-device badge
            OnDeviceBadge(compact: true)
                .padding(.bottom, 8)
        }
        .padding(.top, 8)
        .padding(.bottom, Theme.paddingSm)
        .background(Theme.bgCard)
    }

    // MARK: - Photo Loading

    private func loadPhoto(from item: PhotosPickerItem?) {
        guard let item else { return }
        Task {
            if let data = try? await item.loadTransferable(type: Data.self),
               let uiImage = UIImage(data: data),
               let cgImage = uiImage.cgImage {
                await MainActor.run {
                    engine.loadImage(cgImage)
                }
            }
        }
    }
}

// MARK: - Distortion Slider Component

struct DistortionSlider: View {
    let label: String
    let detail: String
    @Binding var value: Float
    let icon: String
    let tint: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 12))
                    .foregroundStyle(tint)
                Text(label)
                    .font(Theme.label())
                    .foregroundStyle(Theme.textTertiary)
                    .textCase(.uppercase)
                    .tracking(0.5)
                Spacer()
                Text(detail)
                    .font(Theme.caption())
                    .foregroundStyle(Theme.textSecondary)
                    .monospacedDigit()
            }

            Slider(value: $value, in: 0...1)
                .tint(tint)
        }
        .padding(.horizontal, Theme.paddingMd)
    }
}

// MARK: - On-Device Badge

struct OnDeviceBadge: View {
    var compact: Bool = false

    var body: some View {
        HStack(spacing: compact ? 6 : 10) {
            Image(systemName: "lock.shield.fill")
                .font(.system(size: compact ? 12 : 14))
                .foregroundStyle(Theme.accent)

            if compact {
                Text("On-device processing. Never uploaded.")
                    .font(Theme.label(11))
                    .foregroundStyle(Theme.accentDark)
            } else {
                VStack(alignment: .leading, spacing: 2) {
                    Text("On-device processing. Not saved unless you choose.")
                        .font(Theme.label(12))
                        .foregroundStyle(Theme.accentDark)
                    Text("Your photo never leaves this device. Zero bytes uploaded.")
                        .font(.system(size: 11))
                        .foregroundStyle(Theme.accent)
                }
            }
        }
        .padding(.horizontal, compact ? 12 : Theme.paddingMd)
        .padding(.vertical, compact ? 8 : 12)
        .frame(maxWidth: compact ? nil : .infinity, alignment: .leading)
        .background(Theme.accentLight)
        .clipShape(RoundedRectangle(cornerRadius: compact ? 20 : Theme.radiusMd))
    }
}

#Preview {
    DistortionLabView()
}
