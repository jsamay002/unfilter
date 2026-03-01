import SwiftUI

struct PrivacyView: View {
    @AppStorage("unfilter-onboarded") private var onboarded = false

    private let dataItems = [
        ("Journal entries", "UserDefaults"),
        ("Ingredient logs", "UserDefaults"),
        ("Chat history", "UserDefaults"),
        ("Onboarding status", "UserDefaults"),
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                HStack(spacing: 12) {
                    Circle().fill(AppTheme.indigo.opacity(0.2)).frame(width: 40, height: 40)
                        .overlay(Image(systemName: "shield").foregroundColor(AppTheme.indigo))
                    Text("Privacy").font(AppTheme.display(24)).foregroundColor(AppTheme.text)
                }

                // Info cards
                PrivacyInfoCard(icon: "iphone", title: "All processing is local",
                    text: "Every computation happens on your device. Nothing leaves your phone.")
                PrivacyInfoCard(icon: "server.rack", title: "No cloud storage",
                    text: "No servers. No databases. No accounts. Your data stays with you.")
                PrivacyInfoCard(icon: "eye.slash", title: "No tracking",
                    text: "No analytics SDKs. No third-party trackers. No behavioral profiling.")

                // Data inventory
                Text("Data Inventory").font(AppTheme.display(18)).foregroundColor(AppTheme.text).padding(.top, 8)
                VStack(spacing: 8) {
                    ForEach(dataItems, id: \.0) { (label, storage) in
                        HStack {
                            Text(label).font(.system(size: 14)).foregroundColor(AppTheme.text)
                            Spacer()
                            Text(storage).font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
                        }
                        .padding(12)
                        .background(AppTheme.card)
                        .cornerRadius(AppTheme.cornerMd)
                        .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerMd).stroke(AppTheme.border, lineWidth: 1))
                    }
                }

                // Delete all
                Button {
                    LocalStore.shared.deleteAll()
                    onboarded = false
                } label: {
                    HStack {
                        Image(systemName: "trash").font(.system(size: 14))
                        Text("Delete All Data").font(.system(size: 15, weight: .semibold))
                    }
                }
                .buttonStyle(DestructiveButtonStyle())
                .padding(.top, 8)

                Text("This permanently removes all locally stored data and resets the app.")
                    .font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
                    .multilineTextAlignment(.center).frame(maxWidth: .infinity)

                // Disclaimer
                VStack(alignment: .leading, spacing: 8) {
                    Text("Educational Disclaimer")
                        .font(.system(size: 14, weight: .semibold)).foregroundColor(AppTheme.text)
                    Text("Unfilter is an educational tool designed to promote digital media literacy and informed skincare habits. It does not diagnose, treat, or cure any skin condition. For medical concerns, please consult a licensed dermatologist or healthcare professional.")
                        .font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
                    Text("Designed for users 13+. No monetization of insecurity.")
                        .font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
                }
                .padding(16)
                .background(AppTheme.card)
                .cornerRadius(AppTheme.cornerLg)
                .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerLg).stroke(AppTheme.border, lineWidth: 1))
                .padding(.top, 16)

                Spacer().frame(height: 100)
            }
            .padding(.horizontal, 16)
            .padding(.top, 16)
        }
        .background(AppTheme.bg)
    }
}

struct PrivacyInfoCard: View {
    let icon: String
    let title: String
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(AppTheme.indigo)
                .frame(width: 20)
                .padding(.top, 2)
            VStack(alignment: .leading, spacing: 4) {
                Text(title).font(.system(size: 14, weight: .semibold)).foregroundColor(AppTheme.text)
                Text(text).font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppTheme.card)
        .cornerRadius(AppTheme.cornerLg)
        .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerLg).stroke(AppTheme.border, lineWidth: 1))
    }
}
