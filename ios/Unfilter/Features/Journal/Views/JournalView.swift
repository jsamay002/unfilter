import SwiftUI

struct JournalView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.bgPrimary.ignoresSafeArea()

                VStack(spacing: 20) {
                    ZStack {
                        Circle()
                            .fill(Theme.coralLight)
                            .frame(width: 80, height: 80)
                        Image(systemName: "book.closed")
                            .font(.system(size: 32))
                            .foregroundStyle(Theme.coral)
                    }

                    Text("Journal")
                        .font(Theme.display(24))
                        .foregroundStyle(Theme.textPrimary)

                    Text("Track how your skin looks and feels.\nEncrypted. On-device. Private.")
                        .font(Theme.body())
                        .foregroundStyle(Theme.textSecondary)
                        .multilineTextAlignment(.center)

                    Text("Coming in Step 3")
                        .font(Theme.caption())
                        .foregroundStyle(Theme.textMuted)
                }
            }
            .navigationTitle("Journal")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    JournalView()
}
