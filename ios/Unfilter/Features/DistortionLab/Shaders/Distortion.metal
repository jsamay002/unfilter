#include <metal_stdlib>
using namespace metal;

// ================================================================
// UNFILTER — Metal Compute Shaders
//
// These shaders demonstrate how digital smoothing alters photos.
// They are the core of the Distortion Lab feature.
//
// gaussianSmooth: Simulates skin smoothing (Gaussian blur)
// contrastCompress: Simulates tone evening (contrast reduction)
// ================================================================

// MARK: - Gaussian Smoothing

kernel void gaussianSmooth(
    texture2d<float, access::read> inTexture [[texture(0)]],
    texture2d<float, access::write> outTexture [[texture(1)]],
    constant float &sigma [[buffer(0)]],
    uint2 gid [[thread_position_in_grid]]
) {
    uint w = outTexture.get_width();
    uint h = outTexture.get_height();

    if (gid.x >= w || gid.y >= h) return;

    // No blur case — passthrough
    if (sigma < 0.01) {
        outTexture.write(inTexture.read(gid), gid);
        return;
    }

    // Kernel radius: 3 sigma covers 99.7% of the distribution
    int radius = min(int(ceil(sigma * 3.0)), 12); // Cap at 12 for performance

    float4 sum = float4(0.0);
    float weightSum = 0.0;
    float twoSigmaSq = 2.0 * sigma * sigma;

    for (int dy = -radius; dy <= radius; dy++) {
        for (int dx = -radius; dx <= radius; dx++) {
            // Clamp to texture bounds
            int2 pos = int2(gid) + int2(dx, dy);
            pos.x = clamp(pos.x, 0, int(w) - 1);
            pos.y = clamp(pos.y, 0, int(h) - 1);

            float dist = float(dx * dx + dy * dy);
            float weight = exp(-dist / twoSigmaSq);

            sum += inTexture.read(uint2(pos)) * weight;
            weightSum += weight;
        }
    }

    outTexture.write(sum / weightSum, gid);
}


// MARK: - Contrast Compression

kernel void contrastCompress(
    texture2d<float, access::read> inTexture [[texture(0)]],
    texture2d<float, access::write> outTexture [[texture(1)]],
    constant float &amount [[buffer(0)]],
    uint2 gid [[thread_position_in_grid]]
) {
    uint w = outTexture.get_width();
    uint h = outTexture.get_height();

    if (gid.x >= w || gid.y >= h) return;

    float4 color = inTexture.read(gid);

    // Compress toward midpoint (0.5) — reduces shadows and highlights
    // This is what "beauty mode" tone evening does
    float3 compressed = mix(color.rgb, float3(0.5), amount * 0.6);

    // Slight brightness lift (simulates fill light / ring light effect)
    compressed = compressed + amount * 0.05;

    // Clamp to valid range
    compressed = clamp(compressed, float3(0.0), float3(1.0));

    outTexture.write(float4(compressed, color.a), gid);
}
