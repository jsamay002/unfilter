"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OnboardingGate } from "@/components/OnboardingGate";
import {
  LEARN_ARTICLES,
  CATEGORY_META,
  type LearnArticle,
  type LearnCategory,
} from "@/features/learn/content";
import { IconBook, IconArrowLeft } from "@/components/icons";
import { SectionLabel } from "@/components/ui";

/** Estimate reading time from article content sections */
function readingTime(article: LearnArticle): string {
  const words = article.content.reduce(
    (n, s) => n + s.heading.split(/\s+/).length + s.body.split(/\s+/).length,
    0
  );
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default function LearnPage() {
  const [filter, setFilter] = useState<LearnCategory | "all">("all");
  const [activeArticle, setActiveArticle] = useState<LearnArticle | null>(null);

  const filtered =
    filter === "all"
      ? LEARN_ARTICLES
      : LEARN_ARTICLES.filter((a) => a.category === filter);

  // Article reader view
  if (activeArticle) {
    return (
      <OnboardingGate>
        <AppShell>
          <div className="mx-auto max-w-4xl">
            <button
              onClick={() => setActiveArticle(null)}
              className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-tertiary)] hover:text-[var(--accent-dark)] transition mb-6"
            >
              <IconArrowLeft size={16} />
              Back to articles
            </button>

            <div className="animate-fade-up">
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${CATEGORY_META[activeArticle.category].color.replace("border-l-", "bg-")}`}
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-muted)]">
                  {CATEGORY_META[activeArticle.category].label}
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  &middot;
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {readingTime(activeArticle)}
                </span>
              </div>
              <h1 className="text-display text-[clamp(24px,3.5vw,36px)] text-[var(--text-primary)] mb-2">
                {activeArticle.title}
              </h1>
              <p className="text-[15px] text-[var(--text-tertiary)] leading-relaxed mb-8">
                {activeArticle.summary}
              </p>

              <div className="space-y-6">
                {activeArticle.content.map((section, i) => (
                  <div
                    key={i}
                    className={`animate-fade-up stagger-${Math.min(i + 1, 6)}`}
                  >
                    <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
                      {section.heading}
                    </h2>
                    <p className="text-[14px] text-[var(--text-secondary)] leading-[1.75]">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-10 card-gradient-sage rounded-[var(--radius-md)] px-5 py-4 flex gap-3.5 items-start">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[var(--accent)] shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                  <strong>Educational only.</strong> This content does not
                  constitute medical advice. Consult a healthcare professional
                  for personalized guidance.
                </p>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {activeArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--bg-secondary)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-tertiary)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Back to articles bottom link */}
              <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="flex items-center gap-2 text-[13px] font-medium text-[var(--accent)] hover:text-[var(--accent-dark)] transition"
                >
                  <IconArrowLeft size={14} />
                  Back to all articles
                </button>
              </div>
            </div>
          </div>
        </AppShell>
      </OnboardingGate>
    );
  }

  // Main hub view
  return (
    <OnboardingGate>
      <AppShell>
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 animate-fade-up">
            <h1 className="text-display text-[clamp(24px,3.5vw,36px)] text-[var(--text-primary)]">
              Learn Hub
            </h1>
            <p className="mt-1 text-[15px] text-[var(--text-secondary)]">
              Real information. No TikTok myths. No sponsored nonsense.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 animate-fade-up stagger-1 no-scrollbar">
            <FilterPill
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="All"
              svgIcon={<IconBook size={14} />}
            />
            {(Object.keys(CATEGORY_META) as LearnCategory[]).map((cat) => (
              <FilterPill
                key={cat}
                active={filter === cat}
                onClick={() => setFilter(cat)}
                label={CATEGORY_META[cat].label}
                emoji={CATEGORY_META[cat].icon}
              />
            ))}
          </div>

          {/* Category cards (when showing "all") */}
          {filter === "all" && (
            <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-up stagger-2">
              {(Object.keys(CATEGORY_META) as LearnCategory[]).map((cat) => {
                const meta = CATEGORY_META[cat];
                const count = LEARN_ARTICLES.filter(
                  (a) => a.category === cat
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
                      {count} {count === 1 ? "article" : "articles"}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Article list */}
          <div className="space-y-2.5 animate-fade-up stagger-3">
            <SectionLabel>
              {filter === "all" ? "All Articles" : CATEGORY_META[filter].label}
            </SectionLabel>
            {filtered.map((article) => (
              <button
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className={`w-full card-interactive border-l-[3px] ${CATEGORY_META[article.category].color} p-4 text-left flex gap-3.5 items-start`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                    {article.title}
                  </p>
                  <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5 line-clamp-2">
                    {article.summary}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
                    {readingTime(article)}
                  </p>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-[var(--text-muted)] shrink-0 mt-1"
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
            ))}
          </div>

          {/* Educational disclaimer at bottom of hub */}
          <div className="mt-8 text-center animate-fade-up stagger-4">
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed max-w-sm mx-auto">
              All content is for educational purposes only and does not
              constitute medical advice.
            </p>
          </div>
        </div>
      </AppShell>
    </OnboardingGate>
  );
}

function FilterPill({
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
