import SwiftUI

struct LearnView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.bgPrimary.ignoresSafeArea()

                VStack(spacing: 20) {
                    ZStack {
                        Circle()
                            .fill(Theme.accentLight)
                            .frame(width: 80, height: 80)
                        Image(systemName: "lightbulb")
                            .font(.system(size: 32))
                            .foregroundStyle(Theme.accent)
                    }

                    Text("Learn")
                        .font(Theme.display(24))
                        .foregroundStyle(Theme.textPrimary)

                    Text("Ingredient guide, image characteristics,\nand your privacy dashboard.")
                        .font(Theme.body())
                        .foregroundStyle(Theme.textSecondary)
                        .multilineTextAlignment(.center)

                    Text("Coming in Step 4")
                        .font(Theme.caption())
                        .foregroundStyle(Theme.textMuted)
                }
            }
            .navigationTitle("Learn")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    LearnView()
}
