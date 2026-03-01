import SwiftUI
import Combine

// MARK: - User Preferences
enum TextSize: String, CaseIterable, Codable {
    case small, medium, large
    
    var label: String {
        switch self {
        case .small: return "Small"
        case .medium: return "Medium"
        case .large: return "Large"
        }
    }
    
    var multiplier: CGFloat {
        switch self {
        case .small: return 0.9
        case .medium: return 1.0
        case .large: return 1.15
        }
    }
}

enum AppearanceMode: String, CaseIterable, Codable {
    case light, dark, system
    
    var label: String {
        switch self {
        case .light: return "Light"
        case .dark: return "Dark"
        case .system: return "System"
        }
    }
    
    var colorScheme: ColorScheme? {
        switch self {
        case .light: return .light
        case .dark: return .dark
        case .system: return nil
        }
    }
}

// MARK: - Settings Manager
final class UserSettings: ObservableObject {
    static let shared = UserSettings()
    
    @AppStorage("unfilter-text-size") var textSize: TextSize = .medium
    @AppStorage("unfilter-appearance") var appearanceMode: AppearanceMode = .dark
    @AppStorage("unfilter-high-contrast") var highContrast: Bool = false
    @AppStorage("unfilter-reduce-motion") var reduceMotion: Bool = false
    @AppStorage("unfilter-mascot-name") var mascotName: String = "Luna"
    
    private init() {}
    
    // Dynamic font size helper
    func fontSize(_ base: CGFloat) -> CGFloat {
        base * textSize.multiplier
    }
}

// MARK: - Environment Key for Settings
struct UserSettingsKey: EnvironmentKey {
    static let defaultValue = UserSettings.shared
}

extension EnvironmentValues {
    var userSettings: UserSettings {
        get { self[UserSettingsKey.self] }
        set { self[UserSettingsKey.self] = newValue }
    }
}
