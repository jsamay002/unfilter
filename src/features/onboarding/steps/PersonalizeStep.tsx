"use client";

import { useState } from "react";
import type { Goal, TimeBudget } from "../types";

interface PersonalizeStepProps {
  onContinue: (data: {
    goals: Goal[];
    sensitivities: string;
    timeBudget: TimeBudget;
  }) => void;
  onSkip: () => void;
}

const GOALS: { value: Goal; icon: string; label: string; desc: string }[] = [
  {
    value: "acne",
    icon: "🔴",
    label: "Breakouts / Acne",
    desc: "Track and manage breakouts",
  },
  {
    value: "irritation",
    icon: "🩹",
    label: "Irritation / Redness",
    desc: "Calm and protect sensitive skin",
  },
  {
    value: "routine",
    icon: "🧴",
    label: "Build a Routine",
    desc: "Start or simplify a skincare routine",
  },
  {
    value: "confidence",
    icon: "✨",
    label: "Skin Confidence",
    desc: "Feel good about your real skin",
  },
];

const TIME_OPTIONS: { value: TimeBudget; label: string }[] = [
  { value: "2min", label: "2 min — Quick & simple" },
  { value: "5min", label: "5 min — Balanced" },
  { value: "10min", label: "10 min — Full routine" },
];

export function PersonalizeStep({ onContinue, onSkip }: PersonalizeStepProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sensitivities, setSensitivities] = useState("");
  const [timeBudget, setTimeBudget] = useState<TimeBudget>("5min");

  const toggleGoal = (g: Goal) =>
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );

  return (
    <div className="px-2 animate-fade-up">
      <div className="text-center mb-6">
        <span className="text-3xl">🎯</span>
        <h2 className="mt-3 font-display text-xl font-bold text-sand-900">
          What brings you here?
        </h2>
        <p className="mt-1 text-sm text-sand-500">
          Pick your goals so we can personalize your experience. All optional.
        </p>
      </div>

      {/* Goals — multi-select */}
      <div className="space-y-2 mb-6">
        {GOALS.map((g) => {
          const active = goals.includes(g.value);
          return (
            <button
              key={g.value}
              onClick={() => toggleGoal(g.value)}
              className={`w-full card border px-4 py-3.5 flex items-center gap-3 transition active:scale-[0.98] ${
                active
                  ? "border-sage-300 bg-sage-50"
                  : "border-sand-200 hover:border-sand-300"
              }`}
            >
              <span className="text-lg">{g.icon}</span>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-sand-800">
                  {g.label}
                </p>
                <p className="text-xs text-sand-500">{g.desc}</p>
              </div>
              <div
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition ${
                  active
                    ? "border-sage-600 bg-sage-600"
                    : "border-sand-300"
                }`}
              >
                {active && (
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="currentColor"
                      strokeWidth="2"
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

      {/* Sensitivities */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-sand-700 mb-1.5">
          Any known allergies or sensitivities? <span className="text-sand-400">(optional)</span>
        </label>
        <input
          type="text"
          value={sensitivities}
          onChange={(e) => setSensitivities(e.target.value)}
          placeholder="e.g. fragrance, salicylic acid, latex…"
          className="w-full rounded-xl border border-sand-200 bg-white px-4 py-3 text-sm text-sand-800 placeholder:text-sand-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-100 transition"
        />
      </div>

      {/* Time budget */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-sand-700 mb-2">
          How much time for your routine?
        </label>
        <div className="flex gap-2">
          {TIME_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTimeBudget(t.value)}
              className={`flex-1 rounded-xl border py-2.5 text-xs font-medium transition active:scale-[0.97] ${
                timeBudget === t.value
                  ? "border-sage-400 bg-sage-50 text-sage-800"
                  : "border-sand-200 text-sand-500 hover:border-sand-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onContinue({ goals, sensitivities, timeBudget })}
        className="w-full rounded-2xl bg-sage-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-sage-200 transition hover:bg-sage-700 active:scale-[0.98]"
      >
        Continue →
      </button>

      <button
        onClick={onSkip}
        className="mt-2 w-full text-center text-sm text-sand-400 hover:text-sand-600 py-2 transition"
      >
        Skip for now
      </button>
    </div>
  );
}
