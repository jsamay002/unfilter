import SwiftUI

struct ContentView: View {
    @AppStorage("unfilter-onboarded") private var onboarded = false
    @StateObject private var settings = UserSettings.shared
    @State private var activeTab = "lab"
    @Environment(\.colorScheme) private var systemColorScheme

    var body: some View {
        ZStack {
            AppTheme.bg(
                highContrast: settings.highContrast,
                isLight: effectiveIsLight
            )
            .ignoresSafeArea()

            if !onboarded {
                OnboardingFlow(onComplete: {
                    withAnimation(.easeOut(duration: 0.3)) {
                        onboarded = true
                    }
                })
                .transition(.move(edge: .trailing))
            } else {
                VStack(spacing: 0) {
                    TabContent(activeTab: activeTab)
                    AppNavBar(activeTab: $activeTab)
                        .environmentObject(settings)
                }
            }
        }
        .preferredColorScheme(settings.appearanceMode.colorScheme)
        .environment(\.userSettings, settings)
    }
    
    private var effectiveIsLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }
}

struct TabContent: View {
    let activeTab: String

    var body: some View {
        Group {
            switch activeTab {
            case "lab": DistortionLabView()
            case "copilot": BarrierCopilotView()
            case "journal": JournalView()
            case "chat": ChatView()
            case "privacy": PrivacyView()
            case "settings": SettingsView()
            default: DistortionLabView()
            }
        }
    }
}

// MARK: - Bottom Nav (from AppNav.tsx)
struct AppNavBar: View {
    @Binding var activeTab: String
    @EnvironmentObject private var settings: UserSettings
    @Environment(\.colorScheme) private var systemColorScheme

    private let tabs: [(id: String, label: String, icon: String)] = [
        ("lab", "Lab", "flask"),
        ("copilot", "Copilot", "shield"),
        ("journal", "Journal", "book"),
        ("chat", "Learn", "bubble.left"),
        ("settings", "Settings", "gear"),
    ]
    
    private var effectiveIsLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }

    var body: some View {
        HStack {
            ForEach(tabs, id: \.id) { tab in
                navTabButton(for: tab)
            }
        }
        .padding(.horizontal, 8)
        .padding(.bottom, 16)
        .background(navBackground)
        .overlay(alignment: .top) {
            Rectangle()
                .fill(AppTheme.border(highContrast: settings.highContrast, isLight: effectiveIsLight))
                .frame(height: 1)
        }
    }
    
    private var navBackground: some View {
        AppTheme.surface(highContrast: settings.highContrast, isLight: effectiveIsLight)
            .opacity(0.6)
            .background(.ultraThinMaterial)
    }
    
    private func navTabButton(for tab: (id: String, label: String, icon: String)) -> some View {
        let isActive = activeTab == tab.id
        
        return Button {
            let animation: Animation = settings.reduceMotion ? .linear(duration: 0.2) : .spring(response: 0.3)
            withAnimation(animation) {
                activeTab = tab.id
            }
        } label: {
            VStack(spacing: 3) {
                // Show mascot emoji for settings
                if tab.id == "settings" {
                    Text(AppTheme.mascotEmoji)
                        .font(.system(size: 20))
                } else {
                    Image(systemName: iconName(tab.icon))
                        .font(.system(size: 20))
                }
                
                Text(tab.label)
                    .font(AppTheme.body(10, weight: .medium, settings: settings))
                
                if isActive {
                    Circle()
                        .fill(AppTheme.mascotPrimary)
                        .frame(width: 4, height: 4)
                }
            }
            .foregroundColor(
                isActive ?
                AppTheme.mascotPrimary : AppTheme.textMuted(highContrast: settings.highContrast, isLight: effectiveIsLight)
            )
            .frame(maxWidth: .infinity)
            .padding(.vertical, 6)
        }
    }

    private func iconName(_ base: String) -> String {
        switch base {
        case "flask": return "flask"
        case "shield": return "shield"
        case "book": return "book"
        case "bubble.left": return "bubble.left"
        case "lock": return "lock"
        default: return base
        }
    }
}

#Preview {
    ContentView()
}
