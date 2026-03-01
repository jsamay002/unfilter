import SwiftUI

struct BarrierCopilotView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.bgPrimary.ignoresSafeArea()

                VStack(spacing: 20) {
                    ZStack {
                        Circle()
                            .fill(Theme.amberLight)
                            .frame(width: 80, height: 80)
                        Image(systemName: "shield.checkered")
                            .font(.system(size: 32))
                            .foregroundStyle(Theme.amber)
                    }

                    Text("Barrier Copilot")
                        .font(Theme.display(24))
                        .foregroundStyle(Theme.textPrimary)

                    Text("Check if your products are working\ntogether or against each other.")
                        .font(Theme.body())
                        .foregroundStyle(Theme.textSecondary)
                        .multilineTextAlignment(.center)

                    Text("Coming in Step 2")
                        .font(Theme.caption())
                        .foregroundStyle(Theme.textMuted)
                }
            }
            .navigationTitle("Barrier Copilot")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    BarrierCopilotView()
}
