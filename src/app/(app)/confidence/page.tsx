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
import { IconStar, IconCamera } from "@/components/icons";

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
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 animate-fade-up">
            <h1 className="text-display text-[clamp(24px,3.5vw,36px)] text-[var(--text-primary)]">
              Confidence Mode
            </h1>
            <p className="mt-1 text-[15px] text-[var(--text-secondary)]">
              Real skin. Real talk. No filters needed.
            </p>
          </div>

          {/* Daily card */}
          <div className="mb-6 animate-fade-up stagger-1">
            <SectionLabel>Today&apos;s reminder</SectionLabel>
            <div className="card-elevated p-5 border-l-[3px] border-l-[var(--accent)]">
              <div className="flex items-start gap-3.5 mb-3">
                <div className="icon-container icon-sm icon-sage rounded-[10px] mt-0.5">
                  <IconStar size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    Daily card
                  </p>
                  <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mt-0.5">
                    {dailyCard.title}
                  </h3>
                </div>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7]">
                {dailyCard.content}
              </p>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 animate-fade-up stagger-2 no-scrollbar">
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="All"
              svgIcon={<IconStar size={14} />}
            />
            {(Object.keys(CONFIDENCE_CATEGORIES) as ConfidenceCategory[]).map(
              (cat) => (
                <FilterChip
                  key={cat}
                  active={filter === cat}
                  onClick={() => setFilter(cat)}
                  label={CONFIDENCE_CATEGORIES[cat].label}
                  emoji={CONFIDENCE_CATEGORIES[cat].icon}
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
                    className={`card-interactive border-l-[3px] ${meta.color} p-4 text-left min-h-[100px] flex flex-col justify-between`}
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                        {meta.label}
                      </p>
                      <p className="text-[12px] text-[var(--text-tertiary)] mt-1 leading-snug">
                        {meta.desc}
                      </p>
                    </div>
                    <p className="text-[11px] font-medium text-[var(--text-muted)] mt-2">
                      {count} {count === 1 ? "card" : "cards"}
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
            <CalloutPanel icon={<IconCamera size={18} />} variant="sage">
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

/* ---- Card Item — expandable with smooth transition ---- */

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
    <div
      className={`card border-l-[3px] ${meta.color} transition-all duration-200 overflow-hidden`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex items-center gap-3"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">
            {card.title}
          </p>
          {!expanded && (
            <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5 truncate">
              {card.content.slice(0, 80)}...
            </p>
          )}
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={`text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <path
            d="M3 5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7]">
            {card.content}
          </p>
          <p className="text-[11px] font-medium text-[var(--text-muted)] mt-3 uppercase tracking-[0.06em]">
            {meta.label}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---- Filter chip ---- */

function FilterChip({
  active,
  onClick,
  label,
  emoji,
  svgIcon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  emoji?: string;
  svgIcon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-all ${
        active
          ? "bg-[var(--accent-dark)] text-white shadow-sm"
          : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--warm-300)]"
      }`}
    >
      {svgIcon ? (
        <span className="flex items-center">{svgIcon}</span>
      ) : emoji ? (
        <span className="text-[13px]">{emoji}</span>
      ) : null}
      {label}
    </button>
  );
}
