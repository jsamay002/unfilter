// ============================================================
// Journal Types
// ============================================================

export interface JournalEntry {
  id: string;
  timestamp: number;
  // Photo (stored as base64 data URL, redacted/cropped)
  photoDataUrl: string | null;
  // Metrics snapshot
  metrics: {
    redness: number;
    texture: number;
    spotCount: number;
    uniformity: number;
    reliability: number;
  };
  // Symptom context
  symptoms: {
    itchOrPain: "none" | "itch" | "pain" | "both";
    duration: "today" | "fewDays" | "week" | "moreThanWeek";
    spreading: boolean;
    fever: boolean;
    newProducts: string;
    location: string;
    stressLevel: "low" | "medium" | "high" | "skip";
  };
  // Results
  categories: {
    name: string;
    confidence: number;
    severity: "low" | "medium" | "high";
  }[];
  // Red flags
  hadRedFlags: boolean;
  escalationLevel: string;
  // User notes
  note: string;
  // Tags for filtering
  tags: string[];
}

export interface JournalTrend {
  date: string; // ISO date
  redness: number;
  texture: number;
  spotCount: number;
}
