"use client";

import { CalloutPanel } from "@/components/ui";
import type { UserProfile } from "../types";

interface AgeGateStepProps {
  onSelect: (age: NonNullable<UserProfile["ageGroup"]>) => void;
}

const AGE_OPTIONS: {
  value: NonNullable<UserProfile["ageGroup"]>;
  label: string;
  features: string;
  accent: string;
}[] = [
  {
    value: "under13",
    label: "Under 13",
    features: "Learn + Confidence mode",
    accent: "border-l-[#e8b86d]",
  },
  {
    value: "13-15",
    label: "13–15",
    features: "All features available",
    accent: "border-l-[#7da37d]",
  },
  {
    value: "16-17",
    label: "16–17",
    features: "All features available",
    accent: "border-l-[#7da37d]",
  },
  {
    value: "18plus",
    label: "18+",
    features: "All features available",
    accent: "border-l-[#7da37d]",
  },
];

export function AgeGateStep({ onSelect }: AgeGateStepProps) {
  return (
    <div className="max-w-md mx-auto px-6 py-8">
      {/* Header — left aligned */}
      <div className="mb-8 animate-fade-up">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7f4ef] mb-4">
          <span className="text-[22px]">👋</span>
        </div>
        <h2 className="text-heading text-[22px] text-[#2e2a25] mb-2">
          One quick question
        </h2>
        <p className="text-[14px] text-[#8a7d6e] leading-relaxed max-w-sm">
          We tailor the experience to your age group. We only store which
          group — never your exact age or birthday.
        </p>
      </div>

      {/* Age options */}
      <div className="space-y-2.5 mb-8">
        {AGE_OPTIONS.map((opt, i) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`
              w-full card-interactive border-l-[3px] ${opt.accent}
              px-5 py-4 flex items-center justify-between text-left
              animate-fade-up stagger-${i + 1}
            `}
          >
            <div>
              <p className="text-[15px] font-semibold text-[#2e2a25]">
                {opt.label}
              </p>
              <p className="text-[12px] text-[#8a7d6e] mt-0.5">
                {opt.features}
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[#c4bbb0] shrink-0"
            >
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>

      {/* Under-13 note */}
      <div className="animate-fade-up stagger-5">
        <CalloutPanel icon="🌱" variant="warm">
          <strong>Under 13?</strong> You&apos;ll get full access to learning
          guides and confidence tools. Photo check-ins are available with a
          parent or guardian.
        </CalloutPanel>
      </div>
    </div>
  );
}
