import SwiftUI

// MARK: - Mascot Avatar Component
struct MascotAvatar: View {
    let size: CGFloat
    let showGlow: Bool
    @StateObject private var settings = UserSettings.shared
    
    init(size: CGFloat = 40, showGlow: Bool = true) {
        self.size = size
        self.showGlow = showGlow
    }
    
    var body: some View {
        ZStack {
            Circle()
                .fill(AppTheme.mascotGradient())
                .frame(width: size, height: size)
                .shadow(
                    color: showGlow ? AppTheme.mascotPrimary.opacity(0.4) : Color.clear,
                    radius: showGlow ? size * 0.3 : 0,
                    y: showGlow ? 4 : 0
                )
            
            Text(AppTheme.mascotEmoji)
                .font(.system(size: size * 0.6))
        }
    }
}

// MARK: - Mascot Message Card
struct MascotMessageCard: View {
    let message: String
    let icon: String?
    @StateObject private var settings = UserSettings.shared
    @Environment(\.colorScheme) private var systemColorScheme
    
    init(message: String, icon: String? = nil) {
        self.message = message
        self.icon = icon
    }
    
    private var isLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            MascotAvatar(size: 36)
            
            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 6) {
                    Text(settings.mascotName)
                        .font(AppTheme.display(14, weight: .semibold, settings: settings))
                        .foregroundColor(AppTheme.mascotPrimary)
                    
                    if let icon = icon {
                        Image(systemName: icon)
                            .font(.system(size: 12))
                            .foregroundColor(AppTheme.mascotAccent)
                    }
                }
                
                Text(message)
                    .font(AppTheme.body(14, settings: settings))
                    .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                    .fixedSize(horizontal: false, vertical: true)
            }
            
            Spacer(minLength: 0)
        }
        .padding(16)
        .background(
            ZStack {
                AppTheme.card(highContrast: settings.highContrast, isLight: isLight)
                AppTheme.mascotGradient().opacity(0.05)
            }
        )
        .cornerRadius(AppTheme.cornerLg)
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.cornerLg)
                .stroke(AppTheme.mascotPrimary.opacity(0.2), lineWidth: 1)
        )
    }
}

// MARK: - Mascot Tip Card (for helpful hints)
struct MascotTipCard: View {
    let title: String
    let tip: String
    let dismissAction: (() -> Void)?
    @StateObject private var settings = UserSettings.shared
    @Environment(\.colorScheme) private var systemColorScheme
    
    init(title: String, tip: String, dismissAction: (() -> Void)? = nil) {
        self.title = title
        self.tip = tip
        self.dismissAction = dismissAction
    }
    
    private var isLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                HStack(spacing: 8) {
                    Text(AppTheme.mascotEmoji)
                        .font(.system(size: 24))
                    
                    Text(title)
                        .font(AppTheme.display(16, weight: .semibold, settings: settings))
                        .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                }
                
                Spacer()
                
                if let action = dismissAction {
                    Button(action: action) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 20))
                            .foregroundColor(AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight))
                    }
                }
            }
            
            Text(tip)
                .font(AppTheme.body(14, settings: settings))
                .foregroundColor(AppTheme.textSub(highContrast: settings.highContrast, isLight: isLight))
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(16)
        .background(
            ZStack {
                AppTheme.card(highContrast: settings.highContrast, isLight: isLight)
                AppTheme.mascotGradient().opacity(0.08)
            }
        )
        .cornerRadius(AppTheme.cornerLg)
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.cornerLg)
                .stroke(
                    LinearGradient(
                        colors: [AppTheme.mascotPrimary.opacity(0.5), AppTheme.mascotAccent.opacity(0.3)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 2
                )
        )
        .shadow(color: AppTheme.mascotPrimary.opacity(0.1), radius: 12, y: 4)
    }
}

// MARK: - Mascot Celebration (for achievements)
struct MascotCelebration: View {
    let message: String
    @StateObject private var settings = UserSettings.shared
    @State private var scale: CGFloat = 0.5
    @State private var rotation: Double = -10
    
    var body: some View {
        VStack(spacing: 16) {
            Text(AppTheme.mascotEmoji)
                .font(.system(size: 80))
                .scaleEffect(scale)
                .rotationEffect(.degrees(rotation))
                .onAppear {
                    if !settings.reduceMotion {
                        withAnimation(.spring(response: 0.6, dampingFraction: 0.6)) {
                            scale = 1.0
                            rotation = 0
                        }
                    } else {
                        scale = 1.0
                        rotation = 0
                    }
                }
            
            Text(message)
                .font(AppTheme.display(20, weight: .bold, settings: settings))
                .foregroundColor(AppTheme.mascotPrimary)
                .multilineTextAlignment(.center)
        }
        .padding(32)
    }
}

#Preview("Avatar") {
    VStack(spacing: 20) {
        MascotAvatar(size: 40)
        MascotAvatar(size: 60)
        MascotAvatar(size: 80, showGlow: false)
    }
    .padding()
    .background(AppTheme.bg)
}

#Preview("Message Card") {
    MascotMessageCard(
        message: "Great job! You're learning how filters work. Keep exploring!",
        icon: "sparkles"
    )
    .padding()
    .background(AppTheme.bg)
}

#Preview("Tip Card") {
    MascotTipCard(
        title: "\(UserSettings.shared.mascotName)'s Tip",
        tip: "Remember, everyone has pores and texture! What you see on social media often uses multiple filters and perfect lighting.",
        dismissAction: {}
    )
    .padding()
    .background(AppTheme.bg)
}

#Preview("Celebration") {
    MascotCelebration(message: "You completed your first week! 🎉")
        .background(AppTheme.bg)
}
