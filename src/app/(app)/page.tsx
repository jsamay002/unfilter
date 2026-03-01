"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { OnboardingGate } from "@/components/OnboardingGate";
import { OnDeviceBadge } from "@/components/OnDeviceBadge";
import {
  usePerceptionResetStore,
  DAY_MISSIONS,
  type DayNumber,
  type DayMission,
} from "@/core/perception-reset";
import { IconArrowRight, IconCheck, IconSparkle } from "@/components/icons";

/*  ================================================================
    HOME HUB — Mission control for the 7-day Perception Reset
    
    Not started: hero CTA to begin
    In progress: day cards with current mission highlighted
    Graduated: freeform access to all tools
    ================================================================ */

export default function HomePage() {
  const router = useRouter();
  const {
    currentDay,
    completedDays,
    graduated,
    startReset,
    isDayUnlocked,
    isDayCompleted,
  } = usePerceptionResetStore();

  const isStarted = currentDay > 0;

  const handleStart = () => {
    startReset();
    router.push("/reset/day/1");
  };

  return (
    <OnboardingGate>
      <AppShell>
        <div className="max-w-3xl">
          {/* ---- NOT STARTED: Hero CTA ---- */}
          {!isStarted && (
            <div className="animate-fade-up">
              {/* Hero */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-1.5 w-12 rounded-full bg-[var(--accent)]" />
                  <span className="text-[13px] font-bold tracking-[0.08em] uppercase text-[var(--accent)]">
                    Perception Reset
                  </span>
                </div>
                <h1 className="text-display text-[clamp(32px,5vw,48px)] text-[var(--text-primary)] mb-4">
                  See what filters
                  <span className="gradient-text"> actually do.</span>
                </h1>
                <p className="text-[18px] text-[var(--text-secondary)] leading-relaxed max-w-lg">
                  A 7-day guided experience that reveals how digital manipulation
                  changes your perception of skin — and builds real habits to
                  replace the noise.
                </p>
              </div>

              {/* What you'll do */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <PillarCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4l2 2" strokeLinecap="round" />
                    </svg>
                  }
                  title="Distortion Simulator"
                  description="See smoothing, lighting tricks, and tone compression applied to your own photo in real-time."
                  variant="sage"
                />
                <PillarCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="Barrier Risk Engine"
                  description="Check if your current products are conflicting, overloading, or putting your skin barrier at risk."
                  variant="warm"
                />
                <PillarCard
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="Private Journal"
                  description="Track how your skin looks and feels — encrypted, on-device, never uploaded."
                  variant="coral"
                />
              </div>

              {/* Start button */}
              <button
                onClick={handleStart}
                className="btn-primary py-4 px-10 text-[17px] animate-fade-up stagger-3"
              >
                Begin the Perception Reset
                <IconArrowRight size={20} />
              </button>

              {/* Privacy */}
              <div className="mt-8 animate-fade-up stagger-4">
                <OnDeviceBadge />
              </div>

              {/* Time estimate */}
              <p className="mt-6 text-[13px] text-[var(--text-muted)] animate-fade-in stagger-5">
                ~3 minutes per day for 7 days. No streaks. No pressure. Go at your own pace.
              </p>
            </div>
          )}

          {/* ---- IN PROGRESS / GRADUATED: Day Cards ---- */}
          {isStarted && (
            <div className="animate-fade-up">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-1.5 w-12 rounded-full bg-[var(--accent)]" />
                    <span className="text-[13px] font-bold tracking-[0.08em] uppercase text-[var(--accent)]">
                      {graduated ? "Reset Complete" : `Day ${currentDay} of 7`}
                    </span>
                  </div>
                  <h1 className="text-display text-[clamp(28px,4vw,40px)] text-[var(--text-primary)]">
                    {graduated
                      ? "Your Perception Reset"
                      : DAY_MISSIONS.find((m) => m.day === currentDay)?.title ?? "Perception Reset"}
                  </h1>
                </div>

                {/* Progress ring */}
                <ProgressRing completed={completedDays.length} total={7} />
              </div>

              {/* Mission cards */}
              <div className="space-y-3 mb-8">
                {DAY_MISSIONS.map((mission) => (
                  <MissionCard
                    key={mission.day}
                    mission={mission}
                    isUnlocked={isDayUnlocked(mission.day)}
                    isCompleted={isDayCompleted(mission.day)}
                    isCurrent={mission.day === currentDay && !graduated}
                    onClick={() => {
                      if (isDayUnlocked(mission.day) || isDayCompleted(mission.day)) {
                        router.push(mission.route);
                      }
                    }}
                  />
                ))}
              </div>

              {/* Privacy badge */}
              <OnDeviceBadge />
            </div>
          )}
        </div>
      </AppShell>
    </OnboardingGate>
  );
}

/* ================================================================
   PILLAR CARD — shown on pre-start hero
   ================================================================ */

function PillarCard({
  icon,
  title,
  description,
  variant,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant: "sage" | "warm" | "coral";
}) {
  const bg = {
    sage: "card-gradient-sage",
    warm: "card-gradient-warm",
    coral: "card-gradient-coral",
  };
  const iconBg = {
    sage: "icon-sage",
    warm: "icon-warm",
    coral: "icon-coral",
  };

  return (
    <div
      className={`${bg[variant]} rounded-[var(--radius-lg)] p-5 animate-fade-up`}
    >
      <div className={`icon-container icon-md ${iconBg[variant]} rounded-[14px] mb-4`}>
        {icon}
      </div>
      <h3 className="text-title text-[16px] text-[var(--text-primary)] mb-1.5">
        {title}
      </h3>
      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}

/* ================================================================
   MISSION CARD — single day in the 7-day flow
   ================================================================ */

function MissionCard({
  mission,
  isUnlocked,
  isCompleted,
  isCurrent,
  onClick,
}: {
  mission: DayMission;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const pillarColors = {
    simulator: "var(--accent)",
    barrier: "var(--amber)",
    journal: "var(--coral)",
    graduation: "var(--accent)",
  };

  const accessible = isUnlocked || isCompleted;

  return (
    <button
      onClick={onClick}
      disabled={!accessible}
      className={`w-full text-left rounded-[var(--radius-md)] p-5 transition-all ${
        isCurrent
          ? "card-elevated ring-2 ring-[var(--accent)]/20"
          : isCompleted
            ? "card bg-[var(--bg-card)] opacity-80"
            : accessible
              ? "card-interactive"
              : "card opacity-40 cursor-not-allowed"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Day number / check */}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-[12px] shrink-0 text-[14px] font-bold ${
            isCompleted
              ? "bg-[var(--accent)] text-white"
              : isCurrent
                ? "bg-[var(--accent-light)] text-[var(--accent)]"
                : "bg-[var(--warm-200)] text-[var(--text-muted)]"
          }`}
        >
          {isCompleted ? <IconCheck size={18} /> : mission.day}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`text-title text-[15px] ${
                accessible ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              }`}
            >
              {mission.title}
            </h3>
            {isCurrent && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded-full">
                Today
              </span>
            )}
          </div>
          <p
            className={`text-[13px] leading-relaxed ${
              accessible ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
            }`}
          >
            {mission.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span
              className="text-[11px] font-semibold"
              style={{ color: pillarColors[mission.pillar] }}
            >
              {mission.pillar === "simulator" && "Distortion Simulator"}
              {mission.pillar === "barrier" && "Barrier Risk Engine"}
              {mission.pillar === "journal" && "Private Journal"}
              {mission.pillar === "graduation" && "Summary"}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              ~{mission.durationMinutes} min
            </span>
          </div>
        </div>

        {/* Arrow */}
        {accessible && !isCompleted && (
          <IconArrowRight
            size={16}
            className="text-[var(--text-muted)] shrink-0 mt-1"
          />
        )}
      </div>
    </button>
  );
}

/* ================================================================
   PROGRESS RING — SVG circle showing completion
   ================================================================ */

function ProgressRing({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const progress = total > 0 ? completed / total : 0;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* Background ring */}
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="var(--warm-300)"
          strokeWidth="4"
        />
        {/* Progress ring */}
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-[16px] font-bold text-[var(--text-primary)]">
          {completed}
        </span>
        <span className="text-[12px] text-[var(--text-muted)]">/{total}</span>
      </div>
    </div>
  );
}
