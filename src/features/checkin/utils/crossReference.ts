// ============================================================
// Cross-Reference Engine
//
// Compares what the CAMERA detected vs what the USER reported.
// Flags mismatches so the app can gently surface things the
// teen might have missed, downplayed, or not known to report.
//
// This is NOT calling the user a liar. It's a safety net:
// "Hey, we noticed something you didn't mention."
// ============================================================

import type { SkinMetrics, SymptomContext } from "../types";

export interface Discrepancy {
  /** What the mismatch is about */
  area: "redness" | "blemishes" | "texture" | "spreading";
  /** What the camera measured */
  cameraReading: string;
  /** What the user reported */
  userReported: string;
  /** Plain-language teen-friendly explanation */
  message: string;
  /** How significant is this mismatch (affects how prominently we show it) */
  severity: "info" | "noteworthy" | "important";
}

export interface CrossReferenceResult {
  /** Are the camera and user generally in agreement? */
  aligned: boolean;
  /** Specific mismatches found */
  discrepancies: Discrepancy[];
  /** Overall summary for the user */
  summary: string;
}

/**
 * Compare image analysis metrics against user-reported symptoms.
 * Returns discrepancies where the camera and user disagree.
 */
export function crossReference(
  metrics: SkinMetrics,
  symptoms: SymptomContext
): CrossReferenceResult {
  const discrepancies: Discrepancy[] = [];

  // ---- Redness mismatch ----
  // Camera sees high redness but user didn't report itch/pain
  if (metrics.redness > 0.5 && symptoms.itchOrPain === "none") {
    discrepancies.push({
      area: "redness",
      cameraReading: `Redness level: ${Math.round(metrics.redness * 100)}%`,
      userReported: "No itch or pain reported",
      message:
        "Your photo shows noticeable redness, but you said nothing hurts or itches. " +
        "That's okay — redness doesn't always feel uncomfortable. " +
        "But it's worth watching. If it gets worse or starts itching, that's useful info for next time.",
      severity: metrics.redness > 0.7 ? "important" : "noteworthy",
    });
  }

  // Camera sees low redness but user reports pain
  if (metrics.redness < 0.2 && (symptoms.itchOrPain === "pain" || symptoms.itchOrPain === "both")) {
    discrepancies.push({
      area: "redness",
      cameraReading: `Redness level: ${Math.round(metrics.redness * 100)}%`,
      userReported: "Pain reported",
      message:
        "You mentioned pain, but the photo doesn't show much redness. " +
        "Some skin issues hurt without looking red — that's real and valid. " +
        "A camera can't feel what you feel. Your experience matters more than what the photo shows.",
      severity: "noteworthy",
    });
  }

  // ---- Blemish count mismatch ----
  // Camera detects many blemishes but user said "started today"
  if (metrics.spotCount > 8 && symptoms.duration === "today") {
    discrepancies.push({
      area: "blemishes",
      cameraReading: `${metrics.spotCount} blemishes detected`,
      userReported: "Started today",
      message:
        `The camera found ${metrics.spotCount} spots, which usually takes more than a day to develop. ` +
        "You might not have noticed them building up — that's completely normal. " +
        "It doesn't mean anything is wrong, but it's helpful context for tracking changes.",
      severity: "info",
    });
  }

  // Camera sees many spots but user didn't report spreading
  if (metrics.spotCount > 10 && !symptoms.spreading) {
    discrepancies.push({
      area: "spreading",
      cameraReading: `${metrics.spotCount} blemishes detected across the area`,
      userReported: "Not spreading",
      message:
        "The camera picked up multiple spots across the area. That doesn't necessarily mean it's " +
        "\"spreading\" — some breakouts appear in clusters. " +
        "If you notice new spots in places that were clear before, that's what spreading looks like.",
      severity: metrics.spotCount > 15 ? "noteworthy" : "info",
    });
  }

  // ---- Texture mismatch ----
  // High texture variance but user didn't report any concerns
  if (
    metrics.texture > 0.6 &&
    symptoms.itchOrPain === "none" &&
    symptoms.stressLevel === "skip"
  ) {
    discrepancies.push({
      area: "texture",
      cameraReading: `Skin texture irregularity: ${Math.round(metrics.texture * 100)}%`,
      userReported: "No discomfort, stress level skipped",
      message:
        "The photo shows some texture changes on your skin — roughness, dryness, or unevenness. " +
        "If it doesn't bother you, that's fine! But texture changes can sometimes be early signs " +
        "of dryness or irritation, so a basic moisturizer wouldn't hurt.",
      severity: "info",
    });
  }

  // ---- Build summary ----
  const aligned = discrepancies.length === 0;
  let summary: string;

  if (aligned) {
    summary =
      "Your answers and your photo tell a similar story — that's helpful for getting accurate guidance.";
  } else if (discrepancies.some((d) => d.severity === "important")) {
    summary =
      "We noticed a few things in your photo that don't quite match what you described. " +
      "That's not unusual — it's hard to judge your own skin. Here's what the camera picked up:";
  } else {
    summary =
      "Your photo and answers mostly line up, but we spotted a couple of small differences. " +
      "Nothing to worry about — just extra context:";
  }

  return { aligned, discrepancies, summary };
}
