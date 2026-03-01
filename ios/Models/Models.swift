import Foundation

// MARK: - Distortion Lab
enum LightingPreset: String, Codable, CaseIterable, Identifiable {
    case natural, ring, golden, studio
    var id: String { rawValue }
    var label: String {
        switch self {
        case .natural: return "Natural"
        case .ring: return "Ring"
        case .golden: return "Golden Hour"
        case .studio: return "Studio"
        }
    }
    var emoji: String {
        switch self {
        case .natural: return "☀️"
        case .ring: return "💡"
        case .golden: return "🌅"
        case .studio: return "📸"
        }
    }
}

struct DistortionSettings {
    var blur: Double = 0          // 0-100
    var toneFlatten: Double = 0   // 0-100
    var shadowReduce: Double = 0  // 0-100
    var lighting: LightingPreset = .natural

    var isDistorted: Bool {
        blur > 2 || toneFlatten > 2 || shadowReduce > 2 || lighting != .natural
    }
}

// MARK: - Journal
struct JournalEntry: Codable, Identifiable {
    let id: String
    let date: Date
    var routine: String
    var confidence: Int       // 1-5
    var irritation: Int       // 0-3
    var avoidanceBehaviors: [String]
    var notes: String

    static let confidenceEmoji = ["", "😞", "😕", "😐", "🙂", "😊"]
}

// MARK: - Barrier Copilot
enum IngredientCategory: String, Codable, CaseIterable, Identifiable {
    case retinoid, acid, benzoyl_peroxide, other
    var id: String { rawValue }
    var label: String {
        switch self {
        case .retinoid: return "Retinoid"
        case .acid: return "Exfoliating Acid"
        case .benzoyl_peroxide: return "Benzoyl Peroxide"
        case .other: return "Other Active"
        }
    }
    var color: String {
        switch self {
        case .retinoid: return "coral"
        case .acid: return "gold"
        case .benzoyl_peroxide: return "sky"
        case .other: return "lime"
        }
    }
}

struct IngredientLog: Codable, Identifiable {
    let id: String
    var name: String
    var category: IngredientCategory
    var frequency: Int     // times per week
    var lastUsed: Date
}

// MARK: - Chat
struct ChatMessage: Codable, Identifiable {
    let id: String
    let role: MessageRole
    let content: String
    let timestamp: Date
}

enum MessageRole: String, Codable {
    case user, assistant
}

// MARK: - Persistence (UserDefaults based, on-device only)
final class LocalStore {
    static let shared = LocalStore()
    private let defaults = UserDefaults.standard

    // Journal
    func saveJournal(_ entries: [JournalEntry]) {
        if let data = try? JSONEncoder().encode(entries) {
            defaults.set(data, forKey: "unfilter-journal")
        }
    }
    func loadJournal() -> [JournalEntry] {
        guard let data = defaults.data(forKey: "unfilter-journal"),
              let entries = try? JSONDecoder().decode([JournalEntry].self, from: data) else { return [] }
        return entries
    }

    // Ingredients
    func saveIngredients(_ logs: [IngredientLog]) {
        if let data = try? JSONEncoder().encode(logs) {
            defaults.set(data, forKey: "unfilter-ingredients")
        }
    }
    func loadIngredients() -> [IngredientLog] {
        guard let data = defaults.data(forKey: "unfilter-ingredients"),
              let logs = try? JSONDecoder().decode([IngredientLog].self, from: data) else { return [] }
        return logs
    }

    // Chat
    func saveChat(_ messages: [ChatMessage]) {
        if let data = try? JSONEncoder().encode(messages) {
            defaults.set(data, forKey: "unfilter-chat")
        }
    }
    func loadChat() -> [ChatMessage] {
        guard let data = defaults.data(forKey: "unfilter-chat"),
              let msgs = try? JSONDecoder().decode([ChatMessage].self, from: data) else { return [] }
        return msgs
    }

    // Onboarding
    var onboarded: Bool {
        get { defaults.bool(forKey: "unfilter-onboarded") }
        set { defaults.set(newValue, forKey: "unfilter-onboarded") }
    }

    // Delete all
    func deleteAll() {
        for key in ["unfilter-journal", "unfilter-ingredients", "unfilter-chat", "unfilter-onboarded"] {
            defaults.removeObject(forKey: key)
        }
    }
}

// MARK: - Avoidance behaviors (Journal)
let avoidanceBehaviorOptions = [
    "Skipped going out",
    "Used heavy filter",
    "Avoided mirror",
    "Compared to others online",
    "Covered face",
]
