import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createZustandStorage } from "../storage";
import {
  type DayNumber,
  type PerceptionResetState,
  type SimulatorSnapshot,
  type BarrierProduct,
  type BarrierConflict,
  INITIAL_RESET_STATE,
  DAY_MISSIONS,
} from "./types";

/*  ================================================================
    PERCEPTION RESET STORE
    
    Manages the 7-day guided flow state.
    Persisted via StorageAdapter (web = localStorage, mobile = MMKV).
    No skin data leaves the device.
    ================================================================ */

interface PerceptionResetActions {
  /** Start the 7-day reset */
  startReset: () => void;

  /** Mark a day as complete and advance to next */
  completeDay: (day: DayNumber) => void;

  /** Save simulator session metadata (no images) */
  addSimulatorSnapshot: (snapshot: SimulatorSnapshot) => void;

  /** Barrier engine: add a product */
  addProduct: (product: BarrierProduct) => void;

  /** Barrier engine: remove a product */
  removeProduct: (productId: string) => void;

  /** Barrier engine: update scan results */
  setBarrierResults: (score: number, conflicts: BarrierConflict[]) => void;

  /** Get the current day's mission */
  getCurrentMission: () => (typeof DAY_MISSIONS)[number] | null;

  /** Check if a specific day is unlocked */
  isDayUnlocked: (day: DayNumber) => boolean;

  /** Check if a specific day is completed */
  isDayCompleted: (day: DayNumber) => boolean;

  /** Full reset (for testing / re-do) */
  resetAll: () => void;
}

type PerceptionResetStore = PerceptionResetState & PerceptionResetActions;

export const usePerceptionResetStore = create<PerceptionResetStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_RESET_STATE,

      startReset: () => {
        set({
          currentDay: 1,
          startedAt: Date.now(),
          completedDays: [],
          graduated: false,
        });
      },

      completeDay: (day: DayNumber) => {
        const state = get();
        const alreadyCompleted = state.completedDays.includes(day);
        const newCompleted = alreadyCompleted
          ? state.completedDays
          : [...state.completedDays, day];

        // Advance to next day if completing current day
        const nextDay = day < 7 ? ((day + 1) as DayNumber) : day;
        const graduated = day === 7;

        set({
          completedDays: newCompleted,
          currentDay: graduated ? 7 : nextDay,
          graduated,
        });
      },

      addSimulatorSnapshot: (snapshot) => {
        set((s) => ({
          simulatorSnapshots: [...s.simulatorSnapshots, snapshot],
        }));
      },

      addProduct: (product) => {
        set((s) => ({
          products: [...s.products, product],
        }));
      },

      removeProduct: (productId) => {
        set((s) => ({
          products: s.products.filter((p) => p.id !== productId),
        }));
      },

      setBarrierResults: (score, conflicts) => {
        set({ barrierScore: score, conflicts });
      },

      getCurrentMission: () => {
        const { currentDay } = get();
        if (currentDay === 0) return null;
        return DAY_MISSIONS.find((m) => m.day === currentDay) ?? null;
      },

      isDayUnlocked: (day: DayNumber) => {
        const { currentDay, completedDays } = get();
        // Day 1 always unlocked once started
        if (day === 1 && currentDay >= 1) return true;
        // A day is unlocked if the previous day is completed
        return completedDays.includes(day - 1);
      },

      isDayCompleted: (day: DayNumber) => {
        return get().completedDays.includes(day);
      },

      resetAll: () => {
        set({ ...INITIAL_RESET_STATE });
      },
    }),
    {
      name: "unfilter-perception-reset",
      storage: createZustandStorage(),
    },
  ),
);
