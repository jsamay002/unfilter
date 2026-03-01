import SwiftUI

import SwiftUI

// MARK: - Design Tokens (from CSS custom properties)
enum AppTheme {
    // MARK: - Mascot Colors (Luna the Owl)
    static let mascotPrimary = Color(hue: 265/360, saturation: 0.90, brightness: 0.60) // Luna's main color
    static let mascotAccent = Color(hue: 280/360, saturation: 0.85, brightness: 0.65)  // Luna's highlights
    static let mascotEyes = Color(hue: 85/360, saturation: 0.80, brightness: 0.70)     // Luna's wise eyes
    
    // Brand
    static let indigo = Color(hue: 265/360, saturation: 0.90, brightness: 0.60)
    static let indigoHi = Color(hue: 265/360, saturation: 0.90, brightness: 0.70)
    static let coral = Color(hue: 12/360, saturation: 0.90, brightness: 0.65)
    static let coralLo = Color(hue: 12/360, saturation: 0.85, brightness: 0.60)
    static let lime = Color(hue: 85/360, saturation: 0.75, brightness: 0.55)
    static let gold = Color(hue: 45/360, saturation: 0.90, brightness: 0.60)
    static let sky = Color(hue: 200/360, saturation: 0.85, brightness: 0.60)

    // MARK: - Dynamic Surfaces
    static func bg(highContrast: Bool = false, isLight: Bool = false) -> Color {
        if isLight {
            return highContrast ? Color.white : Color(hue: 250/360, saturation: 0.05, brightness: 0.98)
        }
        return highContrast ? Color.black : Color(hue: 250/360, saturation: 0.25, brightness: 0.08)
    }
    
    static func surface(highContrast: Bool = false, isLight: Bool = false) -> Color {
        if isLight {
            return highContrast ? Color(white: 0.95) : Color(hue: 250/360, saturation: 0.05, brightness: 0.96)
        }
        return highContrast ? Color(white: 0.05) : Color(hue: 250/360, saturation: 0.20, brightness: 0.12)
    }
    
    static func card(highContrast: Bool = false, isLight: Bool = false) -> Color {
        if isLight {
            return highContrast ? Color.white : Color(hue: 250/360, saturation: 0.05, brightness: 0.97)
        }
        return highContrast ? Color(white: 0.1) : Color(hue: 250/360, saturation: 0.20, brightness: 0.12)
    }
    
    static func elevated(highContrast: Bool = false, isLight: Bool = false) -> Color {
        if isLight {
            return highContrast ? Color(white: 0.92) : Color(hue: 250/360, saturation: 0.08, brightness: 0.94)
        }
        return highContrast ? Color(white: 0.15) : Color(hue: 250/360, saturation: 0.20, brightness: 0.18)
    }
    
    static func muted(highContrast: Bool = false, isLight: Bool = false) -> Color {
        if isLight {
            return highContrast ? Color(white: 0.88) : Color(hue: 250/360, saturation: 0.10, brightness: 0.90)
        }
        return highContrast ? Color(white: 0.2) : Color(hue: 250/360, saturation: 0.15, brightness: 0.16)
    }

    // Legacy static versions (for backward compatibility)
    static let bg = Color(hue: 250/360, saturation: 0.25, brightness: 0.08)
    static let surface = Color(hue: 250/360, saturation: 0.20, brightness: 0.12)
    static let card = Color(hue: 250/360, saturation: 0.20, brightness: 0.12)
    static let elevated = Color(hue: 250/360, saturation: 0.20, brightness: 0.18)
    static let muted = Color(hue: 250/360, saturation: 0.15, brightness: 0.16)

    // MARK: - Dynamic Text
    static func text(highContrast: Bool = false, isLight: Bool = false) -> Color {
        if isLight {
            return highContrast ? Color.black : Color(hue: 250/360, saturation: 0.20, brightness: 0.15)
        }
        return highContrast ? Color.white : Color(hue: 220/360, saturation: 0.20, brightness: 0.95)
    }
    
    static func textSub(highContrast: Bool = false, isLight: Bool = false) -> Color {
        if isLight {
            return highContrast ? Color(white: 0.15) : Color(hue: 250/360, saturation: 0.15, brightness: 0.30)
        }
        return highContrast ? Color(white: 0.95) : Color(hue: 220/360, saturation: 0.20, brightness: 0.90)
    }
    
    static func textMuted(highContrast: Bool = false, isLight: Bool = false) -> Color {
        if isLight {
            return highContrast ? Color(white: 0.40) : Color(hue: 250/360, saturation: 0.10, brightness: 0.50)
        }
        return highContrast ? Color(white: 0.70) : Color(hue: 220/360, saturation: 0.10, brightness: 0.55)
    }

    // Legacy static versions
    static let text = Color(hue: 220/360, saturation: 0.20, brightness: 0.95)
    static let textSub = Color(hue: 220/360, saturation: 0.20, brightness: 0.90)
    static let textMuted = Color(hue: 220/360, saturation: 0.10, brightness: 0.55)

    // MARK: - Dynamic Lines
    static func border(highContrast: Bool = false, isLight: Bool = false) -> Color {
        if isLight {
            return highContrast ? Color(white: 0.70) : Color(hue: 250/360, saturation: 0.15, brightness: 0.85)
        }
        return highContrast ? Color(white: 0.35) : Color(hue: 250/360, saturation: 0.15, brightness: 0.20)
    }
    
    static func borderStrong(highContrast: Bool = false, isLight: Bool = false) -> Color {
        if isLight {
            return highContrast ? Color(white: 0.60) : Color(hue: 250/360, saturation: 0.15, brightness: 0.75)
        }
        return highContrast ? Color(white: 0.45) : Color(hue: 250/360, saturation: 0.15, brightness: 0.25)
    }

    // Legacy static versions
    static let border = Color(hue: 250/360, saturation: 0.15, brightness: 0.20)
    static let borderStrong = Color(hue: 250/360, saturation: 0.15, brightness: 0.25)

    // Gradients
    static let gradientPrimary = LinearGradient(
        colors: [indigo, Color(hue: 280/360, saturation: 0.80, brightness: 0.55)],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )
    static let gradientAccent = LinearGradient(
        colors: [coral, coralLo],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    // Layout
    static let cornerSm: CGFloat = 12
    static let cornerMd: CGFloat = 16
    static let cornerLg: CGFloat = 20
    static let cornerXl: CGFloat = 28

    // Fonts (with dynamic sizing support)
    nonisolated static func display(_ size: CGFloat, weight: Font.Weight = .bold, settings: UserSettings = .shared) -> Font {
        .system(size: settings.fontSize(size), weight: weight, design: .rounded)
    }
    nonisolated static func body(_ size: CGFloat = 15, weight: Font.Weight = .regular, settings: UserSettings = .shared) -> Font {
        .system(size: settings.fontSize(size), weight: weight)
    }
    nonisolated static func mono(_ size: CGFloat = 13, settings: UserSettings = .shared) -> Font {
        .system(size: settings.fontSize(size), weight: .bold, design: .monospaced)
    }
    
    // MARK: - Mascot Assets
    static let mascotEmoji = "🦉" // Luna the Owl - wise, caring, guides you through the journey
    
    static func mascotGradient() -> LinearGradient {
        LinearGradient(
            colors: [mascotPrimary, mascotAccent],
            startPoint: .topLeading, endPoint: .bottomTrailing
        )
    }
}

// MARK: - Button Styles
struct PrimaryButtonStyle: ButtonStyle {
    var disabled = false
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(AppTheme.display(16, weight: .semibold))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(AppTheme.gradientPrimary.opacity(disabled ? 0 : 1))
            .background(AppTheme.elevated.opacity(disabled ? 1 : 0))
            .cornerRadius(AppTheme.cornerMd)
            .shadow(color: AppTheme.indigo.opacity(disabled ? 0 : 0.3), radius: 10, y: 4)
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .offset(y: configuration.isPressed ? 2 : 0)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 14, weight: .medium))
            .foregroundColor(AppTheme.textSub)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(AppTheme.elevated)
            .cornerRadius(AppTheme.cornerMd)
            .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerMd).stroke(AppTheme.borderStrong, lineWidth: 1))
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}

struct AccentButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(AppTheme.display(16, weight: .semibold))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(AppTheme.gradientAccent)
            .cornerRadius(AppTheme.cornerMd)
            .shadow(color: AppTheme.coral.opacity(0.3), radius: 10, y: 4)
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .offset(y: configuration.isPressed ? 2 : 0)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}

struct DestructiveButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 15, weight: .semibold))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Color.red.opacity(0.8))
            .cornerRadius(AppTheme.cornerMd)
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}
