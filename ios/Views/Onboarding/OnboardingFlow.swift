import SwiftUI

// MARK: - OnboardingFlow (from OnboardingFlow.tsx)
struct OnboardingFlow: View {
    let onComplete: () -> Void
    @State private var step = 0

    var body: some View {
        ZStack {
            AppTheme.bg.ignoresSafeArea()
            // Glow
            RadialGradient(colors: [AppTheme.indigo.opacity(0.15), .clear],
                           center: .top, startRadius: 0, endRadius: 400)
                .ignoresSafeArea()

            Group {
                switch step {
                case 0: OnboardingHook(onNext: { withAnimation { step = 1 } })
                case 1: OnboardingUnderstanding(onNext: { withAnimation { step = 2 } })
                case 2: OnboardingDemo(onNext: onComplete)
                default: EmptyView()
                }
            }
            .transition(.asymmetric(
                insertion: .move(edge: .trailing).combined(with: .opacity),
                removal: .move(edge: .leading).combined(with: .opacity)
            ))

            // Progress dots
            VStack {
                Spacer()
                HStack(spacing: 8) {
                    ForEach(0..<3, id: \.self) { i in
                        Capsule()
                            .fill(i == step ? AppTheme.indigo : AppTheme.muted)
                            .frame(width: i == step ? 32 : 8, height: 8)
                            .animation(.spring(response: 0.3), value: step)
                    }
                }
                .padding(.bottom, 40)
            }
        }
    }
}

// MARK: - Hook Screen (from OnboardingHook.tsx)
struct OnboardingHook: View {
    let onNext: () -> Void
    @State private var bobOffset: CGFloat = 0

    var body: some View {
        VStack(spacing: 0) {
            Spacer()

            // Mascot placeholder (bobbing)
            Text("🧬")
                .font(.system(size: 72))
                .offset(y: bobOffset)
                .onAppear {
                    withAnimation(.easeInOut(duration: 3).repeatForever(autoreverses: true)) {
                        bobOffset = -6
                    }
                }
                .padding(.bottom, 32)

            Text("Most ")
                .font(AppTheme.display(34))
                .foregroundColor(AppTheme.text)
            + Text("'perfect skin'")
                .font(AppTheme.display(34))
                .foregroundColor(AppTheme.indigo)
            + Text(" is just blur.")
                .font(AppTheme.display(34))
                .foregroundColor(AppTheme.text)

            Text("Unfilter shows how filters manipulate texture — entirely on your device.")
                .font(AppTheme.body(16))
                .foregroundColor(AppTheme.textMuted)
                .multilineTextAlignment(.center)
                .padding(.top, 12)
                .padding(.horizontal, 24)

            VStack(spacing: 12) {
                Button("Show me") { onNext() }
                    .buttonStyle(PrimaryButtonStyle())

                Button("How it works") { onNext() }
                    .buttonStyle(SecondaryButtonStyle())
            }
            .padding(.top, 40)
            .padding(.horizontal, 24)

            // Trust indicators
            HStack(spacing: 24) {
                TrustBadge(icon: "shield", label: "No uploads")
                TrustBadge(icon: "eye.slash", label: "No accounts")
                TrustBadge(icon: "iphone", label: "On-device only")
            }
            .padding(.top, 48)

            Spacer()
        }
        .padding(.horizontal, 24)
    }
}

struct TrustBadge: View {
    let icon: String
    let label: String
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 14))
                .foregroundColor(AppTheme.indigo)
            Text(label)
                .font(.system(size: 12))
                .foregroundColor(AppTheme.textMuted)
        }
    }
}

// MARK: - Understanding Screen (from OnboardingUnderstanding.tsx)
struct OnboardingUnderstanding: View {
    let onNext: () -> Void
    @State private var selected: String? = nil
    @State private var revealed = false

    private let options = [
        ("blur", "Blur / smoothing"),
        ("lighting", "Lighting changes"),
        ("both", "Both"),
    ]

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                Spacer().frame(height: 80)

                // Emoji badge
                Circle()
                    .fill(AppTheme.gradientAccent)
                    .frame(width: 48, height: 48)
                    .overlay(Text("🤔").font(.system(size: 24)))
                    .padding(.bottom, 32)

                Text("When you see \"perfect skin\" online...")
                    .font(AppTheme.display(24))
                    .foregroundColor(AppTheme.text)
                    .multilineTextAlignment(.center)

                Text("What's most likely happening?")
                    .font(AppTheme.body(15))
                    .foregroundColor(AppTheme.textMuted)
                    .padding(.top, 8)
                    .padding(.bottom, 32)

                // Options
                VStack(spacing: 12) {
                    ForEach(options, id: \.0) { (id, label) in
                        Button {
                            guard selected == nil else { return }
                            withAnimation(.spring(response: 0.3)) { selected = id }
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                                withAnimation { revealed = true }
                            }
                        } label: {
                            HStack {
                                Text(label)
                                    .font(.system(size: 15, weight: .medium))
                                Spacer()
                                if selected == id {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(AppTheme.indigo)
                                }
                            }
                            .padding(16)
                            .background(
                                selected == id
                                    ? (id == "both" ? AppTheme.indigo.opacity(0.2) : AppTheme.coral.opacity(0.2))
                                    : (selected != nil ? AppTheme.elevated.opacity(0.5) : AppTheme.elevated)
                            )
                            .foregroundColor(selected != nil && selected != id ? AppTheme.textMuted : AppTheme.text)
                            .cornerRadius(AppTheme.cornerMd)
                            .overlay(
                                RoundedRectangle(cornerRadius: AppTheme.cornerMd)
                                    .stroke(selected == id ? (id == "both" ? AppTheme.indigo : AppTheme.coral) : AppTheme.border, lineWidth: selected == id ? 2 : 1)
                            )
                        }
                    }
                }
                .padding(.horizontal, 24)

                // Revealed explanation
                if revealed {
                    VStack(alignment: .leading, spacing: 12) {
                        Group {
                            if selected == "both" {
                                Text("Exactly right! ").foregroundColor(AppTheme.indigo).fontWeight(.semibold)
                                + Text("Most filters stack ").foregroundColor(AppTheme.textSub)
                                + Text("blur and lighting tricks").foregroundColor(AppTheme.text).fontWeight(.semibold)
                                + Text(" together. They smooth skin texture with gaussian blur, then flatten contrast and adjust lighting to hide what's left.").foregroundColor(AppTheme.textSub)
                            } else {
                                Text("Close! ").foregroundColor(AppTheme.coral).fontWeight(.semibold)
                                + Text("Most filters stack ").foregroundColor(AppTheme.textSub)
                                + Text("blur and lighting tricks").foregroundColor(AppTheme.text).fontWeight(.semibold)
                                + Text(" together.").foregroundColor(AppTheme.textSub)
                            }
                        }
                        .font(.system(size: 14))

                        Button("See it in action") { onNext() }
                            .buttonStyle(PrimaryButtonStyle())
                    }
                    .padding(20)
                    .background(AppTheme.card)
                    .cornerRadius(AppTheme.cornerLg)
                    .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerLg).stroke(AppTheme.border, lineWidth: 1))
                    .padding(.horizontal, 24)
                    .padding(.top, 24)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }

                Spacer().frame(height: 120)
            }
        }
    }
}

// MARK: - Demo Screen (from OnboardingDemo.tsx)
struct OnboardingDemo: View {
    let onNext: () -> Void
    @State private var filterApplied = false
    @State private var revealed = false
    @State private var showSlider = false
    @State private var blurValue: Double = 0

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                Spacer().frame(height: 60)

                Text(headline)
                    .font(AppTheme.display(24))
                    .foregroundColor(AppTheme.text)
                    .multilineTextAlignment(.center)

                Text(subtitle)
                    .font(AppTheme.body(14))
                    .foregroundColor(AppTheme.textMuted)
                    .padding(.top, 8)
                    .padding(.bottom, 24)

                // Skin texture preview
                ZStack(alignment: .topTrailing) {
                    SkinTextureView(blur: blurValue * 0.12, contrast: 1 - blurValue * 0.005)
                        .frame(width: 280, height: 280)
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.cornerLg))
                        .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerLg).stroke(AppTheme.border, lineWidth: 1))
                        .shadow(color: .black.opacity(0.3), radius: 16, y: 8)

                    if filterApplied && !revealed {
                        Text("Filtered")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(AppTheme.coral.opacity(0.9))
                            .cornerRadius(8)
                            .padding(12)
                    }
                }

                // Stats card
                if revealed {
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text("Blur radius:").fontWeight(.semibold).foregroundColor(AppTheme.text)
                            Text("\(blurValue, specifier: "%.1f")px").foregroundColor(AppTheme.textMuted)
                        }
                        HStack {
                            Text("Contrast compressed:").fontWeight(.semibold).foregroundColor(AppTheme.text)
                            Text("\(Int(blurValue * 0.8))%").foregroundColor(AppTheme.textMuted)
                        }
                    }
                    .font(.system(size: 13))
                    .padding(16)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(AppTheme.card)
                    .cornerRadius(AppTheme.cornerMd)
                    .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerMd).stroke(AppTheme.border, lineWidth: 1))
                    .padding(.horizontal, 40)
                    .padding(.top, 16)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }

                // Slider
                if showSlider {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Blur (hides texture)")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(AppTheme.text)
                        Text("Gaussian blur")
                            .font(.system(size: 12))
                            .foregroundColor(AppTheme.textMuted)
                        Slider(value: $blurValue, in: 0...12, step: 0.5)
                            .tint(AppTheme.indigo)
                            .padding(.top, 8)
                    }
                    .padding(.horizontal, 40)
                    .padding(.top, 24)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }

                // Action buttons
                VStack(spacing: 12) {
                    if !filterApplied {
                        Button("Apply filter") { applyFilter() }
                            .buttonStyle(AccentButtonStyle())
                    }
                    if filterApplied && !revealed {
                        Button("Reveal what changed") { reveal() }
                            .buttonStyle(PrimaryButtonStyle())
                    }
                    if showSlider {
                        Button("Enter the Lab") { onNext() }
                            .buttonStyle(PrimaryButtonStyle())
                    }
                }
                .padding(.horizontal, 40)
                .padding(.top, 32)

                Spacer().frame(height: 120)
            }
        }
    }

    private var headline: String {
        if !filterApplied { return "Real skin has texture" }
        if revealed { return "Now you control it" }
        return "Looks 'perfect', right?"
    }

    private var subtitle: String {
        if !filterApplied { return "This is what skin actually looks like." }
        if revealed { return "Try the slider to see how blur hides texture." }
        return "Let's reveal what actually changed."
    }

    private func applyFilter() {
        filterApplied = true
        // Animate blur up
        Timer.scheduledTimer(withTimeInterval: 0.03, repeats: true) { timer in
            blurValue += 0.5
            if blurValue >= 6 {
                blurValue = 6
                timer.invalidate()
            }
        }
    }

    private func reveal() {
        withAnimation { revealed = true }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            withAnimation { showSlider = true }
        }
    }
}

// MARK: - Skin Texture Placeholder (CSS gradient → SwiftUI)
struct SkinTextureView: View {
    var blur: Double = 0
    var contrast: Double = 1

    var body: some View {
        ZStack {
            // Base skin gradient
            RadialGradient(
                colors: [Color(red: 0.96, green: 0.84, blue: 0.72),
                         Color(red: 0.91, green: 0.72, blue: 0.57),
                         Color(red: 0.72, green: 0.48, blue: 0.35)],
                center: UnitPoint(x: 0.4, y: 0.35),
                startRadius: 0, endRadius: 200
            )
            // Blush
            RadialGradient(colors: [Color.pink.opacity(0.3), .clear],
                           center: UnitPoint(x: 0.3, y: 0.6), startRadius: 0, endRadius: 80)
            RadialGradient(colors: [Color.pink.opacity(0.24), .clear],
                           center: UnitPoint(x: 0.7, y: 0.6), startRadius: 0, endRadius: 80)
            // Highlight
            RadialGradient(colors: [Color.white.opacity(0.3), .clear],
                           center: UnitPoint(x: 0.45, y: 0.28), startRadius: 0, endRadius: 100)
            // Vignette
            RadialGradient(colors: [.clear, .black.opacity(0.35)],
                           center: .center, startRadius: 100, endRadius: 200)
        }
        .blur(radius: blur)
        .contrast(contrast)
    }
}
