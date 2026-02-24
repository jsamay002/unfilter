"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { OnboardingGate } from "@/components/OnboardingGate";
import {
  CONFIDENCE_CARDS,
  CONFIDENCE_CATEGORIES,
  type ConfidenceCard,
  type ConfidenceCategory,
} from "@/features/confidence/content";
import { CalloutPanel, SectionLabel } from "@/components/ui";

export default function ConfidencePage() {
  const [filter, setFilter] = useState<ConfidenceCategory | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    filter === "all"
      ? CONFIDENCE_CARDS
      : CONFIDENCE_CARDS.filter((c) => c.category === filter);

  // Daily card — deterministic based on day of year
  const dailyCard = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );
    return CONFIDENCE_CARDS[dayOfYear % CONFIDENCE_CARDS.length];
  }, []);

  return (
    <OnboardingGate>
      <AppShell>
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-6 animate-fade-up">
            <h1 className="text-heading text-[24px] text-[#2e2a25]">
              Confidence Mode
            </h1>
            <p className="mt-1 text-[14px] text-[#8a7d6e]">
              Real skin. Real talk. No filters needed.
            </p>
          </div>

          {/* Daily card */}
          <div className="mb-6 animate-fade-up stagger-1">
            <SectionLabel>Today&apos;s reminder</SectionLabel>
            <div className="card-elevated p-5 border-l-[3px] border-l-[#7da37d]">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[24px]">{dailyCard.emoji}</span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#b0a697]">
                    Daily card
                  </p>
                  <h3 className="text-[16px] font-semibold text-[#2e2a25]">
                    {dailyCard.title}
                  </h3>
                </div>
              </div>
              <p className="text-[14px] text-[#5c5245] leading-[1.7]">
                {dailyCard.content}
              </p>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 animate-fade-up stagger-2">
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="All"
              icon="🌈"
            />
            {(Object.keys(CONFIDENCE_CATEGORIES) as ConfidenceCategory[]).map(
              (cat) => (
                <FilterChip
                  key={cat}
                  active={filter === cat}
                  onClick={() => setFilter(cat)}
                  label={CONFIDENCE_CATEGORIES[cat].label}
                  icon={CONFIDENCE_CATEGORIES[cat].icon}
                />
              )
            )}
          </div>

          {/* Category overview cards (when "all") */}
          {filter === "all" && (
            <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-up stagger-3">
              {(
                Object.keys(CONFIDENCE_CATEGORIES) as ConfidenceCategory[]
              ).map((cat) => {
                const meta = CONFIDENCE_CATEGORIES[cat];
                const count = CONFIDENCE_CARDS.filter(
                  (c) => c.category === cat
                ).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`card-interactive border-l-[3px] ${meta.color} p-4 text-left`}
                  >
                    <span className="text-[20px]">{meta.icon}</span>
                    <p className="text-[13px] font-semibold text-[#2e2a25] mt-2">
                      {meta.label}
                    </p>
                    <p className="text-[11px] text-[#8a7d6e] mt-0.5">
                      {meta.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Card list */}
          <div className="space-y-2.5 animate-fade-up stagger-3">
            <SectionLabel>
              {filter === "all"
                ? "All Cards"
                : CONFIDENCE_CATEGORIES[filter].label}
            </SectionLabel>
            {filtered.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                expanded={expandedId === card.id}
                onToggle={() =>
                  setExpandedId(expandedId === card.id ? null : card.id)
                }
              />
            ))}
          </div>

          {/* Natural camera tip */}
          <div className="mt-8 animate-fade-up stagger-4">
            <CalloutPanel icon="📷" variant="sage">
              <strong>Natural Camera Mode tip:</strong> Next time you take a
              selfie, try this — face a window, hold the phone at eye level,
              and skip any beauty filters. Notice how your skin actually looks
              in good light. That&apos;s the real you, and it&apos;s more than
              enough.
            </CalloutPanel>
          </div>
        </div>
      </AppShell>
    </OnboardingGate>
  );
}

/* ---- Card Item — expandable ---- */

function CardItem({
  card,
  expanded,
  onToggle,
}: {
  card: ConfidenceCard;
  expanded: boolean;
  onToggle: () => void;
}) {
  const meta = CONFIDENCE_CATEGORIES[card.category];
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left card border-l-[3px] ${meta.color} transition-all ${
        expanded ? "p-5" : "p-4"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-[20px] shrink-0">{card.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#2e2a25]">
            {card.title}
          </p>
          {!expanded && (
            <p className="text-[12px] text-[#8a7d6e] mt-0.5 truncate">
              {card.content.slice(0, 80)}…
            </p>
          )}
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={`text-[#c4bbb0] shrink-0 transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        >
          <path
            d="M5 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {expanded && (
        <p className="mt-3 text-[14px] text-[#5c5245] leading-[1.7]">
          {card.content}
        </p>
      )}
    </button>
  );
}

/* ---- Filter chip ---- */

function FilterChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-all ${
        active
          ? "bg-[#3d5a3d] text-white shadow-sm"
          : "bg-[#f0ede7] text-[#6b5e50] hover:bg-[#e8e2d8]"
      }`}
    >
      <span className="text-[13px]">{icon}</span>
      {label}
    </button>
  );
}
