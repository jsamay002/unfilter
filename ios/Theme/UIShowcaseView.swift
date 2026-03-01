import SwiftUI

// MARK: - UI Preview Showcase
// This file demonstrates all the new UI components

struct UIShowcaseView: View {
    @StateObject private var settings = UserSettings.shared
    @Environment(\.colorScheme) private var systemColorScheme
    
    private var isLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }
    
    var body: some View {
            ScrollView {
                VStack(spacing: 24) {
                    Group {
                        mascotComponentsSection
                        textSizesSection
                        themeColorsSection
                    }
                    Group {
                        gradientsSection
                        buttonStylesSection
                        accessibilityStatesSection
                    }
                    Spacer().frame(height: 60)
                }
                .padding()
            }
        .background(AppTheme.bg(highContrast: settings.highContrast, isLight: isLight).ignoresSafeArea())
        .navigationTitle("UI Showcase")
        .navigationBarTitleDisplayMode(.inline)
    }
    
    // MARK: - Section Views
    
    private var mascotComponentsSection: some View {
        VStack(spacing: 24) {
            sectionHeader("Mascot Components")
            
            MascotAvatar(size: 60)
            
            MascotMessageCard(
                message: "Hi! I'm \(settings.mascotName). I'll help you understand digital filters!",
                icon: "sparkles"
            )
            
            MascotTipCard(
                title: "\(settings.mascotName)'s Tip",
                tip: "Everyone has pores! They're not a flaw, they're essential for healthy skin.",
                dismissAction: {}
            )
        }
    }
    
    private var textSizesSection: some View {
            VStack(spacing: 24) {
                sectionHeader("Text Size Options")
                
                HStack(spacing: 8) {
                    ForEach(TextSize.allCases, id: \.self) { size in
                        textSizeItem(size)
                    }
                }
            }
        }
        
        private func textSizeItem(_ size: TextSize) -> some View {
            let isSelected = settings.textSize == size
            return VStack {
                Text("Aa")
                    .font(.system(size: size.multiplier * 20))
                Text(size.label)
                    .font(.system(size: 10))
            }
            .padding()
            .background(isSelected ? AnyShapeStyle(AppTheme.mascotGradient()) : AnyShapeStyle(AppTheme.card(highContrast: settings.highContrast, isLight: isLight)))
            .foregroundColor(isSelected ? .white : AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
            .cornerRadius(12)
        }
    private var themeColorsSection: some View {
        VStack(spacing: 24) {
            sectionHeader("Theme Colors")
            
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                colorSwatch("Mascot Primary", AppTheme.mascotPrimary)
                colorSwatch("Mascot Accent", AppTheme.mascotAccent)
                colorSwatch("Indigo", AppTheme.indigo)
                colorSwatch("Coral", AppTheme.coral)
                colorSwatch("Lime", AppTheme.lime)
                colorSwatch("Gold", AppTheme.gold)
            }
        }
    }
    
    private var gradientsSection: some View {
        VStack(spacing: 24) {
            sectionHeader("Gradients")
            
            VStack(spacing: 8) {
                gradientSwatch("Mascot Gradient", AppTheme.mascotGradient())
                gradientSwatch("Primary Gradient", AppTheme.gradientPrimary)
                gradientSwatch("Accent Gradient", AppTheme.gradientAccent)
            }
        }
    }
    
    private var buttonStylesSection: some View {
        VStack(spacing: 24) {
            sectionHeader("Button Styles")
            
            Button("Mascot Primary") {}
                .font(AppTheme.display(16, weight: .semibold, settings: settings))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(AppTheme.mascotGradient())
                .cornerRadius(AppTheme.cornerMd)
                .shadow(color: AppTheme.mascotPrimary.opacity(0.3), radius: 10, y: 4)
            
            Button("Primary Button") {}
                .buttonStyle(PrimaryButtonStyle())
            
            Button("Secondary Button") {}
                .buttonStyle(SecondaryButtonStyle())
            
            Button("Accent Button") {}
                .buttonStyle(AccentButtonStyle())
        }
    }
    
    private var accessibilityStatesSection: some View {
        VStack(spacing: 24) {
            sectionHeader("Accessibility States")
            
            VStack(spacing: 12) {
                infoRow("Text Size", settings.textSize.label)
                infoRow("Appearance", settings.appearanceMode.label)
                infoRow("High Contrast", settings.highContrast ? "On" : "Off")
                infoRow("Reduce Motion", settings.reduceMotion ? "On" : "Off")
                infoRow("Mascot Name", settings.mascotName)
            }
        }
    }
    
    // MARK: - Helper Views
    
    private func sectionHeader(_ title: String) -> some View {
        HStack {
            Text(title)
                .font(AppTheme.display(18, settings: settings))
                .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
            Spacer()
        }
        .padding(.top, 8)
    }
    
    private func colorSwatch(_ name: String, _ color: Color) -> some View {
        VStack(spacing: 8) {
            RoundedRectangle(cornerRadius: 12)
                .fill(color)
                .frame(height: 60)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(AppTheme.border(highContrast: settings.highContrast, isLight: isLight), lineWidth: 1)
                )
            
            Text(name)
                .font(AppTheme.body(12, settings: settings))
                .foregroundColor(AppTheme.textSub(highContrast: settings.highContrast, isLight: isLight))
        }
    }
    
    private func gradientSwatch(_ name: String, _ gradient: LinearGradient) -> some View {
        VStack(spacing: 8) {
            RoundedRectangle(cornerRadius: 12)
                .fill(gradient)
                .frame(height: 50)
                .overlay(
                    Text(name)
                        .font(AppTheme.body(14, weight: .semibold, settings: settings))
                        .foregroundColor(.white)
                )
        }
    }
    
    private func infoRow(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label)
                .font(AppTheme.body(14, settings: settings))
                .foregroundColor(AppTheme.textSub(highContrast: settings.highContrast, isLight: isLight))
            
            Spacer()
            
            Text(value)
                .font(AppTheme.body(14, weight: .semibold, settings: settings))
                .foregroundColor(AppTheme.mascotPrimary)
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

#Preview {
    NavigationView {
        UIShowcaseView()
    }
}
