"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OnboardingGate } from "@/components/OnboardingGate";
import { useJournalStore } from "@/features/journal/store";
import type { JournalEntry } from "@/features/journal/types";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
  CalloutPanel,
  SectionLabel,
} from "@/components/ui";
import Link from "next/link";

export default function JournalPage() {
  const { entries, deleteEntry, updateNote } = useJournalStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<[string, string] | null>(null);
  const [view, setView] = useState<"timeline" | "trends" | "compare">("timeline");

  const selected = entries.find((e) => e.id === selectedId) ?? null;

  return (
    <OnboardingGate>
      <AppShell>
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-6 animate-fade-up">
            <h1 className="text-heading text-[24px] text-[#2e2a25]">
              Skin Journal
            </h1>
            <p className="mt-1 text-[14px] text-[#8a7d6e]">
              Track changes over time. Spot patterns. See progress.
            </p>
          </div>

          {/* View tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-2xl bg-[#f0ede7] animate-fade-up stagger-1">
            {(["timeline", "trends", "compare"] as const).map((v) => (
              <button
                key={v}
                onClick={() => { setView(v); setSelectedId(null); setCompareIds(null); }}
                className={`flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                  view === v
                    ? "bg-white text-[#2e2a25] shadow-sm"
                    : "text-[#8a7d6e] hover:text-[#5c5245]"
                }`}
              >
                {v === "timeline" && "📅 Timeline"}
                {v === "trends" && "📊 Trends"}
                {v === "compare" && "🔄 Compare"}
              </button>
            ))}
          </div>

          {/* Empty state */}
          {entries.length === 0 && (
            <div className="text-center py-16 animate-fade-up stagger-2">
              <span className="text-4xl block mb-4">📓</span>
              <h3 className="text-heading text-[18px] text-[#2e2a25] mb-2">
                No entries yet
              </h3>
              <p className="text-[14px] text-[#8a7d6e] mb-6 max-w-xs mx-auto">
                Complete a check-in and save it to start building your journal.
              </p>
              <Link href="/check-in">
                <ButtonPrimary>Start a Check-in</ButtonPrimary>
              </Link>
            </div>
          )}

          {/* TIMELINE VIEW */}
          {view === "timeline" && entries.length > 0 && !selectedId && (
            <div className="space-y-3 animate-fade-up stagger-2">
              {entries.map((entry, i) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  onClick={() => setSelectedId(entry.id)}
                />
              ))}
            </div>
          )}

          {/* ENTRY DETAIL */}
          {view === "timeline" && selected && (
            <EntryDetail
              entry={selected}
              onBack={() => setSelectedId(null)}
              onDelete={() => {
                deleteEntry(selected.id);
                setSelectedId(null);
              }}
              onUpdateNote={(note) => updateNote(selected.id, note)}
            />
          )}

          {/* TRENDS VIEW */}
          {view === "trends" && entries.length > 0 && (
            <TrendsView entries={entries} />
          )}
          {view === "trends" && entries.length < 2 && entries.length > 0 && (
            <div className="animate-fade-up stagger-2">
              <CalloutPanel icon="📊" variant="warm">
                Complete at least 2 check-ins to start seeing trends. Keep checking in weekly for the best insights.
              </CalloutPanel>
            </div>
          )}

          {/* COMPARE VIEW */}
          {view === "compare" && entries.length >= 2 && (
            <CompareView
              entries={entries}
              compareIds={compareIds}
              onSelect={setCompareIds}
            />
          )}
          {view === "compare" && entries.length < 2 && entries.length > 0 && (
            <div className="animate-fade-up stagger-2">
              <CalloutPanel icon="🔄" variant="warm">
                You need at least 2 saved check-ins to compare. Keep going!
              </CalloutPanel>
            </div>
          )}
        </div>
      </AppShell>
    </OnboardingGate>
  );
}

/* ================================================================
   ENTRY CARD — timeline list item
   ================================================================ */

function EntryCard({
  entry,
  index,
  onClick,
}: {
  entry: JournalEntry;
  index: number;
  onClick: () => void;
}) {
  const date = new Date(entry.timestamp);
  const topCat = entry.categories[0];

  return (
    <button
      onClick={onClick}
      className="w-full card-interactive p-4 text-left flex gap-4 items-start"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Photo thumbnail or placeholder */}
      <div className="h-14 w-14 rounded-xl bg-[#f0ede7] shrink-0 overflow-hidden flex items-center justify-center">
        {entry.photoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.photoDataUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xl text-[#c4bbb0]">📷</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[14px] font-semibold text-[#2e2a25]">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <SeverityDot severity={topCat?.severity ?? "low"} />
        </div>
        <p className="text-[13px] text-[#6b5e50] truncate">
          {topCat?.name ?? "Check-in"}
          {entry.hadRedFlags && " · ⚠️ Flagged"}
        </p>

        {/* Mini metrics */}
        <div className="flex gap-3 mt-2">
          <MiniMetric label="Redness" value={entry.metrics.redness} />
          <MiniMetric label="Texture" value={entry.metrics.texture} />
          <MiniMetric label="Spots" value={entry.metrics.spotCount} raw />
        </div>
      </div>

      {/* Arrow */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="text-[#c4bbb0] shrink-0 mt-1"
      >
        <path
          d="M5 3l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/* ================================================================
   ENTRY DETAIL — full view of a single check-in
   ================================================================ */

function EntryDetail({
  entry,
  onBack,
  onDelete,
  onUpdateNote,
}: {
  entry: JournalEntry;
  onBack: () => void;
  onDelete: () => void;
  onUpdateNote: (note: string) => void;
}) {
  const [note, setNote] = useState(entry.note);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const date = new Date(entry.timestamp);

  return (
    <div className="animate-fade-up space-y-4">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] font-medium text-[#8a7d6e] hover:text-[#5c5245] transition"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to timeline
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading text-[20px] text-[#2e2a25]">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <p className="text-[13px] text-[#8a7d6e]">
            {date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
            {" · "}
            {entry.symptoms.location || "No location noted"}
          </p>
        </div>
      </div>

      {/* Photo */}
      {entry.photoDataUrl && (
        <div className="rounded-2xl overflow-hidden border border-[#e0dbd3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.photoDataUrl}
            alt="Check-in photo"
            className="w-full max-h-64 object-cover"
          />
        </div>
      )}

      {/* Categories */}
      <div className="card p-4">
        <SectionLabel>What we found</SectionLabel>
        <div className="space-y-2">
          {entry.categories.map((cat, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-1"
            >
              <span className="text-[14px] font-medium text-[#2e2a25]">
                {cat.name}
              </span>
              <div className="flex items-center gap-2">
                <SeverityDot severity={cat.severity} />
                <span className="text-[12px] text-[#b0a697] tabular-nums">
                  {Math.round(cat.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="card p-4">
        <SectionLabel>Metrics</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Redness" value={entry.metrics.redness} />
          <MetricCard label="Texture" value={entry.metrics.texture} />
          <MetricCard label="Uniformity" value={entry.metrics.uniformity} />
          <MetricCard label="Spots" value={entry.metrics.spotCount} raw />
        </div>
        <p className="mt-3 text-[11px] text-[#b0a697]">
          Reliability: {Math.round(entry.metrics.reliability * 100)}%
        </p>
      </div>

      {/* Symptoms summary */}
      <div className="card p-4">
        <SectionLabel>Context you provided</SectionLabel>
        <div className="grid grid-cols-2 gap-2 text-[13px]">
          <ContextItem label="Sensation" value={entry.symptoms.itchOrPain} />
          <ContextItem label="Duration" value={entry.symptoms.duration} />
          <ContextItem label="Spreading" value={entry.symptoms.spreading ? "Yes" : "No"} />
          <ContextItem label="Fever" value={entry.symptoms.fever ? "Yes" : "No"} />
          <ContextItem label="Stress" value={entry.symptoms.stressLevel} />
          {entry.symptoms.newProducts && (
            <ContextItem label="New products" value={entry.symptoms.newProducts} />
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="card p-4">
        <SectionLabel>Your notes</SectionLabel>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => onUpdateNote(note)}
          placeholder="Add a note about this check-in…"
          rows={3}
          className="w-full rounded-xl border border-[#e0dbd3] bg-[#faf8f4] px-4 py-3 text-[13px] text-[#2e2a25] placeholder:text-[#c4bbb0] focus:border-[#a3bfa3] focus:outline-none focus:ring-2 focus:ring-[#eef3ee] resize-none transition"
        />
      </div>

      {/* Red flags */}
      {entry.hadRedFlags && (
        <CalloutPanel icon="⚠️" variant="coral">
          This check-in triggered a safety flag ({entry.escalationLevel} level).
          If you haven&apos;t already, consider talking to a trusted adult or
          healthcare provider.
        </CalloutPanel>
      )}

      {/* Delete */}
      <div className="pt-2">
        {!confirmDelete ? (
          <ButtonText onClick={() => setConfirmDelete(true)}>
            Delete this entry
          </ButtonText>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-[13px] text-[#8b3a2a]">Permanently delete?</p>
            <button
              onClick={onDelete}
              className="text-[13px] font-semibold text-[#8b3a2a] underline"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-[13px] text-[#8a7d6e]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================
   TRENDS VIEW
   ================================================================ */

function TrendsView({ entries }: { entries: JournalEntry[] }) {
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const metrics = ["redness", "texture", "spotCount"] as const;
  const labels = { redness: "Redness", texture: "Texture", spotCount: "Spots" };
  const colors = { redness: "#d44a32", texture: "#e8b86d", spotCount: "#7da37d" };

  return (
    <div className="space-y-4 animate-fade-up stagger-2">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m) => {
          const first = sorted[0]?.metrics[m] ?? 0;
          const last = sorted[sorted.length - 1]?.metrics[m] ?? 0;
          const delta = last - first;
          const improving = m === "spotCount" ? delta <= 0 : delta <= 0;
          return (
            <div key={m} className="card p-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#b0a697]">
                {labels[m]}
              </p>
              <p className="text-[20px] font-bold text-[#2e2a25] mt-1 tabular-nums">
                {m === "spotCount"
                  ? last
                  : `${Math.round(last * 100)}%`}
              </p>
              {sorted.length >= 2 && (
                <p
                  className={`text-[11px] font-semibold mt-1 ${
                    improving ? "text-[#5c875c]" : "text-[#d44a32]"
                  }`}
                >
                  {improving ? "↓" : "↑"}{" "}
                  {m === "spotCount"
                    ? Math.abs(delta)
                    : `${Math.abs(Math.round(delta * 100))}%`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Sparkline charts */}
      {metrics.map((m) => (
        <div key={m} className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-[#2e2a25]">
              {labels[m]}
            </p>
            <p className="text-[11px] text-[#b0a697]">
              {sorted.length} check-ins
            </p>
          </div>
          <Sparkline
            data={sorted.map((e) => e.metrics[m])}
            color={colors[m]}
            dates={sorted.map((e) =>
              new Date(e.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            )}
          />
        </div>
      ))}

      {/* Trigger correlations */}
      <div className="card p-4">
        <SectionLabel>Patterns noticed</SectionLabel>
        <PatternInsights entries={sorted} />
      </div>
    </div>
  );
}

/* ================================================================
   COMPARE VIEW
   ================================================================ */

function CompareView({
  entries,
  compareIds,
  onSelect,
}: {
  entries: JournalEntry[];
  compareIds: [string, string] | null;
  onSelect: (ids: [string, string] | null) => void;
}) {
  const [pickingSlot, setPickingSlot] = useState<0 | 1>(0);
  const [slots, setSlots] = useState<[string | null, string | null]>([null, null]);

  const handlePick = (id: string) => {
    const next = [...slots] as [string | null, string | null];
    next[pickingSlot] = id;
    setSlots(next);
    if (pickingSlot === 0) setPickingSlot(1);
    if (next[0] && next[1]) onSelect([next[0], next[1]]);
  };

  const a = entries.find((e) => e.id === (compareIds?.[0] ?? slots[0]));
  const b = entries.find((e) => e.id === (compareIds?.[1] ?? slots[1]));

  if (a && b) {
    return (
      <div className="animate-fade-up space-y-4">
        <button
          onClick={() => { onSelect(null); setSlots([null, null]); setPickingSlot(0); }}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#8a7d6e] hover:text-[#5c5245] transition"
        >
          ← Pick different entries
        </button>
        <div className="grid grid-cols-2 gap-3">
          <CompareColumn entry={a} label="Earlier" />
          <CompareColumn entry={b} label="Later" />
        </div>
        {/* Delta summary */}
        <div className="card p-4">
          <SectionLabel>Change</SectionLabel>
          <div className="grid grid-cols-3 gap-3">
            <DeltaMetric label="Redness" a={a.metrics.redness} b={b.metrics.redness} />
            <DeltaMetric label="Texture" a={a.metrics.texture} b={b.metrics.texture} />
            <DeltaMetric label="Spots" a={a.metrics.spotCount} b={b.metrics.spotCount} raw />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up stagger-2">
      <p className="text-[14px] text-[#6b5e50] mb-4">
        Pick <strong>{pickingSlot === 0 ? "the first" : "the second"}</strong> entry to compare:
      </p>
      <div className="space-y-2">
        {entries.map((entry) => {
          const isSelected = slots.includes(entry.id);
          return (
            <button
              key={entry.id}
              onClick={() => handlePick(entry.id)}
              disabled={isSelected}
              className={`w-full card p-3 text-left flex items-center gap-3 transition ${
                isSelected ? "opacity-40" : "hover:bg-[#f7f4ef]"
              }`}
            >
              <div className="h-10 w-10 rounded-lg bg-[#f0ede7] shrink-0 overflow-hidden flex items-center justify-center">
                {entry.photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={entry.photoDataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm text-[#c4bbb0]">📷</span>
                )}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#2e2a25]">
                  {new Date(entry.timestamp).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </p>
                <p className="text-[12px] text-[#8a7d6e]">
                  {entry.categories[0]?.name ?? "Check-in"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompareColumn({ entry, label }: { entry: JournalEntry; label: string }) {
  return (
    <div className="card p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#b0a697] mb-2">{label}</p>
      {entry.photoDataUrl && (
        <div className="rounded-xl overflow-hidden mb-3 aspect-square bg-[#f0ede7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={entry.photoDataUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <p className="text-[12px] font-medium text-[#2e2a25]">
        {new Date(entry.timestamp).toLocaleDateString("en-US", {
          month: "short", day: "numeric",
        })}
      </p>
      <div className="mt-2 space-y-1">
        <MiniMetric label="Redness" value={entry.metrics.redness} />
        <MiniMetric label="Texture" value={entry.metrics.texture} />
        <MiniMetric label="Spots" value={entry.metrics.spotCount} raw />
      </div>
    </div>
  );
}

/* ================================================================
   SMALL HELPER COMPONENTS
   ================================================================ */

function SeverityDot({ severity }: { severity: "low" | "medium" | "high" }) {
  const c = { low: "bg-[#7da37d]", medium: "bg-[#e8b86d]", high: "bg-[#d44a32]" };
  return <div className={`h-2 w-2 rounded-full ${c[severity]}`} />;
}

function MiniMetric({
  label,
  value,
  raw,
}: {
  label: string;
  value: number;
  raw?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-[#b0a697]">{label}</span>
      <span className="text-[11px] font-semibold text-[#6b5e50] tabular-nums">
        {raw ? value : `${Math.round(value * 100)}%`}
      </span>
    </div>
  );
}

function MetricCard({
  label,
  value,
  raw,
}: {
  label: string;
  value: number;
  raw?: boolean;
}) {
  return (
    <div className="rounded-xl bg-[#f7f4ef] p-3 text-center">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#b0a697]">
        {label}
      </p>
      <p className="text-[18px] font-bold text-[#2e2a25] mt-1 tabular-nums">
        {raw ? value : `${Math.round(value * 100)}%`}
      </p>
    </div>
  );
}

function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-[#b0a697]">{label}</p>
      <p className="text-[13px] font-medium text-[#2e2a25] capitalize">{value}</p>
    </div>
  );
}

function DeltaMetric({
  label,
  a,
  b,
  raw,
}: {
  label: string;
  a: number;
  b: number;
  raw?: boolean;
}) {
  const delta = b - a;
  const improving = delta <= 0;
  return (
    <div className="text-center">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#b0a697]">
        {label}
      </p>
      <p
        className={`text-[16px] font-bold mt-1 ${
          improving ? "text-[#5c875c]" : "text-[#d44a32]"
        }`}
      >
        {improving ? "↓" : "↑"}
        {raw ? Math.abs(delta) : `${Math.abs(Math.round(delta * 100))}%`}
      </p>
    </div>
  );
}

function Sparkline({
  data,
  color,
  dates,
}: {
  data: number[];
  color: string;
  dates: string[];
}) {
  if (data.length < 2) {
    return (
      <p className="text-[12px] text-[#b0a697] text-center py-4">
        Need at least 2 data points
      </p>
    );
  }
  const max = Math.max(...data, 0.01);
  const w = 100 / (data.length - 1);

  return (
    <div>
      <svg viewBox="0 0 300 60" className="w-full h-16" preserveAspectRatio="none">
        {/* Area fill */}
        <path
          d={`M0,${60 - (data[0] / max) * 50} ${data
            .map((v, i) => `L${i * (300 / (data.length - 1))},${60 - (v / max) * 50}`)
            .join(" ")} L300,60 L0,60 Z`}
          fill={color}
          fillOpacity="0.08"
        />
        {/* Line */}
        <path
          d={data
            .map(
              (v, i) =>
                `${i === 0 ? "M" : "L"}${i * (300 / (data.length - 1))},${60 - (v / max) * 50}`
            )
            .join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots */}
        {data.map((v, i) => (
          <circle
            key={i}
            cx={i * (300 / (data.length - 1))}
            cy={60 - (v / max) * 50}
            r="3"
            fill="white"
            stroke={color}
            strokeWidth="1.5"
          />
        ))}
      </svg>
      {/* Date labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-[#b0a697]">{dates[0]}</span>
        <span className="text-[10px] text-[#b0a697]">{dates[dates.length - 1]}</span>
      </div>
    </div>
  );
}

function PatternInsights({ entries }: { entries: JournalEntry[] }) {
  const insights: string[] = [];

  const highStress = entries.filter((e) => e.symptoms.stressLevel === "high");
  if (highStress.length >= 2) {
    const avgRedness =
      highStress.reduce((s, e) => s + e.metrics.redness, 0) / highStress.length;
    if (avgRedness > 0.4) {
      insights.push(
        "Higher redness tends to appear when you report high stress levels."
      );
    }
  }

  const withNewProducts = entries.filter((e) => e.symptoms.newProducts.length > 0);
  if (withNewProducts.length >= 2) {
    insights.push(
      `${withNewProducts.length} check-ins mention new products — keep tracking to spot reactions.`
    );
  }

  const spreading = entries.filter((e) => e.symptoms.spreading);
  if (spreading.length >= 2) {
    insights.push(
      "You've noted spreading in multiple check-ins — consider mentioning this to a healthcare provider."
    );
  }

  if (insights.length === 0) {
    insights.push(
      "Keep checking in regularly — patterns become clearer with more data points."
    );
  }

  return (
    <div className="space-y-2">
      {insights.map((insight, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="h-1.5 w-1.5 rounded-full bg-[#7da37d] mt-2 shrink-0" />
          <p className="text-[13px] text-[#6b5e50] leading-relaxed">{insight}</p>
        </div>
      ))}
    </div>
  );
}
