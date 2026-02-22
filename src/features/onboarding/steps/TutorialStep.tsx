"use client";

import { ButtonPrimary, CalloutPanel, SectionLabel } from "@/components/ui";

interface TutorialStepProps {
  onFinish: () => void;
}

const TIPS = [
  {
    do: "Face a window for soft, natural light",
    dont: "Flash or overhead fluorescent lighting",
    icon: "💡",
  },
  {
    do: "Hold phone 6–10 inches from the area",
    dont: "Using camera zoom (reduces quality)",
    icon: "📏",
  },
  {
    do: "Crop close to the area of concern",
    dont: "Including your full face unnecessarily",
    icon: "✂️",
  },
  {
    do: "Use your normal camera — no beauty mode",
    dont: "Smoothing filters or skin-editing apps",
    icon: "📸",
  },
  {
    do: "Brace your elbow and hold steady",
    dont: "Moving while taking the photo",
    icon: "🤳",
  },
];

export function TutorialStep({ onFinish }: TutorialStepProps) {
  return (
    <div className="max-w-md mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f7f4ef] mb-4">
          <span className="text-[22px]">📷</span>
        </div>
        <h2 className="text-heading text-[22px] text-[#2e2a25] mb-2">
          Better photos, better guidance
        </h2>
        <p className="text-[14px] text-[#8a7d6e] leading-relaxed">
          A few quick tips to get the most accurate results. Takes 30 seconds.
        </p>
      </div>

      {/* Tips */}
      <div className="space-y-2.5 mb-6">
        {TIPS.map((tip, i) => (
          <div
            key={i}
            className={`card px-4 py-3.5 animate-fade-up stagger-${i + 1}`}
          >
            <div className="flex gap-3 items-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f7f4ef] text-[17px]">
                {tip.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-[6px] w-[6px] rounded-full bg-[#7da37d]" />
                  <p className="text-[13px] font-semibold text-[#2e2a25]">
                    {tip.do}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-[6px] w-[6px] rounded-full bg-[#d4a0a0]" />
                  <p className="text-[12px] text-[#8a7d6e]">{tip.dont}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reassurance */}
      <div className="mb-8 animate-fade-up stagger-6">
        <CalloutPanel icon="✅" variant="sage">
          Don&apos;t worry about getting it perfect — our quality check will let
          you know if a retake would help.
        </CalloutPanel>
      </div>

      {/* CTA */}
      <div className="animate-fade-up stagger-6">
        <ButtonPrimary onClick={onFinish} className="w-full">
          I&apos;m ready — let&apos;s go
        </ButtonPrimary>
      </div>
    </div>
  );
}
