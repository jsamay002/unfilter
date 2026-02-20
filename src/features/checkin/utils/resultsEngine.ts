// ============================================================
// Results Engine — Educational guidance generation
// Red flag detection, category mapping, action plans
// ============================================================

import type {
  SymptomContext,
  SkinMetrics,
  RedFlagResult,
  SkinCategory,
  ActionPlan,
  CheckInResult,
} from "../types";

/**
 * Check for red flags that require escalation.
 * Conservative — errs on the side of suggesting help.
 */
export function detectRedFlags(
  symptoms: SymptomContext,
  metrics: SkinMetrics
): RedFlagResult {
  const flags: string[] = [];

  if (symptoms.fever) {
    flags.push("Fever combined with skin changes — may need medical attention");
  }
  if (symptoms.spreading && symptoms.duration !== "today") {
    flags.push("Spreading rash that has persisted — worth getting checked");
  }
  if (symptoms.itchOrPain === "pain" || symptoms.itchOrPain === "both") {
    if (symptoms.duration === "moreThanWeek") {
      flags.push("Persistent pain lasting over a week — consider seeing someone");
    }
  }
  if (metrics.redness > 0.7 && symptoms.spreading) {
    flags.push("High redness with spreading pattern — may benefit from professional evaluation");
  }

  let escalationLevel: RedFlagResult["escalationLevel"] = "none";
  if (flags.length >= 3 || symptoms.fever) {
    escalationLevel = "urgentCare";
  } else if (flags.length === 2) {
    escalationLevel = "nurse";
  } else if (flags.length === 1) {
    escalationLevel = "guardian";
  }

  const messages: Record<RedFlagResult["escalationLevel"], string> = {
    none: "",
    monitor: "Keep an eye on this and check in again in a few days.",
    guardian:
      "It might be a good idea to mention this to a parent or guardian — they can help you decide next steps.",
    nurse:
      "Consider talking to your school nurse or a trusted adult. They can take a quick look and let you know if you should see a doctor.",
    urgentCare:
      "We'd recommend having a doctor or clinic look at this soon — some of what you described could benefit from professional guidance.",
  };

  return {
    triggered: flags.length > 0,
    flags,
    escalationLevel,
    message: messages[escalationLevel],
  };
}

/**
 * Map metrics + symptoms to educational categories.
 * These are NOT diagnoses — they're "most likely educational categories"
 * to help the user learn and take gentle action.
 */
export function generateCategories(
  symptoms: SymptomContext,
  metrics: SkinMetrics
): SkinCategory[] {
  const categories: SkinCategory[] = [];

  // Acne-like pattern
  if (metrics.spotCount > 5 || (metrics.redness > 0.3 && metrics.texture > 0.4)) {
    categories.push({
      name: "Acne-like breakout",
      confidence: Math.min(0.85, 0.4 + metrics.spotCount * 0.03 + metrics.redness * 0.2),
      description:
        "Looks like it could be common breakouts — very normal for teens. Gentle cleansing and patience usually help most.",
      severity:
        metrics.spotCount > 15 || metrics.redness > 0.6 ? "medium" : "low",
    });
  }

  // Irritation / dermatitis pattern
  if (
    metrics.redness > 0.4 &&
    (symptoms.itchOrPain === "itch" || symptoms.itchOrPain === "both")
  ) {
    categories.push({
      name: "Irritation or sensitivity",
      confidence: Math.min(0.8, 0.35 + metrics.redness * 0.3),
      description:
        "Redness + itchiness can mean your skin is reacting to something — a product, weather, or stress. Simplifying your routine often helps.",
      severity: symptoms.spreading ? "medium" : "low",
    });
  }

  // Dryness / texture
  if (metrics.texture > 0.5 && metrics.uniformity < 0.4) {
    categories.push({
      name: "Dryness or texture changes",
      confidence: 0.5 + metrics.texture * 0.2,
      description:
        "Uneven texture or dry patches are super common. A basic moisturizer and avoiding harsh products can make a big difference.",
      severity: "low",
    });
  }

  // If nothing matched, give a general mild result
  if (categories.length === 0) {
    categories.push({
      name: "Mild or unclear pattern",
      confidence: 0.4,
      description:
        "Nothing stands out strongly from the photo, which is usually a good sign! Keep up a gentle routine and check in again if anything changes.",
      severity: "low",
    });
  }

  // Sort by confidence descending, cap at 3
  return categories
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}

/**
 * Generate a conservative, safe action plan.
 */
export function generateActionPlan(
  categories: SkinCategory[],
  symptoms: SymptomContext
): ActionPlan {
  const doItems = [
    "Wash with a gentle, fragrance-free cleanser (morning and night)",
    "Apply a basic moisturizer after cleansing",
    "Use SPF 30+ sunscreen during the day",
  ];

  const avoidItems = [
    "Harsh scrubs or exfoliants",
    "Layering multiple new products at once",
    "Touching or picking at the area",
  ];

  const trackItems = [
    "Take a follow-up photo in 5–7 days (same lighting)",
    "Note any new products or changes",
    "Watch for spreading, increased pain, or fever",
  ];

  const productTips = [
    "Look for 'non-comedogenic' and 'fragrance-free' on labels",
    "Introduce only ONE new product at a time",
    "Always patch-test on your inner wrist for 24 hours first",
  ];

  // Add context-specific tips
  const topCategory = categories[0]?.name ?? "";

  if (topCategory.includes("Acne")) {
    doItems.push(
      "If you want to try a spot treatment, benzoyl peroxide 2.5% is a gentle starting point"
    );
    avoidItems.push("Heavy or oily sunscreens — look for gel-based instead");
  }

  if (topCategory.includes("Irritation")) {
    doItems.push(
      "Consider applying a thin layer of plain petroleum jelly on the area at night"
    );
    avoidItems.push("Any active ingredients (acids, retinoids) until irritation calms down");
  }

  if (symptoms.stressLevel === "high") {
    doItems.push(
      "Stress can affect skin — even 5 min of deep breathing or a walk can help"
    );
  }

  return { doItems, avoidItems, trackItems, productTips };
}

/**
 * Assemble the full check-in result.
 */
export function assembleCheckIn(
  metrics: SkinMetrics,
  symptoms: SymptomContext,
  qualityReport: import("../types").QualityReport
): Omit<CheckInResult, "id" | "timestamp"> {
  const redFlags = detectRedFlags(symptoms, metrics);
  const categories = generateCategories(symptoms, metrics);
  const actionPlan = generateActionPlan(categories, symptoms);

  return {
    quality: qualityReport,
    metrics,
    symptoms,
    categories,
    redFlags,
    actionPlan,
  };
}
