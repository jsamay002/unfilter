// ============================================================
// Routine Builder Types
// ============================================================

export interface RoutineStep {
  id: string;
  product: string; // e.g. "Gentle cleanser"
  category: ProductCategory;
  notes: string;
  order: number;
}

export type ProductCategory =
  | "cleanser"
  | "toner"
  | "serum"
  | "moisturizer"
  | "sunscreen"
  | "treatment"
  | "other";

export interface Routine {
  id: string;
  name: string;
  time: "am" | "pm" | "sport";
  steps: RoutineStep[];
  createdAt: number;
}

export interface ProductEntry {
  id: string;
  name: string;
  category: ProductCategory;
  startDate: number;
  notes: string;
}

export interface RoutineLog {
  date: string; // ISO date YYYY-MM-DD
  routineId: string;
  completed: boolean;
}

export const CATEGORY_INFO: Record<
  ProductCategory,
  { icon: string; label: string; order: number }
> = {
  cleanser: { icon: "🧼", label: "Cleanser", order: 1 },
  toner: { icon: "💧", label: "Toner", order: 2 },
  serum: { icon: "💎", label: "Serum", order: 3 },
  treatment: { icon: "💊", label: "Treatment", order: 4 },
  moisturizer: { icon: "🧴", label: "Moisturizer", order: 5 },
  sunscreen: { icon: "☀️", label: "Sunscreen", order: 6 },
  other: { icon: "✨", label: "Other", order: 7 },
};

// Pre-built templates from the flowchart
export const ROUTINE_TEMPLATES: Omit<Routine, "id" | "createdAt">[] = [
  {
    name: "2-Min Morning",
    time: "am",
    steps: [
      { id: "t1-1", product: "Gentle cleanser", category: "cleanser", notes: "Lukewarm water", order: 1 },
      { id: "t1-2", product: "Moisturizer with SPF", category: "sunscreen", notes: "SPF 30+ broad spectrum", order: 2 },
    ],
  },
  {
    name: "2-Min Night",
    time: "pm",
    steps: [
      { id: "t2-1", product: "Gentle cleanser", category: "cleanser", notes: "Remove the day", order: 1 },
      { id: "t2-2", product: "Moisturizer", category: "moisturizer", notes: "Fragrance-free", order: 2 },
    ],
  },
  {
    name: "5-Min Morning",
    time: "am",
    steps: [
      { id: "t3-1", product: "Gentle cleanser", category: "cleanser", notes: "Lukewarm water", order: 1 },
      { id: "t3-2", product: "Moisturizer", category: "moisturizer", notes: "Lightweight, non-comedogenic", order: 2 },
      { id: "t3-3", product: "Sunscreen SPF 30+", category: "sunscreen", notes: "Apply generously, reapply every 2 hours in sun", order: 3 },
    ],
  },
  {
    name: "5-Min Night",
    time: "pm",
    steps: [
      { id: "t4-1", product: "Gentle cleanser", category: "cleanser", notes: "Double cleanse if wearing SPF", order: 1 },
      { id: "t4-2", product: "Treatment (if using)", category: "treatment", notes: "One active at a time — start slow", order: 2 },
      { id: "t4-3", product: "Moisturizer", category: "moisturizer", notes: "Slightly richer than morning", order: 3 },
    ],
  },
  {
    name: "Post-Workout",
    time: "sport",
    steps: [
      { id: "t5-1", product: "Gentle cleanser", category: "cleanser", notes: "Within 30 min of sweating", order: 1 },
      { id: "t5-2", product: "Moisturizer", category: "moisturizer", notes: "Lightweight gel-based", order: 2 },
    ],
  },
];
