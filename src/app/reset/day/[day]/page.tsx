"use client";

import { useParams, useRouter } from "next/navigation";
import { OnboardingGate } from "@/components/OnboardingGate";
import { OnDeviceBadge } from "@/components/OnDeviceBadge";
import { usePerceptionResetStore, DAY_MISSIONS, type DayNumber } from "@/core/perception-reset";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@/components/icons";

/*  ================================================================
    DAY MISSION LAYOUT — Shared frame for every day screen.
    
    Provides: header with day/title, privacy badge, navigation,
    and a completion button that advances the flow.
    
    Each day's unique content is loaded as children or via
    the specific day component below.
    ================================================================ */

export default function DayPage() {
  const params = useParams();
  const router = useRouter();
  const dayNum = parseInt(params.day as string) as DayNumber;

  const { isDayUnlocked, isDayCompleted, completeDay, currentDay, graduated } =
    usePerceptionResetStore();

  const mission = DAY_MISSIONS.find((m) => m.day === dayNum);
  if (!mission) {
    router.replace("/");
    return null;
  }

  const unlocked = isDayUnlocked(dayNum) || isDayCompleted(dayNum);
  if (!unlocked && !graduated) {
    router.replace("/");
    return null;
  }

  const completed = isDayCompleted(dayNum);

  const handleComplete = () => {
    completeDay(dayNum);
    if (dayNum < 7) {
      router.push(`/reset/day/${dayNum + 1}`);
    } else {
      router.push("/");
    }
  };

  const pillarColors = {
    simulator: { bg: "card-gradient-sage", text: "text-[var(--accent)]" },
    barrier: { bg: "card-gradient-warm", text: "text-[var(--amber)]" },
    journal: { bg: "card-gradient-coral", text: "text-[var(--coral)]" },
    graduation: { bg: "card-gradient-sage", text: "text-[var(--accent)]" },
  };

  return (
    <OnboardingGate>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <div className="max-w-2xl mx-auto px-6 py-8 md:px-12 md:py-10">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8 animate-fade-up">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition"
            >
              <IconArrowLeft size={16} />
              Back to missions
            </button>
            <OnDeviceBadge compact />
          </div>

          {/* Day header */}
          <div className="mb-8 animate-fade-up stagger-1">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-[12px] font-bold uppercase tracking-[0.08em] ${pillarColors[mission.pillar].text}`}
              >
                {mission.subtitle}
              </span>
              {completed && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded-full">
                  <IconCheck size={10} /> Done
                </span>
              )}
            </div>
            <h1 className="text-display text-[clamp(28px,4vw,40px)] text-[var(--text-primary)] mb-3">
              {mission.title}
            </h1>
            <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-lg">
              {mission.description}
            </p>
          </div>

          {/* Day-specific content placeholder */}
          <div className="mb-10 animate-fade-up stagger-2">
            <div className={`${pillarColors[mission.pillar].bg} rounded-[var(--radius-lg)] p-8 min-h-[300px] flex items-center justify-center`}>
              <div className="text-center">
                <p className="text-[15px] font-semibold text-[var(--text-primary)] mb-2">
                  Day {dayNum} — {mission.pillar === "simulator" ? "Distortion Simulator" : mission.pillar === "barrier" ? "Barrier Risk Engine" : mission.pillar === "journal" ? "Journal" : "Summary"}
                </p>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  Interactive content will be built in Step 2-5
                </p>
              </div>
            </div>
          </div>

          {/* Complete + navigate */}
          <div className="flex items-center justify-between animate-fade-up stagger-3">
            {dayNum > 1 && (
              <button
                onClick={() => router.push(`/reset/day/${dayNum - 1}`)}
                className="btn-ghost text-[14px]"
              >
                <IconArrowLeft size={16} />
                Day {dayNum - 1}
              </button>
            )}
            <div className="ml-auto">
              {!completed ? (
                <button onClick={handleComplete} className="btn-primary">
                  {dayNum === 7 ? "Complete the Reset" : "Complete & Continue"}
                  <IconArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() =>
                    dayNum < 7
                      ? router.push(`/reset/day/${dayNum + 1}`)
                      : router.push("/")
                  }
                  className="btn-secondary"
                >
                  {dayNum < 7 ? `Go to Day ${dayNum + 1}` : "Back to Home"}
                  <IconArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </OnboardingGate>
  );
}
