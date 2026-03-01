import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            DistortionLabView()
                .tabItem {
                    Label("Distortion Lab", systemImage: "camera.filters")
                }
                .tag(0)

            BarrierCopilotView()
                .tabItem {
                    Label("Barrier", systemImage: "shield.checkered")
                }
                .tag(1)

            JournalView()
                .tabItem {
                    Label("Journal", systemImage: "book.closed")
                }
                .tag(2)

            LearnView()
                .tabItem {
                    Label("Learn", systemImage: "lightbulb")
                }
                .tag(3)
        }
        .tint(Theme.accent)
    }
}

#Preview {
    MainTabView()
}
