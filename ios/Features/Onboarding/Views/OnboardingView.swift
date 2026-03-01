import SwiftUI

struct OnboardingView: View {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    @State private var currentStep = 0
    @State private var ageConfirmed = false

    var body: some View {
        ZStack {
            Theme.bgPrimary.ignoresSafeArea()

            TabView(selection: $currentStep) {
                // Step 0: Welcome
                welcomeStep
                    .tag(0)

                // Step 1: Privacy
                privacyStep
                    .tag(1)

                // Step 2: Age gate
                ageGateStep
                    .tag(2)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .animation(.easeInOut, value: currentStep)
        }
    }

    // MARK: - Welcome

    private var welcomeStep: some View {
        VStack(spacing: 32) {
            Spacer()

            ZStack {
                Circle()
                    .fill(Theme.accentLight)
                    .frame(width: 120, height: 120)
                Image(systemName: "camera.filters")
                    .font(.system(size: 48))
                    .foregroundStyle(Theme.accent)
            }

            VStack(spacing: 12) {
                Text("Unfilter")
                    .font(Theme.display(40))
                    .foregroundStyle(Theme.textPrimary)

                Text("See what filters actually do to photos.\nBuild real habits. Protect your skin barrier.")
                    .font(Theme.body(17))
                    .foregroundStyle(Theme.textSecondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
            }

            Spacer()

            Button {
                withAnimation { currentStep = 1 }
            } label: {
                Text("Get Started")
                    .font(Theme.title(17))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 18)
                    .background(Theme.accent)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: Theme.radiusMd))
            }
            .padding(.horizontal, 32)
            .padding(.bottom, 48)
        }
    }

    // MARK: - Privacy

    private var privacyStep: some View {
        VStack(spacing: 24) {
            Spacer()

            Image(systemName: "lock.shield.fill")
                .font(.system(size: 48))
                .foregroundStyle(Theme.accent)

            Text("Your privacy is the product")
                .font(Theme.display(28))
                .foregroundStyle(Theme.textPrimary)
                .multilineTextAlignment(.center)

            VStack(alignment: .leading, spacing: 16) {
                privacyRow(icon: "iphone", title: "100% on-device", detail: "Photos are processed on your phone. Never uploaded.")
                privacyRow(icon: "wifi.slash", title: "Zero network", detail: "No servers. No analytics. No tracking. No ads.")
                privacyRow(icon: "trash", title: "One-tap delete", detail: "Delete everything instantly. We keep nothing.")
                privacyRow(icon: "lock.fill", title: "Encrypted storage", detail: "Journal images are AES-256 encrypted on your device.")
            }
            .padding(.horizontal, 8)

            Spacer()

            Button {
                withAnimation { currentStep = 2 }
            } label: {
                Text("Continue")
                    .font(Theme.title(17))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 18)
                    .background(Theme.accent)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: Theme.radiusMd))
            }
            .padding(.horizontal, 32)
            .padding(.bottom, 48)
        }
    }

    private func privacyRow(icon: String, title: String, detail: String) -> some View {
        HStack(alignment: .top, spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundStyle(Theme.accent)
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(Theme.title(15))
                    .foregroundStyle(Theme.textPrimary)
                Text(detail)
                    .font(Theme.body(14))
                    .foregroundStyle(Theme.textSecondary)
            }
        }
        .padding(.horizontal, 24)
    }

    // MARK: - Age Gate

    private var ageGateStep: some View {
        VStack(spacing: 32) {
            Spacer()

            Image(systemName: "person.fill.checkmark")
                .font(.system(size: 48))
                .foregroundStyle(Theme.accent)

            VStack(spacing: 12) {
                Text("One more thing")
                    .font(Theme.display(28))
                    .foregroundStyle(Theme.textPrimary)

                Text("Unfilter is designed for teens 13 and older.")
                    .font(Theme.body(16))
                    .foregroundStyle(Theme.textSecondary)
                    .multilineTextAlignment(.center)
            }

            // Toggle confirmation — no DOB collected or stored
            Toggle(isOn: $ageConfirmed) {
                Text("I confirm I am 13 or older")
                    .font(Theme.title(15))
                    .foregroundStyle(Theme.textPrimary)
            }
            .toggleStyle(SwitchToggleStyle(tint: Theme.accent))
            .padding(.horizontal, 40)

            Spacer()

            Button {
                hasCompletedOnboarding = true
            } label: {
                Text("Enter Unfilter")
                    .font(Theme.title(17))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 18)
                    .background(ageConfirmed ? Theme.accent : Theme.bgSecondary)
                    .foregroundStyle(ageConfirmed ? .white : Theme.textMuted)
                    .clipShape(RoundedRectangle(cornerRadius: Theme.radiusMd))
            }
            .disabled(!ageConfirmed)
            .padding(.horizontal, 32)

            Text("No date of birth or personal data is collected.")
                .font(.system(size: 12))
                .foregroundStyle(Theme.textMuted)
                .padding(.bottom, 48)
        }
    }
}

#Preview {
    OnboardingView()
}
