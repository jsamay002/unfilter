"use client";

import { useState } from "react";
import type {
  SkinCategory,
  ActionPlan,
  RedFlagResult,
  SkinMetrics,
} from "../../types";

interface ResultsCardProps {
  categories: SkinCategory[];
  actionPlan: ActionPlan;
  redFlags: RedFlagResult;
  metrics: SkinMetrics;
  onSave: () => void;
  onDiscard: () => void;
  onNewCheckIn: () => void;
}

export function ResultsCard({
  categories,
  actionPlan,
  redFlags,
  metrics,
  onSave,
  onDiscard,
  onNewCheckIn,
}: ResultsCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-4">
      {/* Disclaimer banner */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-700">
        <strong>Remember:</strong> This is educational guidance only — not a
        medical diagnosis. When in doubt, talk to a trusted adult or healthcare
        provider.
      </div>

      {/* Red flag alert (if triggered) */}
      {redFlags.triggered && (
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5">
          <h3 className="text-base font-semibold text-red-800 mb-2">
            ⚠️ We noticed something worth attention
          </h3>
          <ul className="mb-3 space-y-1.5">
            {redFlags.flags.map((f, i) => (
              <li key={i} className="text-sm text-red-700 flex gap-2">
                <span className="shrink-0">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-lg bg-white/70 px-4 py-3 text-sm text-red-800 font-medium">
            {redFlags.message}
          </div>
          {redFlags.escalationLevel === "urgentCare" && (
            <p className="mt-2 text-xs text-red-600">
              If you feel very unwell or the area is rapidly worsening, ask an
              adult to help you get medical attention today.
            </p>
          )}
        </div>
      )}

      {/* Educational categories */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          🔍 What this might be
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Based on your photo + answers — educational categories, not diagnoses
        </p>

        <div className="space-y-3">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-800">
                  {cat.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <SeverityBadge severity={cat.severity} />
                  <span className="text-xs text-slate-400">
                    {Math.round(cat.confidence * 100)}% match
                  </span>
                </span>
              </div>
              {/* Confidence bar */}
              <div className="mb-2 h-1.5 w-full rounded-full bg-slate-200">
                <div
                  className="h-1.5 rounded-full bg-slate-600 transition-all"
                  style={{ width: `${cat.confidence * 100}%` }}
                />
              </div>
              <p className="text-sm text-slate-600">{cat.description}</p>
            </div>
          ))}
        </div>

        {/* Reliability note */}
        {metrics.reliability < 0.6 && (
          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            🔎 Reliability is moderate — consider retaking with better lighting
            or checking in again in a few days for a clearer picture.
          </div>
        )}
      </div>

      {/* Action Plan */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          ✅ Your Action Plan
        </h3>

        <Section title="Do today" emoji="💧" items={actionPlan.doItems} color="emerald" />
        <Section title="Avoid for now" emoji="🚫" items={actionPlan.avoidItems} color="red" />
        <Section title="Track this week" emoji="📊" items={actionPlan.trackItems} color="blue" />

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 text-sm text-slate-500 underline decoration-dotted hover:text-slate-700"
        >
          {showDetails ? "Hide" : "Show"} product & ingredient tips
        </button>

        {showDetails && (
          <Section
            title="Product tips"
            emoji="🧴"
            items={actionPlan.productTips}
            color="violet"
          />
        )}
      </div>

      {/* Save / discard */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">
          Save this check-in?
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Saving stores an encrypted copy on your device so you can track
          changes. Photos are auto-deleted by default — only metrics are kept.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="flex-1 rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            💾 Save to Journal
          </button>
          <button
            onClick={onDiscard}
            className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            🗑️ Delete Now
          </button>
        </div>
        <button
          onClick={onNewCheckIn}
          className="mt-2 w-full text-center text-sm text-slate-400 hover:text-slate-600"
        >
          Start a new check-in
        </button>
      </div>
    </div>
  );
}

/* ---- Helpers ---- */

function SeverityBadge({ severity }: { severity: "low" | "medium" | "high" }) {
  const styles = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

function Section({
  title,
  emoji,
  items,
  color,
}: {
  title: string;
  emoji: string;
  items: string[];
  color: string;
}) {
  const dotColor: Record<string, string> = {
    emerald: "bg-emerald-400",
    red: "bg-red-400",
    blue: "bg-blue-400",
    violet: "bg-violet-400",
  };
  return (
    <div className="mb-4">
      <h4 className="mb-2 text-sm font-medium text-slate-700">
        {emoji} {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotColor[color] ?? "bg-slate-400"}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
