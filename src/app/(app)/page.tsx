"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { OnboardingGate } from "@/components/OnboardingGate";
import {
  IconCamera,
  IconJournal,
  IconShield,
  IconSparkle,
  IconArrowRight,
  IconFlame,
} from "@/components/icons";
import { useAuthStore } from "@/features/auth/store";
import { useJournalStore } from "@/features/journal/store";
import { getStreak, isDoneToday } from "@/features/streak";

const JOURNEY = [
  {
    step: 1,
    label: "Expose",
    title: "See what they're hiding",
    desc: "Watch a beauty filter erase pimples, reshape a jaw, and fake lighting — in real time on your photo.",
    href: "/lab",
    icon: IconCamera,
    color: "var(--accent)",
    bg: "bg-[var(--accent-light)]",
  },
  {
    step: 2,
    label: "Honest look",
    title: "Check in with your real skin",
    desc: "Take a photo and get an honest, private assessment. The camera validates what you report — no judgment.",
    href: "/check-in",
    icon: IconSparkle,
    color: "var(--gold)",
    bg: "bg-[var(--gold-light)]",
  },
  {
    step: 3,
    label: "Ingredients",
    title: "Products with nothing to hide",
    desc: "Add your products — the safety copilot flags conflicts, explains the science, and scores your routine.",
    href: "/routine",
    icon: IconShield,
    color: "var(--coral)",
    bg: "bg-[var(--coral-light)]",
  },
  {
    step: 4,
    label: "Track",
    title: "Your real record",
    desc: "Journal your check-ins, confidence, and routine changes over time. All on-device, all yours.",
    href: "/journal",
    icon: IconJournal,
    color: "var(--amber)",
    bg: "bg-[var(--gold-light)]",
  },
];

function getLabStats(): { total: number; edits: number } {
  if (typeof window === "undefined") return { total: 0, edits: 0 };
  try {
    const raw = localStorage.getItem("unfilter-lab-runs");
    if (!raw) return { total: 0, edits: 0 };
    return JSON.parse(raw);
  } catch {
    return { total: 0, edits: 0 };
  }
}

// rough count of unique days with journal activity
function daysActiveFromEntries(entries: { createdAt?: number; timestamp?: number }[]) {
  const seen = new Set<string>();
  entries.forEach((e) => {
    const ts = e.createdAt ?? e.timestamp ?? 0;
    if (ts) seen.add(new Date(ts).toISOString().slice(0, 10));
  });
  return seen.size;
}

export default function HomePage() {
  const { user } = useAuthStore();
  const { entries, _hasHydrated } = useJournalStore();
  const router = useRouter();
  const name = user?.username ?? "there";

  const [streak, setStreak] = useState({ count: 0, done: false });
  const [labStats, setLabStats] = useState({ total: 0, edits: 0 });

  useEffect(() => {
    const s = getStreak();
    setStreak({ count: s.count, done: isDoneToday() });
    setLabStats(getLabStats());
  }, []);

  const daysActive = _hasHydrated
    ? Math.max(daysActiveFromEntries(entries), labStats.total > 0 ? 1 : 0)
    : 0;
  const hasActivity = entries.length > 0 || labStats.total > 0;

  return (
    <OnboardingGate>
      <AppShell>
        <div className="mx-auto max-w-2xl">

          {/* ── Hero — Truth vs Illusion split ── */}
          <section className="mb-14 animate-reveal">
            <p className="label-evidence text-[var(--text-muted)] mb-6">
              Welcome back, {name}
            </p>

            {/* Split visual: sharp text left, blurred/filtered concept right */}
            <div className="relative mb-10">
              <h1 className="text-display text-[clamp(34px,6vw,56px)] text-[var(--text-primary)] leading-[1.02] mb-4">
                Your skin has<br />
                <span className="text-editorial gradient-text">nothing to hide.</span>
              </h1>
              <p className="text-[15px] leading-[1.75] text-[var(--text-tertiary)] max-w-[400px]">
                Filters hide your real skin. Unfilter exposes how — then helps
                you understand what&apos;s actually there.
              </p>

              {/* Illusion fragment — decorative blurred shape suggesting distortion */}
              <div
                className="hidden md:block absolute -right-8 top-2 w-[180px] h-[140px] rounded-[24px] opacity-[0.07]"
                style={{
                  background: "linear-gradient(135deg, var(--coral) 0%, var(--gold) 100%)",
                  filter: "blur(40px)",
                }}
                aria-hidden="true"
              />
            </div>

            {/* CTAs — truth (sharp, bordered) vs illusion (soft, blurred bg) */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/lab")}
                className="group flex-1 flex items-center justify-between rounded-[14px] bg-[var(--accent)] px-6 py-4 text-white btn-primary"
              >
                <div className="text-left">
                  <p className="text-[15px] font-semibold">See what they&apos;re hiding</p>
                  <p className="text-[11px] text-white/50 mt-0.5">Open the Distortion Lab</p>
                </div>
                <IconArrowRight size={16} className="shrink-0 opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => router.push("/lab?demo=true")}
                className="sm:w-auto rounded-[14px] border border-[var(--border)] px-5 py-4 text-[13px] font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] active:scale-[0.98]"
              >
                Use demo image
              </button>
            </div>
          </section>

          {/* ── Daily Reality Check — slightly different surface ── */}
          <section className="mb-10 animate-fade-up stagger-1">
            <Link
              href="/reality-check"
              className={`group flex items-center gap-4 rounded-[14px] px-5 py-4 transition-all ${
                streak.done
                  ? "bg-[var(--accent-lighter)] border border-[var(--accent-light)]"
                  : "bg-[var(--bg-secondary)] hover:bg-[var(--warm-200)]"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  streak.done ? "bg-[var(--accent-light)]" : "bg-[var(--warm-300)]"
                }`}
              >
                <IconFlame
                  size={18}
                  className={streak.done ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                    {streak.done ? "Done for today" : "Today's Reality Check"}
                  </p>
                  {streak.count > 0 && (
                    <span className="rounded-full bg-[var(--accent-light)] px-2 py-0.5 text-[10px] font-bold tabular-nums text-[var(--accent)]">
                      {streak.count}d
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[var(--text-tertiary)]">
                  {streak.done
                    ? "You found what was hidden."
                    : "30 seconds — find what's hidden"}
                </p>
              </div>

              {!streak.done && (
                <IconArrowRight size={15} className="shrink-0 text-[var(--text-muted)] opacity-0 group-hover:opacity-70 transition-opacity" />
              )}
            </Link>
          </section>

          {/* ── Journey — progressive reveal, each step peels back a layer ── */}
          <section className="mb-14 animate-reveal stagger-2">
            <p className="label-evidence text-[var(--text-muted)] mb-6">
              Nothing to hide — the journey
            </p>

            <div className="space-y-0.5">
              {JOURNEY.map((j, idx) => {
                const Icon = j.icon;
                return (
                  <Link
                    key={j.step}
                    href={j.href}
                    className="group relative flex items-center gap-4 rounded-[12px] px-4 py-4 -mx-4 transition-all duration-200 hover:bg-[var(--bg-secondary)] hover-sharpen"
                  >
                    {/* Step connector line */}
                    {idx < JOURNEY.length - 1 && (
                      <div
                        className="absolute left-[33px] top-[52px] w-px h-[calc(100%-36px)] bg-[var(--border-light)]"
                        aria-hidden="true"
                      />
                    )}

                    {/* Step indicator — numbered, not just an icon */}
                    <div className="relative z-10 flex flex-col items-center gap-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 group-hover:border-current ${j.bg}`}
                        style={{ color: j.color, borderColor: "var(--border-light)" }}
                      >
                        <Icon size={17} />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="label-evidence text-[var(--text-muted)]">
                          {j.label}
                        </span>
                      </div>
                      <p className="text-[14px] font-semibold text-[var(--text-primary)] leading-tight">{j.title}</p>
                      <p className="text-[12px] text-[var(--text-muted)] mt-1 leading-relaxed max-w-[380px]">{j.desc}</p>
                    </div>

                    <IconArrowRight
                      size={14}
                      className="shrink-0 text-[var(--text-muted)] opacity-0 group-hover:opacity-60 transition-opacity"
                    />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── Progress — clinical precision, truth-side aesthetic ── */}
          {_hasHydrated && hasActivity && (
            <section className="mb-14 animate-reveal stagger-3">
              <div className="section-break" />
              <p className="label-evidence text-[var(--text-muted)] mb-5">
                Your data
              </p>
              <div className="grid grid-cols-4 gap-px rounded-[14px] overflow-hidden surface-truth">
                {[
                  { label: "Days Active", value: daysActive },
                  { label: "Lab Runs", value: labStats.total },
                  { label: "Check-Ins", value: entries.length },
                  { label: "Edits Found", value: labStats.edits },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="px-4 py-4 bg-[var(--bg-card)] text-center"
                  >
                    <p className="text-data text-[24px] font-bold text-[var(--text-primary)] leading-none mb-1.5">
                      {value}
                    </p>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">{label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12px] text-[var(--text-muted)]">
                {daysActive >= 7
                  ? "One week of seeing clearly."
                  : daysActive >= 3
                  ? "Patterns forming."
                  : "Every check-in sharpens your eye."}
              </p>
            </section>
          )}

          {/* ── Privacy — truth badge, grounded ── */}
          <div className="flex items-center gap-2.5 pb-8 animate-fade-in stagger-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-light)]">
              <IconShield size={10} className="text-[var(--accent)]" />
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Nothing to hide. All processing on-device. No uploads. Ever.
            </p>
          </div>

        </div>
      </AppShell>
    </OnboardingGate>
  );
}
