"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { OnboardingGate } from "@/components/OnboardingGate";
import { useAuthStore } from "@/features/auth/store";
import { useJournalStore } from "@/features/journal/store";
import { getStreak, isDoneToday } from "@/features/streak";
import { getPhotoForDay } from "@/features/reality-check/photos";
import { IconCamera, IconSparkle, IconShield, IconJournal, IconFlame } from "@/components/icons";

const JOURNEY = [
  {
    title: "Distortion Lab",
    body: "See what beauty filters actually change — smoothed pores, reshaped jaws, faked lighting.",
    href: "/lab",
    icon: IconCamera,
  },
  {
    title: "Check in with your skin",
    body: "A private check-in. Your photo never leaves the device. Not a score — a record.",
    href: "/check-in",
    icon: IconSparkle,
  },
  {
    title: "Routine Safety",
    body: "Add the products you use. The copilot flags conflicts and explains the chemistry.",
    href: "/routine",
    icon: IconShield,
  },
  {
    title: "Journal",
    body: "Turn check-ins into something you can look back on. All on-device, all yours.",
    href: "/journal",
    icon: IconJournal,
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

function daysActiveFromEntries(
  entries: { createdAt?: number; timestamp?: number }[],
) {
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
  const name = user?.username ?? "you";

  const [streak, setStreak] = useState({ count: 0, done: false });
  const [labStats, setLabStats] = useState({ total: 0, edits: 0 });
  const [dateLine, setDateLine] = useState("");
  const [photo] = useState(() => getPhotoForDay());

  useEffect(() => {
    const s = getStreak();
    setStreak({ count: s.count, done: isDoneToday() });
    setLabStats(getLabStats());
    const d = new Date();
    setDateLine(
      d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  const daysActive = _hasHydrated
    ? Math.max(daysActiveFromEntries(entries), labStats.total > 0 ? 1 : 0)
    : 0;
  const hasActivity = entries.length > 0 || labStats.total > 0;

  return (
    <OnboardingGate>
      <AppShell>
        <div className="max-w-4xl mx-auto pb-20">

          {/* Greeting */}
          <div className="mb-10 animate-fade-up">
            <p className="text-[13px] font-medium text-[var(--text-tertiary)] mb-2">
              {dateLine || "\u2014"}
            </p>
            <h1 className="text-display text-[clamp(28px,4.5vw,44px)] text-[var(--text-primary)]">
              Welcome back, {name}.
            </h1>
            <p className="mt-2 text-[17px] text-[var(--text-secondary)]">
              What are you working on today?
            </p>
          </div>

          {/* Reality check card */}
          <Link
            href="/reality-check"
            className="group block mb-10 animate-fade-up stagger-1"
            aria-label="Open today's reality check"
          >
            <div className="card-interactive overflow-hidden">
              <div className="relative aspect-[21/9] w-full overflow-hidden bg-[var(--warm-200)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.015]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <IconFlame size={16} className="text-white/80" />
                    <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/70">
                      Daily Reality Check
                    </span>
                  </div>
                  <p className="text-white text-[18px] font-semibold">
                    {streak.done
                      ? "You've already looked today"
                      : "A real face. No filter."}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Streak / activity summary */}
          {_hasHydrated && hasActivity && (
            <div className="card p-5 mb-10 animate-fade-up stagger-2">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-[var(--text-secondary)]">
                <span>
                  <span className="font-semibold text-[var(--text-primary)]">{daysActive}</span>{" "}
                  {daysActive === 1 ? "day" : "days"} active
                </span>
                {labStats.edits > 0 && (
                  <span>
                    <span className="font-semibold text-[var(--text-primary)]">{labStats.edits}</span>{" "}
                    edits flagged in lab
                  </span>
                )}
                {streak.count > 1 && (
                  <span>
                    <span className="font-semibold text-[var(--text-primary)]">{streak.count}</span>-day
                    streak
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up stagger-3">
            {JOURNEY.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group">
                  <div className="card-interactive p-5 h-full">
                    <div className="flex items-start gap-3.5">
                      <div className="icon-container icon-sm icon-sage rounded-[10px] mt-0.5 shrink-0">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-dark)] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[13px] leading-[1.6] text-[var(--text-tertiary)]">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <p className="mt-16 text-[12px] text-[var(--text-muted)] text-center">
            Privacy is part of the product. Nothing leaves your device.
          </p>
        </div>
      </AppShell>
    </OnboardingGate>
  );
}
