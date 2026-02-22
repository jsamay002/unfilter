// ============================================================
// Onboarding Types
// ============================================================

export type OnboardingStep =
  | "welcome"
  | "privacy"
  | "age-gate"
  | "personalize"
  | "tutorial"
  | "complete";

export interface UserProfile {
  ageGroup: "under13" | "13-15" | "16-17" | "18plus" | null;
  goals: Goal[];
  sensitivities: string;
  timeBudget: TimeBudget;
  onboardingComplete: boolean;
  createdAt: number;
}

export type Goal = "acne" | "irritation" | "routine" | "confidence";

export type TimeBudget = "2min" | "5min" | "10min";

export const DEFAULT_PROFILE: UserProfile = {
  ageGroup: null,
  goals: [],
  sensitivities: "",
  timeBudget: "5min",
  onboardingComplete: false,
  createdAt: Date.now(),
};
