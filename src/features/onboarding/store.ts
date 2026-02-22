import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, Goal, TimeBudget } from "./types";
import { DEFAULT_PROFILE } from "./types";

interface OnboardingStore {
  profile: UserProfile;
  setAgeGroup: (age: UserProfile["ageGroup"]) => void;
  toggleGoal: (goal: Goal) => void;
  setSensitivities: (text: string) => void;
  setTimeBudget: (budget: TimeBudget) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      profile: { ...DEFAULT_PROFILE },

      setAgeGroup: (ageGroup) =>
        set((s) => ({ profile: { ...s.profile, ageGroup } })),

      toggleGoal: (goal) =>
        set((s) => {
          const goals = s.profile.goals.includes(goal)
            ? s.profile.goals.filter((g) => g !== goal)
            : [...s.profile.goals, goal];
          return { profile: { ...s.profile, goals } };
        }),

      setSensitivities: (sensitivities) =>
        set((s) => ({ profile: { ...s.profile, sensitivities } })),

      setTimeBudget: (timeBudget) =>
        set((s) => ({ profile: { ...s.profile, timeBudget } })),

      completeOnboarding: () =>
        set((s) => ({
          profile: { ...s.profile, onboardingComplete: true },
        })),

      resetOnboarding: () =>
        set({ profile: { ...DEFAULT_PROFILE, createdAt: Date.now() } }),
    }),
    {
      name: "unfilter-profile",
    }
  )
);
