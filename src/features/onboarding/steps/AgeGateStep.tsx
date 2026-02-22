"use client";

import type { UserProfile } from "../types";

interface AgeGateStepProps {
  onSelect: (age: NonNullable<UserProfile["ageGroup"]>) => void;
}

const AGE_OPTIONS: {
  value: NonNullable<UserProfile["ageGroup"]>;
  label: string;
  sublabel: string;
}[] = [
  { value: "under13", label: "Under 13", sublabel: "Learn-only mode" },
  { value: "13-15", label: "13 – 15", sublabel: "Full features" },
  { value: "16-17", label: "16 – 17", sublabel: "Full features" },
  { value: "18plus", label: "18+", sublabel: "Full features" },
];

export function AgeGateStep({ onSelect }: AgeGateStepProps) {
  return (
    <div className="px-2 animate-fade-up">
      <div className="text-center mb-8">
        <span className="text-3xl">🎂</span>
        <h2 className="mt-3 font-display text-xl font-bold text-sand-900">
          How old are you?
        </h2>
        <p className="mt-1 text-sm text-sand-500 max-w-xs mx-auto">
          We ask to make sure the experience is right for you. We don&apos;t
          store your exact age — just which group you&apos;re in.
        </p>
      </div>

      <div className="space-y-2.5 max-w-xs mx-auto">
        {AGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="w-full card border border-sand-200 px-5 py-4 flex items-center justify-between transition hover:border-sage-300 hover:bg-sage-50 active:scale-[0.98]"
          >
            <span className="text-sm font-semibold text-sand-800">
              {opt.label}
            </span>
            <span className="text-xs text-sand-400 bg-sand-100 rounded-full px-2.5 py-1">
              {opt.sublabel}
            </span>
          </button>
        ))}
      </div>

      {/* Under-13 explanation */}
      <div className="mt-6 rounded-xl bg-sand-50 border border-sand-200 px-4 py-3 max-w-xs mx-auto">
        <p className="text-[11px] text-sand-500 leading-relaxed">
          <strong>Under 13?</strong> You can still explore Learn Hub and
          Confidence Mode — just no photo check-ins. We encourage getting a
          parent or guardian involved for the best experience.
        </p>
      </div>
    </div>
  );
}
