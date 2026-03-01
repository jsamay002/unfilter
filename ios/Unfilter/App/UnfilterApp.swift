import SwiftUI

@main
struct UnfilterApp: App {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false

    var body: some Scene {
        WindowGroup {
            if hasCompletedOnboarding {
                MainTabView()
            } else {
                OnboardingView()
            }
        }
    }
}
