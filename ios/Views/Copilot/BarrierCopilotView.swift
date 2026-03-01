import SwiftUI

struct BarrierCopilotView: View {
    @State private var logs: [IngredientLog] = LocalStore.shared.loadIngredients()
    @State private var showAdd = false
    @State private var barrierReset = false
    @State private var newName = ""
    @State private var newCat: IngredientCategory = .retinoid
    @State private var newFreq: Double = 3

    private var warnings: [String] {
        var w: [String] = []
        let retinoids = logs.filter { $0.category == .retinoid }
        let acids = logs.filter { $0.category == .acid }
        let bp = logs.filter { $0.category == .benzoyl_peroxide }
        let totalActive = retinoids.reduce(0) { $0 + $1.frequency } +
                          acids.reduce(0) { $0 + $1.frequency } +
                          bp.reduce(0) { $0 + $1.frequency }
        if totalActive > 10 { w.append("High total active frequency — risk of barrier damage.") }
        if !retinoids.isEmpty && !acids.isEmpty { w.append("Stacking retinoids + exfoliating acids may cause irritation.") }
        if bp.contains(where: { $0.frequency > 7 }) { w.append("Daily benzoyl peroxide can be drying — consider alternate days.") }
        return w
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Barrier Copilot").font(AppTheme.display(24)).foregroundColor(AppTheme.text)
                Text("Track your active ingredients. Informational only — not medical advice.")
                    .font(.system(size: 14)).foregroundColor(AppTheme.textMuted)

                // Warnings
                ForEach(warnings, id: \.self) { w in
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: "exclamationmark.triangle").foregroundColor(.red).font(.system(size: 14))
                        Text(w).font(.system(size: 14)).foregroundColor(AppTheme.text)
                    }
                    .padding(12)
                    .background(Color.red.opacity(0.1))
                    .cornerRadius(AppTheme.cornerMd)
                    .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerMd).stroke(Color.red.opacity(0.3), lineWidth: 1))
                }

                // Ingredient list
                if logs.isEmpty && !showAdd {
                    Text("No ingredients tracked yet.")
                        .font(.system(size: 14)).foregroundColor(AppTheme.textMuted)
                        .frame(maxWidth: .infinity).padding(.vertical, 48)
                }

                ForEach(logs) { log in
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(log.name).font(.system(size: 14, weight: .medium)).foregroundColor(AppTheme.text)
                            Text("\(log.category.label) · \(log.frequency)x/week")
                                .font(.system(size: 12)).foregroundColor(categoryColor(log.category))
                        }
                        Spacer()
                        Button("Remove") {
                            withAnimation { logs.removeAll { $0.id == log.id }; save() }
                        }
                        .font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
                    }
                    .padding(12)
                    .background(AppTheme.card)
                    .cornerRadius(AppTheme.cornerMd)
                    .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerMd).stroke(AppTheme.border, lineWidth: 1))
                }

                // Add form
                if showAdd {
                    VStack(spacing: 12) {
                        TextField("Ingredient name", text: $newName)
                            .textFieldStyle(.plain)
                            .padding(12)
                            .background(AppTheme.elevated)
                            .cornerRadius(AppTheme.cornerSm)
                            .foregroundColor(AppTheme.text)

                        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 8) {
                            ForEach(IngredientCategory.allCases) { cat in
                                Button { newCat = cat } label: {
                                    Text(cat.label)
                                        .font(.system(size: 12, weight: .medium))
                                        .foregroundColor(newCat == cat ? .white : AppTheme.textSub)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 10)
                                        .background(newCat == cat ? AppTheme.indigo : AppTheme.elevated)
                                        .cornerRadius(AppTheme.cornerSm)
                                }
                            }
                        }

                        VStack(alignment: .leading) {
                            Text("Frequency: \(Int(newFreq))x/week").font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
                            Slider(value: $newFreq, in: 1...14, step: 1).tint(AppTheme.indigo)
                        }

                        HStack(spacing: 8) {
                            Button("Add") { addIngredient() }.buttonStyle(PrimaryButtonStyle())
                            Button("Cancel") { withAnimation { showAdd = false } }.buttonStyle(SecondaryButtonStyle())
                        }
                    }
                    .padding(16)
                    .background(AppTheme.card)
                    .cornerRadius(AppTheme.cornerLg)
                    .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerLg).stroke(AppTheme.border, lineWidth: 1))
                } else {
                    Button {
                        withAnimation { showAdd = true }
                    } label: {
                        HStack {
                            Image(systemName: "plus").font(.system(size: 14))
                            Text("Add Ingredient").font(.system(size: 14, weight: .medium))
                        }
                        .foregroundColor(AppTheme.textSub)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(AppTheme.elevated)
                        .cornerRadius(AppTheme.cornerMd)
                    }
                }

                Spacer().frame(height: 16)

                // Barrier reset
                Button {
                    withAnimation { barrierReset.toggle() }
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "arrow.counterclockwise").foregroundColor(AppTheme.indigo)
                        Text("Barrier Reset Mode").font(.system(size: 14, weight: .medium)).foregroundColor(AppTheme.text)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(12)
                    .background(AppTheme.card)
                    .cornerRadius(AppTheme.cornerMd)
                    .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerMd).stroke(AppTheme.border, lineWidth: 1))
                }

                if barrierReset {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack(spacing: 8) {
                            Image(systemName: "checkmark.circle").foregroundColor(AppTheme.indigo)
                            Text("Pause all actives for 1–2 weeks").font(.system(size: 14, weight: .medium)).foregroundColor(AppTheme.text)
                        }
                        Text("Use only gentle cleanser + moisturizer + SPF. Let your skin barrier recover.")
                            .font(.system(size: 13)).foregroundColor(AppTheme.textMuted)
                        Text("This is informational guidance, not a diagnosis.")
                            .font(.system(size: 12)).italic().foregroundColor(AppTheme.textMuted)
                    }
                    .padding(16)
                    .background(AppTheme.indigo.opacity(0.1))
                    .cornerRadius(AppTheme.cornerMd)
                    .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerMd).stroke(AppTheme.indigo.opacity(0.3), lineWidth: 1))
                    .transition(.opacity.combined(with: .move(edge: .top)))
                }

                Spacer().frame(height: 100)
            }
            .padding(.horizontal, 16)
            .padding(.top, 16)
        }
        .background(AppTheme.bg)
    }

    private func addIngredient() {
        guard !newName.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        let entry = IngredientLog(id: UUID().uuidString, name: newName.trimmingCharacters(in: .whitespaces),
                                   category: newCat, frequency: Int(newFreq), lastUsed: Date())
        withAnimation { logs.append(entry); save(); newName = ""; showAdd = false }
    }
    private func save() { LocalStore.shared.saveIngredients(logs) }
    private func categoryColor(_ cat: IngredientCategory) -> Color {
        switch cat {
        case .retinoid: return AppTheme.coral
        case .acid: return AppTheme.gold
        case .benzoyl_peroxide: return AppTheme.sky
        case .other: return AppTheme.lime
        }
    }
}
