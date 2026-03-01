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
    title: "See the distortion",
    subtitle: "Day 1 · Distortion Simulator",
    pillar: "simulator",
    route: "/reset/day/1",
    description:
      "Take or select a photo (processed locally, never uploaded). Watch as digital smoothing alters what you see — and learn what's really happening.",
    durationMinutes: 3,
  },
  {
    day: 2,
    title: "Light & contrast tricks",
    subtitle: "Day 2 · Lighting Presets",
    pillar: "simulator",
    route: "/reset/day/2",
    description:
      "See how lighting and tone compression change the same photo dramatically. The skin didn't change — the light did.",
    durationMinutes: 3,
  },
  {
    day: 3,
    title: "Your skin today",
    subtitle: "Day 3 · Journal Check-in",
    pillar: "journal",
    route: "/reset/day/3",
    description:
      "Capture how your skin looks and feels right now. No filters, no judgment — just an honest record stored only on your device.",
    durationMinutes: 2,
  },
  {
    day: 4,
    title: "What's in your routine?",
    subtitle: "Day 4 · Barrier Risk Scan",
    pillar: "barrier",
    route: "/reset/day/4",
    description:
      "Enter your current products and get an instant safety score. See if anything is conflicting or putting your skin barrier at risk.",
    durationMinutes: 4,
  },
  {
    day: 5,
    title: "The 72-hour rule",
    subtitle: "Day 5 · New Product Safety",
    pillar: "barrier",
    route: "/reset/day/5",
    description:
      "Learn why new products need time. Set a watch timer for anything you're introducing so you can track reactions safely.",
    durationMinutes: 3,
  },
  {
    day: 6,
    title: "Unfiltered you",
    subtitle: "Day 6 · Reverse Distortion",
    pillar: "simulator",
    route: "/reset/day/6",
    description:
      "Start with a heavily filtered version of your photo. Slowly strip away the distortion until you see the real image. That's the real you.",
    durationMinutes: 3,
  },
  {
    day: 7,
    title: "Perception Reset complete",
    subtitle: "Day 7 · Your Summary",
    pillar: "graduation",
    route: "/reset/day/7",
    description:
      "See what you've learned: distortions you spotted, your barrier safety score, journal entries captured — and zero bytes sent to any server.",
    durationMinutes: 2,
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
