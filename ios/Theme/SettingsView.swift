import SwiftUI

struct SettingsView: View {
    @StateObject private var settings = UserSettings.shared
    @Environment(\.colorScheme) private var systemColorScheme
    @State private var showMascotNameEditor = false
    @State private var tempMascotName = ""
    
    private var isLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }
    
    var body: some View {
        NavigationView {
            settingsContent
        }
        .sheet(isPresented: $showMascotNameEditor) {
            mascotNameEditor
        }
    }
    
    private var settingsContent: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Mascot Header
                mascotHeader
                
                // Text Size Section
                textSizeSection
                
                // Appearance Section
                appearanceSection
                
                // Accessibility Section
                accessibilitySection
                
                // About Luna
                aboutMascotSection
                
                Spacer().frame(height: 100)
            }
            .padding(.horizontal, 16)
            .padding(.top, 16)
        }
        .background(AppTheme.bg(highContrast: settings.highContrast, isLight: isLight).ignoresSafeArea())
        .navigationBarHidden(true)
    }
    
    // MARK: - Mascot Header
    private var mascotHeader: some View {
        VStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(AppTheme.mascotGradient())
                    .frame(width: 80, height: 80)
                    .shadow(color: AppTheme.mascotPrimary.opacity(0.4), radius: 12, y: 4)
                
                Text(AppTheme.mascotEmoji)
                    .font(.system(size: 48))
            }
            
            Text("Settings")
                .font(AppTheme.display(28, settings: settings))
                .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
            
            Text("Customize your experience with \(settings.mascotName)")
                .font(AppTheme.body(14, settings: settings))
                .foregroundColor(AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight))
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
    }
    
    // MARK: - Text Size Section
    private var textSizeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(
                icon: "textformat.size",
                title: "Text Size",
                subtitle: "Adjust reading comfort",
                settings: settings,
                isLight: isLight
            )
            
            HStack(spacing: 8) {
                ForEach(TextSize.allCases, id: \.self) { size in
                    textSizeButton(for: size)
                }
            }
        }
    }
    
    @ViewBuilder
    private func textSizeButton(for size: TextSize) -> some View {
        let isSelected = settings.textSize == size
        
        Button {
            withAnimation(.spring(response: 0.3)) {
                settings.textSize = size
            }
        } label: {
            VStack(spacing: 8) {
                Text("Aa")
                    .font(.system(size: size.multiplier * 20, weight: .semibold))
                Text(size.label)
                    .font(.system(size: 11, weight: .medium))
            }
            .foregroundColor(
                isSelected ?
                .white : AppTheme.textSub(highContrast: settings.highContrast, isLight: isLight)
            )
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Group {
                if isSelected {
                    AppTheme.mascotGradient()
                } else {
                    AppTheme.card(highContrast: settings.highContrast, isLight: isLight)
                }
            })
            .cornerRadius(AppTheme.cornerMd)
            .overlay(
                RoundedRectangle(cornerRadius: AppTheme.cornerMd)
                    .stroke(
                        isSelected ?
                        Color.clear : AppTheme.border(highContrast: settings.highContrast, isLight: isLight),
                        lineWidth: 1
                    )
            )
            .shadow(
                color: isSelected ? AppTheme.mascotPrimary.opacity(0.3) : Color.clear,
                radius: 8,
                y: 2
            )
        }
        .buttonStyle(.plain)
    }
    
    // MARK: - Appearance Section
    private var appearanceSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(
                icon: "moon.stars",
                title: "Appearance",
                subtitle: "Choose your theme",
                settings: settings,
                isLight: isLight
            )
            
            VStack(spacing: 8) {
                ForEach(AppearanceMode.allCases, id: \.self) { mode in
                    AppearanceModeButton(mode: mode, settings: settings, isLight: isLight)
                }
            }
        }
    }
    
    // MARK: - Accessibility Section
    private var accessibilitySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            SectionHeader(
                icon: "accessibility",
                title: "Accessibility",
                subtitle: "Enhance visibility",
                settings: settings,
                isLight: isLight
            )
            
            VStack(spacing: 8) {
                ToggleCard(
                    icon: "circle.lefthalf.filled",
                    title: "High Contrast",
                    description: "Increase color contrast for better visibility",
                    isOn: $settings.highContrast,
                    settings: settings,
                    isLight: isLight
                )
                
                ToggleCard(
                    icon: "figure.walk.motion",
                    title: "Reduce Motion",
                    description: "Minimize animations and transitions",
                    isOn: $settings.reduceMotion,
                    settings: settings,
                    isLight: isLight
                )
            }
        }
    }
    
    // MARK: - About Mascot Section
    private var aboutMascotSection: some View {
        NavigationLink(destination: MascotGuideView()) {
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 8) {
                    Text(AppTheme.mascotEmoji)
                        .font(.system(size: 24))
                    
                    VStack(alignment: .leading, spacing: 2) {
                        HStack(spacing: 8) {
                            Text("Meet \(settings.mascotName)")
                                .font(AppTheme.display(18, settings: settings))
                                .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                            
                            Button {
                                tempMascotName = settings.mascotName
                                showMascotNameEditor = true
                            } label: {
                                Image(systemName: "pencil.circle.fill")
                                    .font(.system(size: 16))
                                    .foregroundColor(AppTheme.mascotPrimary)
                            }
                            .buttonStyle(.plain)
                        }
                        
                        Text("Your wise companion")
                            .font(AppTheme.body(12, settings: settings))
                            .foregroundColor(AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight))
                    }
                    
                    Spacer()
                    
                    Image(systemName: "chevron.right")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight))
                }
                
                Text("\(settings.mascotName) is here to guide you through your journey of understanding digital filters and building healthy skincare habits. Tap to learn more! 🦉✨")
                    .font(AppTheme.body(14, settings: settings))
                    .foregroundColor(AppTheme.textSub(highContrast: settings.highContrast, isLight: isLight))
                    .padding(16)
                    .frame(maxWidth: .infinity, alignment: .leading)
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
        .buttonStyle(.plain)
    }
    
    // MARK: - Mascot Name Editor
    private var mascotNameEditor: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text(AppTheme.mascotEmoji)
                    .font(.system(size: 80))
                    .padding(.top, 40)
                
                Text("Give me a name!")
                    .font(AppTheme.display(24, settings: settings))
                    .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                
                TextField("Enter name", text: $tempMascotName)
                    .textFieldStyle(.plain)
                    .font(AppTheme.body(16, settings: settings))
                    .padding(16)
                    .background(AppTheme.card(highContrast: settings.highContrast, isLight: isLight))
                    .cornerRadius(AppTheme.cornerMd)
                    .overlay(
                        RoundedRectangle(cornerRadius: AppTheme.cornerMd)
                            .stroke(AppTheme.border(highContrast: settings.highContrast, isLight: isLight), lineWidth: 1)
                    )
                    .padding(.horizontal, 20)
                
                Button {
                    if !tempMascotName.trimmingCharacters(in: .whitespaces).isEmpty {
                        settings.mascotName = tempMascotName
                    }
                    showMascotNameEditor = false
                } label: {
                    Text("Save")
                        .font(AppTheme.display(16, weight: .semibold, settings: settings))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(AppTheme.mascotGradient())
                        .cornerRadius(AppTheme.cornerMd)
                        .shadow(color: AppTheme.mascotPrimary.opacity(0.3), radius: 10, y: 4)
                }
                .padding(.horizontal, 20)
                
                Spacer()
            }
            .background(AppTheme.bg(highContrast: settings.highContrast, isLight: isLight).ignoresSafeArea())
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        showMascotNameEditor = false
                    }
                    .foregroundColor(AppTheme.textSub(highContrast: settings.highContrast, isLight: isLight))
                }
            }
        }
    }
}

// MARK: - Supporting Views

struct SectionHeader: View {
    let icon: String
    let title: String
    let subtitle: String
    let settings: UserSettings
    let isLight: Bool
    
    var body: some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(AppTheme.mascotPrimary)
                .frame(width: 24)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(AppTheme.display(18, settings: settings))
                    .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                
                Text(subtitle)
                    .font(AppTheme.body(12, settings: settings))
                    .foregroundColor(AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight))
            }
        }
        .padding(.top, 8)
    }
}

struct AppearanceModeButton: View {
    let mode: AppearanceMode
    let settings: UserSettings
    let isLight: Bool
    
    var body: some View {
        Button {
            withAnimation(.spring(response: 0.3)) {
                settings.appearanceMode = mode
            }
        } label: {
            HStack {
                Image(systemName: iconName)
                    .font(.system(size: 18))
                    .foregroundColor(
                        settings.appearanceMode == mode ?
                        AppTheme.mascotPrimary : AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight)
                    )
                    .frame(width: 24)
                
                Text(mode.label)
                    .font(AppTheme.body(15, weight: .medium, settings: settings))
                    .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                
                Spacer()
                
                if settings.appearanceMode == mode {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(AppTheme.mascotPrimary)
                }
            }
            .padding(16)
            .background(AppTheme.card(highContrast: settings.highContrast, isLight: isLight))
            .cornerRadius(AppTheme.cornerMd)
            .overlay(
                RoundedRectangle(cornerRadius: AppTheme.cornerMd)
                    .stroke(
                        settings.appearanceMode == mode ?
                        AppTheme.mascotPrimary : AppTheme.border(highContrast: settings.highContrast, isLight: isLight),
                        lineWidth: settings.appearanceMode == mode ? 2 : 1
                    )
            )
        }
        .buttonStyle(.plain)
    }
    
    private var iconName: String {
        switch mode {
        case .light: return "sun.max.fill"
        case .dark: return "moon.fill"
        case .system: return "circle.lefthalf.filled"
        }
    }
}

struct ToggleCard: View {
    let icon: String
    let title: String
    let description: String
    @Binding var isOn: Bool
    let settings: UserSettings
    let isLight: Bool
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(AppTheme.mascotPrimary)
                .frame(width: 24)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(AppTheme.body(15, weight: .medium, settings: settings))
                    .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                
                Text(description)
                    .font(AppTheme.body(12, settings: settings))
                    .foregroundColor(AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight))
            }
            
            Spacer()
            
            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(AppTheme.mascotPrimary)
        }
        .padding(16)
        .background(AppTheme.card(highContrast: settings.highContrast, isLight: isLight))
        .cornerRadius(AppTheme.cornerMd)
        .overlay(
            RoundedRectangle(cornerRadius: AppTheme.cornerMd)
                .stroke(AppTheme.border(highContrast: settings.highContrast, isLight: isLight), lineWidth: 1)
        )
    }
}

#Preview {
    SettingsView()
}
