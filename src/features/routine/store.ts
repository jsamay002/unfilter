import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Routine, RoutineStep, RoutineLog, ProductEntry, ProductCategory } from "./types";

interface RoutineStore {
  routines: Routine[];
  products: ProductEntry[];
  logs: RoutineLog[];

  // Routines
  addRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  addStepToRoutine: (routineId: string, step: RoutineStep) => void;
  removeStepFromRoutine: (routineId: string, stepId: string) => void;

  // Products
  addProduct: (product: ProductEntry) => void;
  deleteProduct: (id: string) => void;

  // Logs
  logRoutine: (routineId: string, date: string, completed: boolean) => void;
  getStreak: (routineId: string) => number;

  clearAll: () => void;
}

export const useRoutineStore = create<RoutineStore>()(
  persist(
    (set, get) => ({
      routines: [],
      products: [],
      logs: [],

      addRoutine: (routine) =>
        set((s) => ({ routines: [...s.routines, routine] })),

      deleteRoutine: (id) =>
        set((s) => ({
          routines: s.routines.filter((r) => r.id !== id),
          logs: s.logs.filter((l) => l.routineId !== id),
        })),

      addStepToRoutine: (routineId, step) =>
        set((s) => ({
          routines: s.routines.map((r) =>
            r.id === routineId
              ? { ...r, steps: [...r.steps, step] }
              : r
          ),
        })),

      removeStepFromRoutine: (routineId, stepId) =>
        set((s) => ({
          routines: s.routines.map((r) =>
            r.id === routineId
              ? { ...r, steps: r.steps.filter((st) => st.id !== stepId) }
              : r
          ),
        })),

      addProduct: (product) =>
        set((s) => ({ products: [...s.products, product] })),

      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      logRoutine: (routineId, date, completed) =>
        set((s) => {
          const existing = s.logs.findIndex(
            (l) => l.routineId === routineId && l.date === date
          );
          if (existing >= 0) {
            const next = [...s.logs];
            next[existing] = { routineId, date, completed };
            return { logs: next };
          }
          return { logs: [...s.logs, { routineId, date, completed }] };
        }),

      getStreak: (routineId) => {
        const logs = get()
          .logs.filter((l) => l.routineId === routineId && l.completed)
          .map((l) => l.date)
          .sort()
          .reverse();

        if (logs.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          if (logs.includes(dateStr)) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }
        return streak;
      },

      clearAll: () => set({ routines: [], products: [], logs: [] }),
    }),
    {
      name: "unfilter-routines",
    }
  )
);
