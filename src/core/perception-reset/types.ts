/*  ================================================================
    PERCEPTION RESET — Shared Types
    Platform-agnostic. No React/DOM dependencies.
    ================================================================ */

export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface DayMission {
  day: DayNumber;
  title: string;
  subtitle: string;
  pillar: "simulator" | "barrier" | "journal" | "graduation";
  route: string;
  /** Brief description shown on the mission card */
  description: string;
  /** Estimated time to complete */
  durationMinutes: number;
}

export const DAY_MISSIONS: readonly DayMission[] = [
  {
    day: 1,
    title: "Spot the Edit",
    subtitle: "Day 1 · Detective Training",
    pillar: "simulator",
    route: "/reset/day/1",
    description:
      "Train your eye to detect common photo edits — smoothing, reshaping, color grading. Once you see how it works, you can never unsee it.",
    durationMinutes: 4,
  },
  {
    day: 2,
    title: "The Filter Effect",
    subtitle: "Day 2 · Filter Literacy",
    pillar: "simulator",
    route: "/reset/day/2",
    description:
      "Explore how filters change your perception of skin. Compare filtered vs. natural and discover what's being hidden — and why.",
    durationMinutes: 4,
  },
  {
    day: 3,
    title: "Lighting Truth",
    subtitle: "Day 3 · Lighting Science",
    pillar: "simulator",
    route: "/reset/day/3",
    description:
      "Learn how lighting dramatically changes how skin looks in photos. The skin stays the same — only the light changes everything.",
    durationMinutes: 3,
  },
  {
    day: 4,
    title: "Angle Academy",
    subtitle: "Day 4 · Perspective Shift",
    pillar: "barrier",
    route: "/reset/day/4",
    description:
      "Discover how camera angles distort facial features. What looks 'wrong' in a photo is often just physics, not your face.",
    durationMinutes: 3,
  },
  {
    day: 5,
    title: "Social Media Audit",
    subtitle: "Day 5 · Feed Reflection",
    pillar: "journal",
    route: "/reset/day/5",
    description:
      "Take a guided look at your social media feed. Reflect on who you follow, what images you see, and how they shape how you feel about your skin.",
    durationMinutes: 5,
  },
  {
    day: 6,
    title: "Compliment Reframe",
    subtitle: "Day 6 · Inner Dialogue",
    pillar: "journal",
    route: "/reset/day/6",
    description:
      "Shift from appearance-based to character-based self-talk. Build affirmations that celebrate who you are, not just how you look.",
    durationMinutes: 4,
  },
  {
    day: 7,
    title: "Graduation",
    subtitle: "Day 7 · Your Reset Complete",
    pillar: "graduation",
    route: "/reset/day/7",
    description:
      "Celebrate completing the Perception Reset. Review what you've learned, make a commitment pledge, and share your achievement.",
    durationMinutes: 3,
  },
] as const;

export interface SimulatorSnapshot {
  day: DayNumber;
  timestamp: number;
  /** Not the image itself — just metadata about what was demonstrated */
  distortionLevels: {
    smoothing: number;
    contrast: number;
    lighting: number;
  };
}

export interface BarrierProduct {
  id: string;
  name: string;
  category: "cleanser" | "moisturizer" | "sunscreen" | "treatment" | "exfoliant" | "serum" | "other";
  activeIngredients: string[];
  addedAt: number;
}

export interface BarrierConflict {
  ingredients: [string, string];
  severity: "caution" | "warning" | "danger";
  explanation: string;
  recommendation: string;
}

export interface PerceptionResetState {
  /** Which day the user is on (1-7, or 0 if not started) */
  currentDay: DayNumber | 0;
  /** Set of completed day numbers */
  completedDays: number[];
  /** When the reset was started */
  startedAt: number | null;
  /** Simulator session metadata (no images stored) */
  simulatorSnapshots: SimulatorSnapshot[];
  /** Barrier engine data */
  products: BarrierProduct[];
  conflicts: BarrierConflict[];
  barrierScore: number | null;
  /** Has the user completed the full 7-day reset */
  graduated: boolean;
}

export const INITIAL_RESET_STATE: PerceptionResetState = {
  currentDay: 0,
  completedDays: [],
  startedAt: null,
  simulatorSnapshots: [],
  products: [],
  conflicts: [],
  barrierScore: null,
  graduated: false,
};
