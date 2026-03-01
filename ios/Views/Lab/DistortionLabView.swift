import SwiftUI

struct DistortionLabView: View {
    @State private var settings = DistortionSettings()
    @State private var sideBySide = false
    @State private var infoOpen = false

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("Distortion Lab")
                    .font(AppTheme.display(24))
                    .foregroundColor(AppTheme.text)
                    .padding(.top, 16)

                // Photo stage(s)
                HStack(spacing: 12) {
                    if sideBySide {
                        VStack(spacing: 6) {
                            SkinTextureView(blur: 0, contrast: 1)
                                .frame(width: 140, height: 140)
                                .clipShape(RoundedRectangle(cornerRadius: AppTheme.cornerLg))
                                .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerLg).stroke(AppTheme.border, lineWidth: 1))
                            Text("Real").font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
                        }
                    }
                    VStack(spacing: 6) {
                        labPhotoStage
                            .frame(width: sideBySide ? 140 : 280, height: sideBySide ? 140 : 280)
                            .clipShape(RoundedRectangle(cornerRadius: AppTheme.cornerLg))
                            .overlay(
                                RoundedRectangle(cornerRadius: AppTheme.cornerLg)
                                    .stroke(settings.isDistorted ? AppTheme.coral.opacity(0.4) : AppTheme.border, lineWidth: 1)
                            )
                            .shadow(color: .black.opacity(0.3), radius: 12, y: 6)
                        if sideBySide {
                            Text("Filtered").font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
                        }
                    }
                }

                // Toggle
                Button {
                    withAnimation(.spring(response: 0.3)) { sideBySide.toggle() }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: sideBySide ? "eye.slash" : "eye")
                            .font(.system(size: 14))
                        Text(sideBySide ? "Single view" : "Side by side")
                            .font(.system(size: 14, weight: .medium))
                    }
                    .foregroundColor(AppTheme.textSub)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(AppTheme.elevated)
                    .cornerRadius(AppTheme.cornerMd)
                }

                // Sliders
                VStack(spacing: 20) {
                    LabSlider(label: "Smoothing", sub: "Gaussian blur radius",
                              value: $settings.blur, range: 0...100)
                    LabSlider(label: "Tone Flattening", sub: "Contrast compression",
                              value: $settings.toneFlatten, range: 0...100)
                    LabSlider(label: "Shadow Reduction", sub: "Lifts dark areas",
                              value: $settings.shadowReduce, range: 0...100)

                    // Lighting preset
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Lighting Preset")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(AppTheme.text)

                        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 4), spacing: 8) {
                            ForEach(LightingPreset.allCases) { preset in
                                Button {
                                    withAnimation(.spring(response: 0.3)) { settings.lighting = preset }
                                } label: {
                                    VStack(spacing: 4) {
                                        Text(preset.emoji).font(.system(size: 18))
                                        Text(preset.label)
                                            .font(.system(size: 11, weight: .medium))
                                            .lineLimit(1)
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 10)
                                    .background(settings.lighting == preset ? AppTheme.indigo : AppTheme.elevated)
                                    .foregroundColor(settings.lighting == preset ? .white : AppTheme.textSub)
                                    .cornerRadius(AppTheme.cornerMd)
                                    .shadow(color: settings.lighting == preset ? AppTheme.indigo.opacity(0.3) : .clear, radius: 8)
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, 24)

                // Info toggle
                Button {
                    withAnimation { infoOpen.toggle() }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "info.circle").font(.system(size: 14))
                        Text("What changed?").font(.system(size: 14))
                        Spacer()
                        Image(systemName: infoOpen ? "chevron.up" : "chevron.down")
                            .font(.system(size: 12))
                    }
                    .foregroundColor(AppTheme.textMuted)
                    .padding(.horizontal, 24)
                }

                if infoOpen {
                    VStack(alignment: .leading, spacing: 8) {
                        InfoRow(label: "Blur", text: "Gaussian blur at \(String(format: "%.1f", settings.blur * 0.12))px radius removes visible pore and texture detail.")
                        InfoRow(label: "Tone", text: "Contrast reduced by \(Int(settings.toneFlatten * 0.5))%, flattening skin tonal range.")
                        InfoRow(label: "Shadows", text: "Brightness lifted \(Int(settings.shadowReduce * 0.3))% to remove natural shadow depth.")
                        InfoRow(label: "Lighting", text: "\(settings.lighting.label) preset applied.")
                    }
                    .padding(16)
                    .background(AppTheme.card)
                    .cornerRadius(AppTheme.cornerLg)
                    .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerLg).stroke(AppTheme.border, lineWidth: 1))
                    .padding(.horizontal, 24)
                    .transition(.opacity.combined(with: .move(edge: .top)))
                }

                Spacer().frame(height: 100)
            }
        }
        .background(AppTheme.bg)
    }

    private var labPhotoStage: some View {
        SkinTextureView(
            blur: settings.blur * 0.12,
            contrast: 1 - settings.toneFlatten * 0.005
        )
        .brightness(Double(settings.shadowReduce) * 0.003)
        .brightness(lightingBrightness)
        .saturation(lightingSaturation)
    }

    private var lightingBrightness: Double {
        switch settings.lighting {
        case .natural: return 0
        case .ring: return 0.15
        case .golden: return 0.05
        case .studio: return 0.20
        }
    }

    private var lightingSaturation: Double {
        switch settings.lighting {
        case .natural: return 1
        case .ring: return 0.9
        case .golden: return 1.3
        case .studio: return 0.8
        }
    }
}

struct LabSlider: View {
    let label: String
    let sub: String
    @Binding var value: Double
    let range: ClosedRange<Double>

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(label).font(.system(size: 14, weight: .semibold)).foregroundColor(AppTheme.text)
                Spacer()
                Text("\(Int(value))%").font(AppTheme.mono(12)).foregroundColor(AppTheme.textMuted)
            }
            Text(sub).font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
            Slider(value: $value, in: range)
                .tint(AppTheme.indigo)
        }
    }
}

struct InfoRow: View {
    let label: String
    let text: String
    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label).font(.system(size: 13, weight: .bold)).foregroundColor(AppTheme.text)
            Text(text).font(.system(size: 13)).foregroundColor(AppTheme.textMuted)
        }
    }
}
