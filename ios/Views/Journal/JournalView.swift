import SwiftUI

struct JournalView: View {
    @State private var entries: [JournalEntry] = LocalStore.shared.loadJournal()
    @State private var showNew = false
    @State private var routine = ""
    @State private var confidence: Double = 3
    @State private var irritation: Double = 0
    @State private var avoidance: Set<String> = []
    @State private var notes = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Journal").font(AppTheme.display(24)).foregroundColor(AppTheme.text)
                Text("Private, on-device log. No scoring. No ranking.")
                    .font(.system(size: 14)).foregroundColor(AppTheme.textMuted)

                if !showNew {
                    Button {
                        withAnimation { showNew = true }
                    } label: {
                        HStack {
                            Image(systemName: "plus").font(.system(size: 14))
                            Text("New Entry").font(.system(size: 14, weight: .semibold))
                        }
                    }
                    .buttonStyle(PrimaryButtonStyle())
                }

                // New entry form
                if showNew {
                    VStack(alignment: .leading, spacing: 16) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Today's routine").font(.system(size: 14, weight: .semibold)).foregroundColor(AppTheme.text)
                            TextEditor(text: $routine)
                                .frame(height: 80)
                                .scrollContentBackground(.hidden)
                                .padding(8)
                                .background(AppTheme.elevated)
                                .cornerRadius(AppTheme.cornerSm)
                                .foregroundColor(AppTheme.text)
                        }

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Confidence: \(JournalEntry.confidenceEmoji[Int(confidence)]) \(Int(confidence))/5")
                                .font(.system(size: 14, weight: .semibold)).foregroundColor(AppTheme.text)
                            Slider(value: $confidence, in: 1...5, step: 1).tint(AppTheme.indigo)
                        }

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Irritation: \(Int(irritation))/3")
                                .font(.system(size: 14, weight: .semibold)).foregroundColor(AppTheme.text)
                            Slider(value: $irritation, in: 0...3, step: 1).tint(AppTheme.coral)
                        }

                        VStack(alignment: .leading, spacing: 8) {
                            Text("Avoidance behaviors").font(.system(size: 14, weight: .semibold)).foregroundColor(AppTheme.text)
                            FlowLayout(spacing: 8) {
                                ForEach(avoidanceBehaviorOptions, id: \.self) { b in
                                    Button { toggleAvoidance(b) } label: {
                                        Text(b)
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(avoidance.contains(b) ? .white : AppTheme.textSub)
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 6)
                                            .background(avoidance.contains(b) ? AppTheme.coral : AppTheme.elevated)
                                            .clipShape(Capsule())
                                    }
                                }
                            }
                        }

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Notes").font(.system(size: 14, weight: .semibold)).foregroundColor(AppTheme.text)
                            TextEditor(text: $notes)
                                .frame(height: 60)
                                .scrollContentBackground(.hidden)
                                .padding(8)
                                .background(AppTheme.elevated)
                                .cornerRadius(AppTheme.cornerSm)
                                .foregroundColor(AppTheme.text)
                        }

                        HStack(spacing: 8) {
                            Button("Save Entry") { addEntry() }.buttonStyle(PrimaryButtonStyle())
                            Button("Cancel") { withAnimation { showNew = false } }.buttonStyle(SecondaryButtonStyle())
                        }
                    }
                    .padding(16)
                    .background(AppTheme.card)
                    .cornerRadius(AppTheme.cornerLg)
                    .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerLg).stroke(AppTheme.border, lineWidth: 1))
                    .transition(.move(edge: .top).combined(with: .opacity))
                }

                // Empty state
                if entries.isEmpty && !showNew {
                    Text("No entries yet. Start tracking your journey.")
                        .font(.system(size: 14)).foregroundColor(AppTheme.textMuted)
                        .frame(maxWidth: .infinity).padding(.vertical, 64)
                }

                // Entry list
                ForEach(entries) { entry in
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text(entry.date, style: .date)
                                .font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
                            Spacer()
                            Button { deleteEntry(entry.id) } label: {
                                Image(systemName: "trash").font(.system(size: 12)).foregroundColor(AppTheme.textMuted)
                            }
                        }
                        HStack(spacing: 16) {
                            Text("\(JournalEntry.confidenceEmoji[entry.confidence]) \(entry.confidence)/5")
                                .font(.system(size: 14))
                            Text("Irritation: \(entry.irritation)/3")
                                .font(.system(size: 14)).foregroundColor(AppTheme.textMuted)
                        }
                        if !entry.routine.isEmpty {
                            Text(entry.routine).font(.system(size: 14)).foregroundColor(AppTheme.text)
                        }
                        if !entry.avoidanceBehaviors.isEmpty {
                            FlowLayout(spacing: 4) {
                                ForEach(entry.avoidanceBehaviors, id: \.self) { b in
                                    Text(b)
                                        .font(.system(size: 11))
                                        .foregroundColor(AppTheme.coral)
                                        .padding(.horizontal, 8).padding(.vertical, 3)
                                        .background(AppTheme.coral.opacity(0.15))
                                        .clipShape(Capsule())
                                }
                            }
                        }
                        if !entry.notes.isEmpty {
                            Text(entry.notes).font(.system(size: 12)).italic().foregroundColor(AppTheme.textMuted)
                        }
                    }
                    .padding(16)
                    .background(AppTheme.card)
                    .cornerRadius(AppTheme.cornerLg)
                    .overlay(RoundedRectangle(cornerRadius: AppTheme.cornerLg).stroke(AppTheme.border, lineWidth: 1))
                }

                Spacer().frame(height: 100)
            }
            .padding(.horizontal, 16)
            .padding(.top, 16)
        }
        .background(AppTheme.bg)
    }

    private func toggleAvoidance(_ b: String) {
        if avoidance.contains(b) { avoidance.remove(b) } else { avoidance.insert(b) }
    }

    private func addEntry() {
        let entry = JournalEntry(id: UUID().uuidString, date: Date(), routine: routine,
                                  confidence: Int(confidence), irritation: Int(irritation),
                                  avoidanceBehaviors: Array(avoidance), notes: notes)
        withAnimation {
            entries.insert(entry, at: 0); save()
            routine = ""; confidence = 3; irritation = 0; avoidance = []; notes = ""; showNew = false
        }
    }
    private func deleteEntry(_ id: String) { withAnimation { entries.removeAll { $0.id == id }; save() } }
    private func save() { LocalStore.shared.saveJournal(entries) }
}

// MARK: - Flow Layout (for tag wrapping)
struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = arrange(proposal: proposal, subviews: subviews)
        return result.size
    }
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = arrange(proposal: ProposedViewSize(width: bounds.width, height: bounds.height), subviews: subviews)
        for (index, position) in result.positions.enumerated() {
            subviews[index].place(at: CGPoint(x: bounds.minX + position.x, y: bounds.minY + position.y), proposal: .unspecified)
        }
    }
    private func arrange(proposal: ProposedViewSize, subviews: Subviews) -> (size: CGSize, positions: [CGPoint]) {
        let maxW = proposal.width ?? .infinity
        var positions: [CGPoint] = []
        var x: CGFloat = 0; var y: CGFloat = 0; var rowH: CGFloat = 0
        for sub in subviews {
            let size = sub.sizeThatFits(.unspecified)
            if x + size.width > maxW && x > 0 { x = 0; y += rowH + spacing; rowH = 0 }
            positions.append(CGPoint(x: x, y: y))
            rowH = max(rowH, size.height); x += size.width + spacing
        }
        return (CGSize(width: maxW, height: y + rowH), positions)
    }
}
