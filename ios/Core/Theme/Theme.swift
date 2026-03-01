import SwiftUI

/// Unfilter design tokens — warm wellness aesthetic
/// Fraunces for display, system for body (SF Pro on iOS)
enum Theme {
    // MARK: - Colors

    static let accent = Color(hex: "4A7C59")
    static let accentDark = Color(hex: "3D5A3D")
    static let accentLight = Color(hex: "E8F0EB")

    static let coral = Color(hex: "C4553A")
    static let coralLight = Color(hex: "FDF0ED")

    static let amber = Color(hex: "D4862A")
    static let amberLight = Color(hex: "FEF6EC")

    static let textPrimary = Color(hex: "2D2620")
    static let textSecondary = Color(hex: "6B5E50")
    static let textTertiary = Color(hex: "8C7E6F")
    static let textMuted = Color(hex: "B5A899")

    static let bgPrimary = Color(hex: "FAF8F4")
    static let bgSecondary = Color(hex: "F0EDE7")
    static let bgCard = Color.white

    static let border = Color(hex: "E0DBD3")
    static let borderLight = Color(hex: "EDE8E0")

    // MARK: - Typography

    static let displayFont = "Fraunces"

    static func display(_ size: CGFloat, weight: Font.Weight = .bold) -> Font {
        .custom(displayFont, size: size).weight(weight)
    }

    static func title(_ size: CGFloat = 18) -> Font {
        .system(size: size, weight: .semibold, design: .default)
    }

    static func body(_ size: CGFloat = 15) -> Font {
        .system(size: size, weight: .regular, design: .default)
    }

    static func caption(_ size: CGFloat = 13) -> Font {
        .system(size: size, weight: .medium, design: .default)
    }

    static func label(_ size: CGFloat = 12) -> Font {
        .system(size: size, weight: .bold, design: .default)
    }

    // MARK: - Spacing

    static let radiusSm: CGFloat = 8
    static let radiusMd: CGFloat = 14
    static let radiusLg: CGFloat = 20

    static let paddingSm: CGFloat = 12
    static let paddingMd: CGFloat = 16
    static let paddingLg: CGFloat = 24
}

// MARK: - Hex Color Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: .alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, (int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = ((int >> 24) & 0xFF, (int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
