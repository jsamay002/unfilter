import SwiftUI

struct ChatView: View {
    @StateObject private var settings = UserSettings.shared
    @Environment(\.colorScheme) private var systemColorScheme
    @State private var messages: [ChatMessage] = {
        let stored = LocalStore.shared.loadChat()
        if stored.isEmpty {
            return [ChatMessage(id: "welcome", role: .assistant,
                content: "Hi! I'm \(UserSettings.shared.mascotName), your Unfilter companion! 🦉 Ask me about how filters work, what blur does to skin perception, or about skincare ingredients. Remember: this is educational, not medical advice. 💜",
                timestamp: Date())]
        }
        return stored
    }()
    @State private var input = ""
    
    private var isLight: Bool {
        if settings.appearanceMode == .system {
            return systemColorScheme == .light
        }
        return settings.appearanceMode == .light
    }

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(AppTheme.mascotGradient())
                        .frame(width: 32, height: 32)
                        .shadow(color: AppTheme.mascotPrimary.opacity(0.3), radius: 4, y: 2)
                    
                    Text(AppTheme.mascotEmoji)
                        .font(.system(size: 18))
                }
                
                VStack(alignment: .leading, spacing: 1) {
                    Text("Chat with \(settings.mascotName)")
                        .font(AppTheme.display(18, settings: settings))
                        .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                    
                    Text("Your educational assistant")
                        .font(AppTheme.body(12, settings: settings))
                        .foregroundColor(AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight))
                }
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .overlay(alignment: .bottom) {
                Rectangle()
                    .fill(AppTheme.border(highContrast: settings.highContrast, isLight: isLight))
                    .frame(height: 1)
            }

            // Messages
            ScrollViewReader { proxy in
                ScrollView {
                    VStack(spacing: 12) {
                        ForEach(messages) { msg in
                            MessageBubbleView(
                                message: msg,
                                settings: settings,
                                isLight: isLight
                            )
                        }
                    }
                    .padding(16)
                }
                .onChange(of: messages.count) { _, _ in
                    if let last = messages.last {
                        withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                    }
                }
            }

            // Disclaimer + Input
            VStack(spacing: 8) {
                HStack(spacing: 4) {
                    Image(systemName: "exclamationmark.circle")
                        .font(AppTheme.body(11, settings: settings))
                    Text("Educational only — not medical advice")
                        .font(AppTheme.body(11, settings: settings))
                }
                .foregroundColor(AppTheme.textMuted(highContrast: settings.highContrast, isLight: isLight))

                HStack(spacing: 8) {
                    TextField("Ask \(settings.mascotName) about filters...", text: $input)
                        .textFieldStyle(.plain)
                        .font(AppTheme.body(16, settings: settings))
                        .padding(12)
                        .background(AppTheme.card(highContrast: settings.highContrast, isLight: isLight))
                        .cornerRadius(AppTheme.cornerMd)
                        .overlay(
                            RoundedRectangle(cornerRadius: AppTheme.cornerMd)
                                .stroke(AppTheme.border(highContrast: settings.highContrast, isLight: isLight), lineWidth: 1)
                        )
                        .foregroundColor(AppTheme.text(highContrast: settings.highContrast, isLight: isLight))
                        .onSubmit { sendMessage() }

                    Button { sendMessage() } label: {
                        Image(systemName: "arrow.up")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                            .background(AppTheme.mascotGradient())
                            .cornerRadius(AppTheme.cornerMd)
                            .shadow(color: AppTheme.mascotPrimary.opacity(0.3), radius: 8, y: 2)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(AppTheme.surface(highContrast: settings.highContrast, isLight: isLight))
        }
        .background(AppTheme.bg(highContrast: settings.highContrast, isLight: isLight))
    }

    private func sendMessage() {
        let text = input.trimmingCharacters(in: .whitespaces)
        guard !text.isEmpty else { return }
        let userMsg = ChatMessage(id: UUID().uuidString, role: .user, content: text, timestamp: Date())
        let botMsg = ChatMessage(id: UUID().uuidString, role: .assistant, content: findResponse(text, mascotName: settings.mascotName), timestamp: Date())
        
        let animation: Animation = settings.reduceMotion ? .linear(duration: 0.2) : .default
        withAnimation(animation) {
            messages.append(userMsg)
            messages.append(botMsg)
        }
        input = ""
        LocalStore.shared.saveChat(messages)
    }
}

// MARK: - Educational Responses (from Chatbot.tsx)
private let educationalResponses: [(keyword: String, response: String)] = [
    ("blur", "Gaussian blur works by averaging pixel values with their neighbors, effectively removing fine detail like pores and texture. Social media filters often apply this at 2-8px radius — enough to 'smooth' skin while keeping features recognizable."),
    ("contrast", "Contrast compression reduces the difference between light and dark areas. In skin, this means natural shadows from pores and texture lines become less visible, creating an artificially even surface."),
    ("lighting", "Lighting dramatically changes skin perception. Ring lights create even, shadowless illumination that flattens texture. Golden hour adds warm tones that mask redness. Studio lighting can be positioned to minimize shadow depth."),
    ("filter", "Most beauty filters combine multiple effects: gaussian blur for texture, contrast reduction for tone evening, color grading for warmth, and sometimes facial reshaping. They're designed to look 'natural' while being anything but."),
    ("retinoid", "Retinoids (like retinol or tretinoin) increase skin cell turnover. While effective for many concerns, using them too frequently or stacking with other actives can damage your skin barrier, causing dryness, redness, and increased sensitivity."),
    ("barrier", "Your skin barrier is the outermost layer that protects against irritants and retains moisture. Over-exfoliation, too many actives, or harsh products can compromise it. Signs include tightness, stinging, redness, and increased breakouts."),
    ("pores", "Everyone has pores — they're essential for skin health. What you see as 'poreless' skin online is almost always the result of blur filters, specific lighting, or heavy makeup. Pore size is largely genetic."),
]

private func findResponse(_ input: String, mascotName: String) -> String {
    let lower = input.lowercased()
    for (keyword, response) in educationalResponses {
        if lower.contains(keyword) { return response }
    }
    return "That's a great question! I'm \(mascotName), and I'm here to help you understand how digital filters distort skin appearance and how to build healthy skincare habits. Try asking about blur, contrast, lighting, filters, retinoids, skin barrier, or pores. 🦉"
}
// MARK: - Message Bubble View
struct MessageBubbleView: View {
    let message: ChatMessage
    let settings: UserSettings
    let isLight: Bool
    
    var body: some View {
        HStack {
            if message.role == .user { Spacer(minLength: 48) }
            
            bubbleContent
            
            if message.role == .assistant { Spacer(minLength: 48) }
        }
        .id(message.id)
    }
    
    private var bubbleContent: some View {
        HStack(spacing: 8) {
            // Show mascot for assistant messages
            if message.role == .assistant {
                Text(AppTheme.mascotEmoji)
                    .font(.system(size: 16))
            }
            
            Text(message.content)
                .font(AppTheme.body(14, settings: settings))
                .foregroundColor(textColor)
        }
        .padding(12)
        .background(backgroundColor)
        .cornerRadius(16)
        .overlay(borderOverlay)
        .shadow(color: shadowColor, radius: 4, y: 2)
    }
    
    private var textColor: Color {
        message.role == .user ?
        .white : AppTheme.text(highContrast: settings.highContrast, isLight: isLight)
    }
    
    @ViewBuilder
    private var backgroundColor: some View {
        if message.role == .user {
            AppTheme.mascotGradient()
        } else {
            AppTheme.card(highContrast: settings.highContrast, isLight: isLight)
        }
    }
    
    private var borderOverlay: some View {
        Group {
            if message.role == .assistant {
                RoundedRectangle(cornerRadius: 16)
                    .stroke(AppTheme.border(highContrast: settings.highContrast, isLight: isLight), lineWidth: 1)
            }
        }
    }
    
    private var shadowColor: Color {
        message.role == .user ? AppTheme.mascotPrimary.opacity(0.2) : Color.clear
    }
}

