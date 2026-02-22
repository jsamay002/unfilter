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

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      {/* Progress dots */}
      {step !== "complete" && <ProgressDots current={step} />}

      {/* Content area */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          {step === "welcome" && (
            <WelcomeStep onContinue={() => setStep("privacy")} />
          )}

          {step === "privacy" && (
            <PrivacyStep
              onAccept={() => setStep("age-gate")}
              onDecline={() => {
                // Learn-only mode: skip photo features, go to finish
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

          {/* Under-13 redirect */}
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

/* ---- Progress dots ---- */

const STEP_ORDER: OnboardingStep[] = [
  "welcome",
  "privacy",
  "age-gate",
  "personalize",
  "tutorial",
];

function ProgressDots({ current }: { current: OnboardingStep }) {
  const currentIdx = STEP_ORDER.indexOf(current);

  return (
    <div className="flex justify-center gap-2 pt-6 pb-2">
      {STEP_ORDER.map((s, i) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === currentIdx
              ? "w-6 bg-sage-600"
              : i < currentIdx
                ? "w-1.5 bg-sage-300"
                : "w-1.5 bg-sand-300"
          }`}
        />
      ))}
    </div>
  );
}
