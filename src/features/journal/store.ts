import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JournalEntry } from "./types";

interface JournalStore {
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
  updateNote: (id: string, note: string) => void;
  updateTags: (id: string, tags: string[]) => void;
  clearAll: () => void;
}

export const useJournalStore = create<JournalStore>()(
  persist(
    (set) => ({
      entries: [],

      addEntry: (entry) =>
        set((s) => ({
          entries: [entry, ...s.entries],
        })),

      deleteEntry: (id) =>
        set((s) => ({
          entries: s.entries.filter((e) => e.id !== id),
        })),

      updateNote: (id, note) =>
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id ? { ...e, note } : e
          ),
        })),

      updateTags: (id, tags) =>
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id ? { ...e, tags } : e
          ),
        })),

      clearAll: () => set({ entries: [] }),
    }),
    {
      name: "unfilter-journal",
    }
  )
);
