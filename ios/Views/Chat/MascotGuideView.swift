import SwiftUI

// MARK: - Mascot Character Guide
struct MascotGuideView: View {
    @StateObject private var settings = UserSettings.shared
    @Environment(\.colorScheme) private var systemColorScheme
    @Environment(\.dismiss) private var dismiss
    
    private var isLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Hero Section
                heroSection
                
                // Personality
                personalitySection
                
                // Mission
                missionSection
                
                // Tips from Luna
                tipsSection
                
                Spacer().frame(height: 60)
            }
            .padding(.horizontal, 16)
            .padding(.top, 20)
        }
        .background(AppTheme.bg(highContrast: settings.highContrast, isLight: isLight).ignoresSafeArea())
        .navigationTitle("About \(settings.mascotName)")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    // MARK: - Hero Section
    private var heroSection: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(AppTheme.mascotGradient())
                    .frame(width: 120, height: 120)
                    .shadow(color: AppTheme.mascotPrimary.opacity(0.5), radius: 20, y: 8)
                
                Text(AppTheme.mascotEmoji)
                    .font(.system(size: 72))
            }
            
            Text(settings.mascotName)
                .font(AppTheme.display(32, settings: settings))
                .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
            
            Text("Your Wise Companion")
                .font(AppTheme.body(16, weight: .medium, settings: settings))
                .foregroundColor(AppTheme.mascotPrimary)
            
            Text("Helping you see through digital distortions and build healthy habits")
                .font(AppTheme.body(14, settings: settings))
                .foregroundColor(AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
        }
    }
    
    // MARK: - Personality
    private var personalitySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Personality")
                .font(AppTheme.display(20, settings: settings))
                .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
            
            VStack(spacing: 8) {
                TraitCard(emoji: "🦉", trait: "Wise", description: "Shares knowledge about filters and skincare")
                TraitCard(emoji: "💜", trait: "Caring", description: "Supports your journey with encouragement")
                TraitCard(emoji: "✨", trait: "Honest", description: "Tells you the truth about digital distortions")
                TraitCard(emoji: "🌟", trait: "Empowering", description: "Helps you build confidence in your real skin")
            }
        }
    }
    
    // MARK: - Mission
    private var missionSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Mission")
                .font(AppTheme.display(20, settings: settings))
                .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
            
            Text("\(settings.mascotName) is here to guide you through understanding how digital filters work, why they distort reality, and how to develop a healthier relationship with skincare and social media.\n\nThrough the Distortion Lab, Barrier Copilot, and educational chat, \(settings.mascotName) helps you see the real you — pores, texture, and all the beautiful imperfections that make you human.")
                .font(AppTheme.body(15, settings: settings))
                .foregroundColor(AppTheme.textSub(highContrast: settings.highContrast, isLight: isLight))
                .fixedSize(horizontal: false, vertical: true)
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
                        .stroke(AppTheme.mascotPrimary.opacity(0.3), lineWidth: 1)
                )
        }
    }
    
    // MARK: - Tips
    private var tipsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 8) {
                Text(AppTheme.mascotEmoji)
                    .font(.system(size: 24))
                Text("\(settings.mascotName)'s Favorite Reminders")
                    .font(AppTheme.display(20, settings: settings))
                    .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
            }
            
            VStack(spacing: 12) {
                TipBubble(tip: "Everyone has pores. They're not a flaw — they're essential for healthy skin!")
                TipBubble(tip: "That 'poreless' look online? It's blur filters, not genetics.")
                TipBubble(tip: "More skincare products ≠ better skin. Your barrier needs balance, not overload.")
                TipBubble(tip: "Confidence comes from within, not from how 'smooth' a camera makes you look.")
                TipBubble(tip: "Your real skin is beautiful — texture, tone variation, and all!")
            }
        }
    }
}

// MARK: - Supporting Views
struct TraitCard: View {
    let emoji: String
    let trait: String
    let description: String
    @StateObject private var settings = UserSettings.shared
    @Environment(\.colorScheme) private var systemColorScheme
    
    private var isLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }
    
    var body: some View {
        HStack(spacing: 12) {
            Text(emoji)
                .font(.system(size: 28))
                .frame(width: 40)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(trait)
                    .font(AppTheme.body(15, weight: .semibold, settings: settings))
                    .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                
                Text(description)
                    .font(AppTheme.body(13, settings: settings))
                    .foregroundColor(AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight))
            }
            
            Spacer()
        }
        .padding(12)
        .background(AppTheme.card(highContrast: settings.highContrast, isLight: isLight))
        .cornerRadius(AppTheme.cornerMd)
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.cornerMd)
                .stroke(AppTheme.border(highContrast: settings.highContrast, isLight: isLight), lineWidth: 1)
        )
    }
}

struct TipBubble: View {
    let tip: String
    @StateObject private var settings = UserSettings.shared
    @Environment(\.colorScheme) private var systemColorScheme
    
    private var isLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }
    
    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Circle()
                .fill(AppTheme.mascotPrimary)
                .frame(width: 6, height: 6)
                .padding(.top, 6)
            
            Text(tip)
                .font(AppTheme.body(14, settings: settings))
                .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(12)
        .background(
            ZStack {
                AppTheme.card(highContrast: settings.highContrast, isLight: isLight)
                AppTheme.mascotGradient().opacity(0.03)
            }
        )
        .cornerRadius(AppTheme.cornerMd)
    }
}

#Preview {
    NavigationView {
        MascotGuideView()
    }
}
