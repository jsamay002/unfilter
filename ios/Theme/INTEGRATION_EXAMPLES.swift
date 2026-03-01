// Example: How to update your existing views to support the new theming system

import SwiftUI

// MARK: - Template for Updating Existing Views

struct ExampleUpdatedView: View {
    // 1. Add settings state
    @StateObject private var settings = UserSettings.shared
    @Environment(\.colorScheme) private var systemColorScheme
    
    // 2. Add computed property for light mode detection
    private var isLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // 3. Use dynamic colors
                Text("Example Title")
                    .font(AppTheme.display(24, settings: settings)) // Dynamic font size
                    .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                
                Text("Example subtitle")
                    .font(AppTheme.body(14, settings: settings))
                    .foregroundColor(AppTheme.textSub(highContrast: settings.highContrast, isLight: isLight))
                
                // 4. Add mascot integration (optional)
                MascotMessageCard(
                    message: "Great work! You're making progress.",
                    icon: "sparkles"
                )
                
                // 5. Use dynamic backgrounds
                VStack {
                    Text("Card content")
                }
                .padding()
                .background(AppTheme.card(highContrast: settings.highContrast, isLight: isLight))
                .cornerRadius(AppTheme.cornerMd)
                .overlay(
                    RoundedRectangle(cornerRadius: AppTheme.cornerMd)
                        .stroke(AppTheme.border(highContrast: settings.highContrast, isLight: isLight), lineWidth: 1)
                )
            }
            .padding()
        }
        .background(AppTheme.bg(highContrast: settings.highContrast, isLight: isLight).ignoresSafeArea())
    }
}

// MARK: - Converting Buttons

struct ExampleButtonConversion: View {
    @StateObject private var settings = UserSettings.shared
    
    var body: some View {
        VStack(spacing: 12) {
            // Primary button with mascot gradient
            Button("Continue") {
                // action
            }
            .font(AppTheme.display(16, weight: .semibold, settings: settings))
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(AppTheme.mascotGradient()) // Use mascot colors!
            .cornerRadius(AppTheme.cornerMd)
            .shadow(color: AppTheme.mascotPrimary.opacity(0.3), radius: 10, y: 4)
        }
    }
}

// MARK: - Adding Animations with Reduce Motion Support

struct ExampleAnimationView: View {
    @StateObject private var settings = UserSettings.shared
    @State private var isExpanded = false
    
    var body: some View {
        VStack {
            Button("Toggle") {
                // Use reduce motion setting
                let animation: Animation = settings.reduceMotion ?
                    .linear(duration: 0.2) : .spring(response: 0.6, dampingFraction: 0.7)
                
                withAnimation(animation) {
                    isExpanded.toggle()
                }
            }
            
            if isExpanded {
                Text("Content")
            }
        }
    }
}

// MARK: - Quick Migration Checklist

/*
 For each view in your app:
 
 ✅ 1. Add UserSettings
    @StateObject private var settings = UserSettings.shared
    @Environment(\.colorScheme) private var systemColorScheme
 
 ✅ 2. Add isLight computed property
    private var isLight: Bool { ... }
 
 ✅ 3. Replace static colors with dynamic functions
    Before: AppTheme.text
    After:  AppTheme.text(highContrast: settings.highContrast, isLight: isLight)
 
 ✅ 4. Replace static fonts with dynamic versions
    Before: AppTheme.display(24)
    After:  AppTheme.display(24, settings: settings)
 
 ✅ 5. Use mascot gradient for primary actions
    .background(AppTheme.mascotGradient())
 
 ✅ 6. Add mascot components where appropriate
    - MascotMessageCard for tips
    - MascotTipCard for hints
    - MascotAvatar for profile/settings
 
 ✅ 7. Respect reduce motion in animations
    let animation: Animation = settings.reduceMotion ? .linear(duration: 0.2) : .spring(...)
 
 Priority views to update:
 1. DistortionLabView - Add mascot tips about filters
 2. BarrierCopilotView - Add mascot skincare guidance
 3. JournalView - Add mascot check-ins
 4. OnboardingFlow - Introduce Luna early
 5. PrivacyView - Move under Settings
 */
