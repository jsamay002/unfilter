"use client";

import { useState } from "react";
import { ButtonPrimary, ButtonText, SectionLabel } from "@/components/ui";
import type { Goal, TimeBudget } from "../types";

interface PersonalizeStepProps {
  onContinue: (data: {
    goals: Goal[];
    sensitivities: string;
    timeBudget: TimeBudget;
  }) => void;
  onSkip: () => void;
}

const GOALS: { value: Goal; icon: string; label: string; color: string }[] = [
  { value: "acne", icon: "🔴", label: "Breakouts", color: "border-l-[#d44a32]" },
  { value: "irritation", icon: "🩹", label: "Irritation & redness", color: "border-l-[#e8b86d]" },
  { value: "routine", icon: "🧴", label: "Build a routine", color: "border-l-[#7da37d]" },
  { value: "confidence", icon: "✨", label: "Skin confidence", color: "border-l-[#8b7ec8]" },
];

const TIME_OPTIONS: { value: TimeBudget; label: string; sub: string }[] = [
  { value: "2min", label: "2 min", sub: "Quick" },
  { value: "5min", label: "5 min", sub: "Balanced" },
  { value: "10min", label: "10 min", sub: "Thorough" },
];

export function PersonalizeStep({ onContinue, onSkip }: PersonalizeStepProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sensitivities, setSensitivities] = useState("");
  const [timeBudget, setTimeBudget] = useState<TimeBudget>("5min");

  const toggle = (g: Goal) =>
    setGoals((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7f4ef] mb-4">
          <span className="text-[22px]">🎯</span>
        </div>
        <h2 className="text-heading text-[22px] text-[#2e2a25] mb-2">
          What brings you here?
        </h2>
        <p className="text-[14px] text-[#8a7d6e] leading-relaxed">
          Pick what you care about most. This helps us personalize your
          experience. Everything here is optional.
        </p>
      </div>

      {/* Goals */}
      <div className="mb-8 animate-fade-up stagger-1">
        <SectionLabel>Your goals</SectionLabel>
        <div className="space-y-2">
          {GOALS.map((g) => {
            const active = goals.includes(g.value);
            return (
              <button
                key={g.value}
                onClick={() => toggle(g.value)}
                className={`
                  w-full border-l-[3px] ${g.color} text-left
                  px-4 py-3.5 flex items-center gap-3 rounded-2xl border
                  transition-all duration-150
                  ${
                    active
                      ? "bg-[#eef3ee] border-[#c8d9c8] shadow-sm"
                      : "bg-white border-[#e8e2d8] hover:bg-[#faf8f4]"
                  }
                `}
              >
                <span className="text-[18px]">{g.icon}</span>
                <span className="flex-1 text-[14px] font-semibold text-[#2e2a25]">
                  {g.label}
                </span>
                <div
                  className={`
                    flex h-5 w-5 items-center justify-center rounded-md border-[1.5px]
                    transition-all duration-150
                    ${
                      active
                        ? "border-[#3d5a3d] bg-[#3d5a3d]"
                        : "border-[#d0c9bf]"
                    }
                  `}
                >
                  {active && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sensitivities */}
      <div className="mb-8 animate-fade-up stagger-2">
        <SectionLabel>Allergies or sensitivities</SectionLabel>
        <input
          type="text"
          value={sensitivities}
          onChange={(e) => setSensitivities(e.target.value)}
          placeholder="e.g. fragrance, salicylic acid, latex…"
          className="
            w-full rounded-2xl border border-[#e0dbd3] bg-white
            px-4 py-3.5 text-[14px] text-[#2e2a25]
            placeholder:text-[#c4bbb0]
            focus:border-[#a3bfa3] focus:outline-none focus:ring-2 focus:ring-[#eef3ee]
            transition-all duration-150
          "
        />
        <p className="mt-1.5 text-[11px] text-[#b0a697]">
          We&apos;ll flag these in product recommendations
        </p>
      </div>

      {/* Time budget */}
      <div className="mb-10 animate-fade-up stagger-3">
        <SectionLabel>Routine time budget</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTimeBudget(t.value)}
              className={`
                rounded-2xl border py-3.5 text-center transition-all duration-150
                ${
                  timeBudget === t.value
                    ? "border-[#3d5a3d] bg-[#eef3ee] shadow-sm"
                    : "border-[#e0dbd3] bg-white hover:bg-[#faf8f4]"
                }
              `}
            >
              <p
                className={`text-[15px] font-semibold ${
                  timeBudget === t.value ? "text-[#3d5a3d]" : "text-[#2e2a25]"
                }`}
              >
                {t.label}
              </p>
              <p className="text-[11px] text-[#8a7d6e] mt-0.5">{t.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="animate-fade-up stagger-4">
        <ButtonPrimary
          onClick={() => onContinue({ goals, sensitivities, timeBudget })}
          className="w-full"
        >
          Continue →
        </ButtonPrimary>
        <div className="mt-3 text-center">
          <ButtonText onClick={onSkip}>Skip for now</ButtonText>
        </div>
      </div>
    </div>
  );
}
