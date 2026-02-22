"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingStep, Goal, TimeBudget } from "./types";
import { useOnboardingStore } from "./store";
import { WelcomeStep } from "./steps/WelcomeStep";
import { PrivacyStep } from "./steps/PrivacyStep";
import { AgeGateStep } from "./steps/AgeGateStep";
import { Under13Step } from "./steps/Under13Step";
import { PersonalizeStep } from "./steps/PersonalizeStep";
import { TutorialStep } from "./steps/TutorialStep";

const STEP_ORDER: OnboardingStep[] = [
  "welcome",
  "privacy",
  "age-gate",
  "personalize",
  "tutorial",
];

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const {
    setAgeGroup,
    toggleGoal,
    setSensitivities,
    setTimeBudget,
    completeOnboarding,
  } = useOnboardingStore();

  const finish = () => {
    completeOnboarding();
    router.push("/");
  };

  const currentIdx = STEP_ORDER.indexOf(step);
  const showProgress = step !== "welcome" && step !== "complete";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#faf8f4]">
      {/* Progress bar */}
      {showProgress && (
        <div className="sticky top-0 z-50 bg-[#faf8f4]/80 backdrop-blur-md border-b border-[#eae5dd]/60">
          <div className="max-w-lg mx-auto px-6 py-3 flex items-center gap-3">
            {/* Logo */}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3d5a3d] shrink-0">
              <span className="text-white text-[11px] font-bold" style={{ fontFamily: "Outfit" }}>U</span>
            </div>

            {/* Step bar */}
            <div className="flex-1 flex gap-1.5">
              {STEP_ORDER.slice(1).map((s, i) => {
                const stepIdx = i + 1; // offset since we skip "welcome"
                const isActive = stepIdx === currentIdx;
                const isDone = stepIdx < currentIdx;
                return (
                  <div key={s} className="flex-1">
                    <div
                      className={`h-[3px] rounded-full transition-all duration-500 ${
                        isDone
                          ? "bg-[#3d5a3d]"
                          : isActive
                            ? "bg-[#7da37d]"
                            : "bg-[#e0dbd3]"
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Step count */}
            <p className="text-[11px] font-medium text-[#b0a697] tabular-nums shrink-0">
              {Math.min(currentIdx, 4)}/4
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full">
          {step === "welcome" && (
            <WelcomeStep onContinue={() => setStep("privacy")} />
          )}

          {step === "privacy" && (
            <PrivacyStep
              onAccept={() => setStep("age-gate")}
              onDecline={() => {
                completeOnboarding();
                router.push("/learn");
              }}
            />
          )}

          {step === "age-gate" && (
            <AgeGateStep
              onSelect={(age) => {
                setAgeGroup(age);
                if (age === "under13") {
                  setStep("complete");
                } else {
                  setStep("personalize");
                }
              }}
            />
          )}

          {step === "complete" && (
            <Under13Step
              onContinueLearnOnly={() => {
                completeOnboarding();
                router.push("/learn");
              }}
            />
          )}

          {step === "personalize" && (
            <PersonalizeStep
              onContinue={(data: {
                goals: Goal[];
                sensitivities: string;
                timeBudget: TimeBudget;
              }) => {
                data.goals.forEach((g) => toggleGoal(g));
                setSensitivities(data.sensitivities);
                setTimeBudget(data.timeBudget);
                setStep("tutorial");
              }}
              onSkip={() => setStep("tutorial")}
            />
          )}

          {step === "tutorial" && <TutorialStep onFinish={finish} />}
        </div>
      </div>
    </div>
  );
}
