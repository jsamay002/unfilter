"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { OnboardingGate } from "@/components/OnboardingGate";
import { OnDeviceBadge } from "@/components/OnDeviceBadge";
import {
  usePerceptionResetStore,
  DAY_MISSIONS,
  type DayNumber,
} from "@/core/perception-reset";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconEye,
  IconSearch,
  IconStar,
  IconHeart,
  IconShield,
  IconSparkle,
  IconCamera,
} from "@/components/icons";

/* ================================================================
   INTERACTIVE DAY CONTENT COMPONENTS
   Each day has unique educational content and exercises.
   ================================================================ */

// ─── Day 1: Spot the Edit ─────────────────────────────────────
function Day1SpotTheEdit() {
  const [revealedEdits, setRevealedEdits] = useState<Set<number>>(new Set());
  const [selectedScenario, setSelectedScenario] = useState(0);

  const scenarios = [
    {
      title: "Skin Smoothing",
      description: "The most common edit — software blurs out pores, texture, and fine lines to create impossibly smooth skin.",
      beforeLabel: "Real skin with natural texture",
      afterLabel: "Digitally smoothed — all texture erased",
      signs: [
        "Loss of visible pores across the entire face",
        "Skin looks like plastic or wax — no natural texture",
        "Edges of facial features look unnaturally soft",
        "Color appears flat and uniform with no variation",
      ],
      visual: {
        before: { blur: 0, saturate: 100, contrast: 100 },
        after: { blur: 3, saturate: 90, contrast: 85 },
      },
    },
    {
      title: "Face Reshaping",
      description: "Subtle warping tools slim the jaw, enlarge eyes, narrow the nose, and reshape bone structure — things impossible without surgery.",
      beforeLabel: "Natural facial proportions",
      afterLabel: "Digitally reshaped features",
      signs: [
        "Warped or wavy lines in the background near the face",
        "Eyes appear unnaturally large relative to the face",
        "Jawline looks impossibly sharp and symmetrical",
        "Doorframes, tiles, or patterns curve near the body",
      ],
      visual: {
        before: { scaleX: 100, scaleY: 100 },
        after: { scaleX: 92, scaleY: 105 },
      },
    },
    {
      title: "Color Grading",
      description: "Shifting colors makes skin appear more golden, even-toned, and 'glowing' — hiding redness, dark circles, and natural variation.",
      beforeLabel: "Natural skin tone and variation",
      afterLabel: "Color-graded for 'perfect' tone",
      signs: [
        "Skin has an unnatural golden or peachy glow everywhere",
        "No redness around the nose, chin, or cheeks",
        "Dark circles completely gone (everyone has some)",
        "All skin areas are exactly the same warmth and tone",
      ],
      visual: {
        before: { hue: 0, brightness: 100, saturate: 100 },
        after: { hue: 15, brightness: 110, saturate: 120 },
      },
    },
  ];

  const current = scenarios[selectedScenario];

  const toggleReveal = (index: number) => {
    setRevealedEdits((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="card-gradient-sage rounded-[var(--radius-lg)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconEye size={18} className="text-[var(--accent)]" />
          <h3 className="text-title text-[16px] text-[var(--text-primary)]">Key Insights</h3>
        </div>
        <ul className="space-y-3">
          {[
            "Over 90% of photos you see on social media have been edited in some way.",
            "Professional editing tools can change bone structure, skin texture, and lighting in seconds.",
            "Once you learn to spot edits, you develop a superpower: seeing reality clearly.",
          ].map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white text-[10px] font-bold">
                {i + 1}
              </span>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Scenario Tabs */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
          Choose an edit type to explore
        </p>
        <div className="flex gap-2 mb-4">
          {scenarios.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedScenario(i);
                setRevealedEdits(new Set());
              }}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                i === selectedScenario
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--warm-300)]"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Before / After Visual Demo */}
      <div className="card rounded-[var(--radius-lg)] p-6">
        <h3 className="text-title text-[16px] text-[var(--text-primary)] mb-2">
          {current.title}
        </h3>
        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-5">
          {current.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Before */}
          <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-light)]">
            <div
              className="h-40 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--warm-200) 0%, var(--warm-300) 100%)",
              }}
            >
              <div className="w-20 h-20 rounded-full bg-[var(--warm-400)] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full" style={{
                  background: "radial-gradient(circle at 40% 35%, #e8c9a8 0%, #d4a574 40%, #c49060 70%, #b87d50 100%)",
                  boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.1), inset -1px -1px 3px rgba(255,255,255,0.2)",
                }} />
              </div>
            </div>
            <div className="px-3 py-2 bg-[var(--bg-card)]">
              <p className="text-[11px] font-semibold text-[var(--accent)]">BEFORE</p>
              <p className="text-[12px] text-[var(--text-tertiary)]">{current.beforeLabel}</p>
            </div>
          </div>

          {/* After */}
          <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--coral)] border-opacity-30">
            <div
              className="h-40 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--coral-light) 0%, var(--warm-200) 100%)",
              }}
            >
              <div className="w-20 h-20 rounded-full bg-[var(--warm-300)] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full" style={{
                  background: "radial-gradient(circle at 40% 35%, #f2dcc8 0%, #e8c9a8 40%, #e0b890 70%, #d4a574 100%)",
                  filter: "blur(1px) saturate(0.85)",
                  boxShadow: "inset 0 0 8px rgba(255,255,255,0.3)",
                }} />
              </div>
            </div>
            <div className="px-3 py-2 bg-[var(--bg-card)]">
              <p className="text-[11px] font-semibold text-[var(--coral)]">AFTER EDITING</p>
              <p className="text-[12px] text-[var(--text-tertiary)]">{current.afterLabel}</p>
            </div>
          </div>
        </div>

        {/* Signs to Spot */}
        <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <IconSearch size={14} className="text-[var(--accent)]" />
          How to spot it — tap to reveal
        </h4>
        <div className="space-y-2">
          {current.signs.map((sign, i) => (
            <button
              key={i}
              onClick={() => toggleReveal(i)}
              className={`w-full text-left px-4 py-3 rounded-[var(--radius-sm)] border transition-all ${
                revealedEdits.has(i)
                  ? "bg-[var(--accent-lighter)] border-[var(--accent-light)]"
                  : "bg-[var(--bg-secondary)] border-[var(--border-light)] hover:border-[var(--border-hover)]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                  revealedEdits.has(i)
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--warm-300)] text-[var(--text-muted)]"
                }`}>
                  {revealedEdits.has(i) ? <IconCheck size={10} /> : i + 1}
                </span>
                <p className={`text-[13px] leading-relaxed transition-colors ${
                  revealedEdits.has(i)
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
                }`}>
                  {revealedEdits.has(i) ? sign : "Tap to reveal this sign..."}
                </p>
              </div>
            </button>
          ))}
        </div>

        {revealedEdits.size === current.signs.length && (
          <div className="mt-4 p-4 rounded-[var(--radius-sm)] bg-[var(--accent-lighter)] border border-[var(--accent-light)]">
            <p className="text-[13px] font-semibold text-[var(--accent)] mb-1">
              All signs revealed!
            </p>
            <p className="text-[12px] text-[var(--text-secondary)]">
              You now know how to spot {current.title.toLowerCase()}. Try looking for these signs next time you scroll through photos online.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Day 2: The Filter Effect ─────────────────────────────────
function Day2FilterEffect() {
  const [filterLevel, setFilterLevel] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [reflectionDone, setReflectionDone] = useState(false);

  const filters = [
    {
      name: "Beauty Mode",
      description: "The standard 'beauty filter' found in almost every camera app. It smooths skin, brightens eyes, slims the face, and adds a warm glow — all automatically.",
      levels: [
        { label: "Off", skin: "Natural pores and texture visible. Slight redness around nose. Under-eye shadows present.", css: "" },
        { label: "Light", skin: "Slight smoothing. Most texture remains but minor imperfections softened.", css: "brightness(1.05) saturate(0.95)" },
        { label: "Medium", skin: "Noticeable smoothing. Pores disappearing. Skin tone evening out unnaturally.", css: "brightness(1.1) saturate(0.9) blur(0.5px)" },
        { label: "Heavy", skin: "Full smooth. Skin looks like porcelain. No pores, no texture, no natural variation.", css: "brightness(1.15) saturate(0.85) blur(1.5px) contrast(0.9)" },
      ],
    },
    {
      name: "Golden Hour",
      description: "Simulates warm sunset lighting to make skin appear sun-kissed and glowing. Hides redness and creates a 'healthy glow' that has nothing to do with skin health.",
      levels: [
        { label: "Off", skin: "Natural coloring. Pink tones in cheeks, slight unevenness — completely normal.", css: "" },
        { label: "Warm", skin: "Gentle warmth added. Redness slightly masked by golden overlay.", css: "sepia(0.15) brightness(1.05)" },
        { label: "Golden", skin: "Heavy golden cast. All redness hidden. Skin looks uniformly sun-kissed.", css: "sepia(0.3) brightness(1.1) saturate(1.15)" },
        { label: "Sunset", skin: "Full golden overlay. Features flattened. Skin color completely altered.", css: "sepia(0.5) brightness(1.15) saturate(1.3) contrast(0.9)" },
      ],
    },
    {
      name: "Porcelain",
      description: "Lightens skin tone and removes all color variation. Creates a uniform, pale complexion that erases natural melanin distribution and skin character.",
      levels: [
        { label: "Off", skin: "Natural skin tone with variation. Freckles, moles, and color differences visible.", css: "" },
        { label: "Light", skin: "Slight brightening. Some natural variation still shows through.", css: "brightness(1.1) saturate(0.85)" },
        { label: "Medium", skin: "Significant lightening. Freckles fading. Color variation being erased.", css: "brightness(1.2) saturate(0.7) contrast(0.9)" },
        { label: "Heavy", skin: "Full porcelain effect. All natural coloring removed. Skin looks artificial.", css: "brightness(1.3) saturate(0.5) contrast(0.85) blur(0.5px)" },
      ],
    },
  ];

  const current = filters[selectedFilter];
  const currentLevel = current.levels[filterLevel];

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="card-gradient-sage rounded-[var(--radius-lg)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconCamera size={18} className="text-[var(--accent)]" />
          <h3 className="text-title text-[16px] text-[var(--text-primary)]">Key Insights</h3>
        </div>
        <ul className="space-y-3">
          {[
            "Filters are designed to be invisible — the best ones make you think you just look 'better' without realizing what changed.",
            "Using beauty filters regularly rewires your expectations of what normal skin looks like.",
            "The average social media user sees 5,000+ filtered images per week, creating a distorted baseline for 'normal'.",
          ].map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white text-[10px] font-bold">
                {i + 1}
              </span>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Filter Selector */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
          Choose a filter to explore
        </p>
        <div className="flex gap-2 mb-4">
          {filters.map((f, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedFilter(i);
                setFilterLevel(0);
              }}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                i === selectedFilter
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--warm-300)]"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Demo */}
      <div className="card rounded-[var(--radius-lg)] p-6">
        <h3 className="text-title text-[16px] text-[var(--text-primary)] mb-2">
          {current.name}
        </h3>
        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-5">
          {current.description}
        </p>

        {/* Visual representation */}
        <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-light)] mb-5">
          <div
            className="h-48 flex items-center justify-center transition-all duration-500"
            style={{
              background: "linear-gradient(135deg, var(--warm-200) 0%, var(--warm-300) 100%)",
            }}
          >
            <div className="text-center">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-3 transition-all duration-500"
                style={{
                  background: "radial-gradient(circle at 40% 35%, #e8c9a8 0%, #d4a574 40%, #c49060 70%, #b87d50 100%)",
                  filter: currentLevel.css || "none",
                  boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.1), inset -1px -1px 3px rgba(255,255,255,0.2)",
                }}
              />
              <p className="text-[12px] font-semibold text-[var(--text-primary)]">
                {currentLevel.label === "Off" ? "No filter applied" : `${current.name}: ${currentLevel.label}`}
              </p>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            {current.levels.map((level, i) => (
              <span
                key={i}
                className={`text-[11px] font-medium ${
                  i === filterLevel ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                }`}
              >
                {level.label}
              </span>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={current.levels.length - 1}
            value={filterLevel}
            onChange={(e) => setFilterLevel(parseInt(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>

        {/* Description of what changed */}
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-light)]">
          <p className="text-[12px] font-semibold text-[var(--text-primary)] mb-1">
            What you are seeing
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            {currentLevel.skin}
          </p>
        </div>
      </div>

      {/* Reflection */}
      <div className="card rounded-[var(--radius-lg)] p-6">
        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mb-3">
          Pause and reflect
        </h4>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4">
          Think about this: at the heaviest filter level, the skin looks nothing like real human skin. Yet we scroll past hundreds of these images daily and accept them as normal. That is how filters reshape our expectations.
        </p>
        <button
          onClick={() => setReflectionDone(true)}
          className={`w-full py-3 rounded-[var(--radius-sm)] text-[14px] font-medium transition-all ${
            reflectionDone
              ? "bg-[var(--accent-lighter)] text-[var(--accent)] border border-[var(--accent-light)]"
              : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--warm-300)]"
          }`}
        >
          {reflectionDone ? (
            <span className="flex items-center justify-center gap-2">
              <IconCheck size={14} /> I understand how filters distort perception
            </span>
          ) : (
            "I took a moment to reflect on this"
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Day 3: Lighting Truth ────────────────────────────────────
function Day3LightingTruth() {
  const [selectedLighting, setSelectedLighting] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const lightingScenarios = [
    {
      name: "Ring Light (Front)",
      icon: "front",
      description: "The flattering favorite of influencers. Front-facing ring lights eliminate shadows, reduce visible texture, and create a halo effect in the eyes.",
      effect: "Skin appears smooth and flawless. Pores nearly invisible. No shadows under eyes or around nose. This is the 'Instagram standard' but it's not how anyone looks in real life.",
      css: "brightness(1.15) contrast(0.88) saturate(0.95)",
      bg: "linear-gradient(180deg, #fff8f0 0%, #f0e8d8 100%)",
    },
    {
      name: "Overhead Fluorescent",
      icon: "overhead",
      description: "Harsh overhead lights (like in bathrooms and changing rooms) cast unflattering shadows downward and emphasize every bump and texture.",
      effect: "Dark shadows under eyes, nose, and chin. Texture appears exaggerated. Skin looks uneven and tired. This lighting makes everyone look worse — it is not what you actually look like.",
      css: "brightness(0.95) contrast(1.2) saturate(0.85)",
      bg: "linear-gradient(180deg, #e8e8f0 0%, #d0d0d8 100%)",
    },
    {
      name: "Natural Window Light",
      icon: "natural",
      description: "Soft, indirect daylight from a window. The most accurate representation of what your skin really looks like.",
      effect: "Natural shadows and highlights. Some texture visible but soft. Colors are accurate. This is the closest to what others see when they look at you in person.",
      css: "brightness(1.05) contrast(1.02) saturate(1.0)",
      bg: "linear-gradient(135deg, #faf8f4 0%, #f0ebe3 100%)",
    },
    {
      name: "Dim / Low Light",
      icon: "dim",
      description: "Low lighting (evening, candles, dim rooms) hides almost everything but can add noise and unflattering color casts from camera compensation.",
      effect: "Most skin detail hidden by darkness. Camera compensates by adding grain/noise and shifting colors. Skin may appear yellow or orange. Neither flattering nor accurate.",
      css: "brightness(0.7) contrast(1.1) saturate(0.75)",
      bg: "linear-gradient(180deg, #d8d0c8 0%, #a89888 100%)",
    },
  ];

  const current = lightingScenarios[selectedLighting];

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="card-gradient-sage rounded-[var(--radius-lg)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconSparkle size={18} className="text-[var(--accent)]" />
          <h3 className="text-title text-[16px] text-[var(--text-primary)]">Key Insights</h3>
        </div>
        <ul className="space-y-3">
          {[
            "Lighting alone can make the same skin look flawless or 'terrible' — without changing a single thing about the skin itself.",
            "Influencers invest heavily in ring lights and studio setups. The 'effortless' selfie often has $500+ of lighting behind it.",
            "Bathroom and fitting room lights are designed for visibility, not flattery. They make everyone look worse — that is not your real face.",
          ].map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white text-[10px] font-bold">
                {i + 1}
              </span>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Lighting Selector */}
      <div className="card rounded-[var(--radius-lg)] p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-4">
          Same skin, different lighting
        </p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {lightingScenarios.map((s, i) => (
            <button
              key={i}
              onClick={() => setSelectedLighting(i)}
              className={`px-4 py-3 rounded-[var(--radius-sm)] text-[13px] font-medium text-left transition-all ${
                i === selectedLighting
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--warm-300)]"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Visual */}
        <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-light)] mb-5">
          <div
            className="h-48 flex items-center justify-center transition-all duration-700"
            style={{ background: current.bg }}
          >
            <div
              className="w-24 h-24 rounded-full transition-all duration-700"
              style={{
                background: "radial-gradient(circle at 40% 35%, #e8c9a8 0%, #d4a574 40%, #c49060 70%, #b87d50 100%)",
                filter: current.css,
                boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.1), inset -1px -1px 3px rgba(255,255,255,0.2)",
              }}
            />
          </div>
        </div>

        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mb-2">
          {current.name}
        </h4>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">
          {current.description}
        </p>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)]">
          <p className="text-[12px] font-semibold text-[var(--text-primary)] mb-1">What happens to skin</p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{current.effect}</p>
        </div>
      </div>

      {/* Quick Quiz */}
      <div className="card rounded-[var(--radius-lg)] p-6">
        <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mb-3">
          Quick check
        </h4>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4">
          You see a selfie where someone's skin looks completely smooth with no visible pores. What is the most likely explanation?
        </p>
        <div className="space-y-2">
          {[
            { text: "They have naturally perfect skin", correct: false },
            { text: "Ring light + beauty filter combination", correct: true },
            { text: "Expensive skincare routine", correct: false },
          ].map((option, i) => (
            <button
              key={i}
              onClick={() => setQuizAnswer(i)}
              className={`w-full text-left px-4 py-3 rounded-[var(--radius-sm)] border text-[13px] transition-all ${
                quizAnswer === null
                  ? "bg-[var(--bg-card)] border-[var(--border-light)] hover:border-[var(--border-hover)] text-[var(--text-secondary)]"
                  : quizAnswer === i
                    ? option.correct
                      ? "bg-[var(--accent-lighter)] border-[var(--accent-light)] text-[var(--accent)]"
                      : "bg-[var(--coral-light)] border-[var(--coral)] border-opacity-30 text-[var(--coral)]"
                    : option.correct && quizAnswer !== null
                      ? "bg-[var(--accent-lighter)] border-[var(--accent-light)] text-[var(--accent)]"
                      : "bg-[var(--bg-card)] border-[var(--border-light)] text-[var(--text-muted)]"
              }`}
            >
              <span className="flex items-center gap-2">
                {quizAnswer !== null && option.correct && <IconCheck size={14} />}
                {option.text}
              </span>
            </button>
          ))}
        </div>
        {quizAnswer !== null && (
          <div className="mt-4 p-4 rounded-[var(--radius-sm)] bg-[var(--accent-lighter)] border border-[var(--accent-light)]">
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-[var(--accent)]">Correct answer: Ring light + beauty filter.</strong>{" "}
              No skincare routine can erase pores — they are a normal part of human skin. When you see poreless skin, it is always lighting, filters, or editing at work.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Day 4: Angle Academy ─────────────────────────────────────
function Day4AngleAcademy() {
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [revealedFacts, setRevealedFacts] = useState<Set<number>>(new Set());

  const angles = [
    {
      name: "Slightly Above",
      description: "Camera held slightly above eye level, tilted down. The most common 'flattering' selfie angle.",
      effects: [
        "Eyes appear larger due to looking up toward the camera",
        "Jawline appears slimmer and more defined from the downward perspective",
        "Forehead appears smaller, chin recedes",
        "Creates the illusion of a V-shaped face",
      ],
      distortion: "This angle works because of perspective distortion — objects closer to the camera appear larger. Your eyes (closer) look bigger; your jaw (farther) looks smaller. It is an optical illusion, not how you look.",
      transform: "perspective(500px) rotateX(10deg) scale(0.95)",
    },
    {
      name: "Straight On",
      description: "Camera at exact eye level, directly facing you. The most neutral and accurate angle.",
      effects: [
        "Proportions appear closest to how others see you in person",
        "No exaggeration or minimization of any features",
        "Both sides of face equally visible — slight natural asymmetry shows",
        "This is the 'real' you — and it looks perfectly fine",
      ],
      distortion: "Most people feel this angle is 'unflattering' only because they are used to seeing themselves from edited angles. In reality, this is the most honest view.",
      transform: "none",
    },
    {
      name: "Below (Looking Up)",
      description: "Camera held below chin level, looking up. Common in video calls and accidental photos.",
      effects: [
        "Jaw appears wider and more prominent",
        "Nostrils and under-chin area emphasized",
        "Eyes appear smaller relative to the lower face",
        "Creates the impression of a rounder, heavier face",
      ],
      distortion: "Universally unflattering for everyone — even professional models avoid this angle. If you've ever felt you looked bad on a video call, this angle (laptop cameras look up at you) is almost always the reason.",
      transform: "perspective(500px) rotateX(-10deg) scale(1.05)",
    },
    {
      name: "Side Profile (3/4)",
      description: "Camera positioned at about 45 degrees to one side. The classic portrait angle.",
      effects: [
        "Nose appears more or less prominent depending on the side",
        "One eye is significantly closer to camera and appears larger",
        "Face shape changes dramatically compared to straight-on",
        "Can add or remove the appearance of depth in cheekbones",
      ],
      distortion: "Portrait photographers choose this angle for a reason — it creates the most dramatic reshaping of features without any digital editing. The face hasn't changed; only the viewpoint has.",
      transform: "perspective(500px) rotateY(20deg)",
    },
  ];

  const current = angles[selectedAngle];

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="card-gradient-warm rounded-[var(--radius-lg)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconCamera size={18} className="text-[var(--amber)]" />
          <h3 className="text-title text-[16px] text-[var(--text-primary)]">Key Insights</h3>
        </div>
        <ul className="space-y-3">
          {[
            "A phone camera at arm's length has a wide-angle lens that distorts features — making noses look 30% larger and faces appear wider than in real life.",
            "Professional photographers use specific angles, lenses, and distances to make anyone look 'better.' It is a technical skill, not natural beauty.",
            "The reason you look 'different' in selfies vs. the mirror is lens distortion — mirrors show you more accurately than front-facing cameras.",
          ].map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--amber)] text-white text-[10px] font-bold">
                {i + 1}
              </span>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Angle Selector */}
      <div className="card rounded-[var(--radius-lg)] p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-4">
          Same face, different angles
        </p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {angles.map((a, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedAngle(i);
                setRevealedFacts(new Set());
              }}
              className={`px-4 py-3 rounded-[var(--radius-sm)] text-[13px] font-medium text-left transition-all ${
                i === selectedAngle
                  ? "bg-[var(--amber)] text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--warm-300)]"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>

        {/* Visual Demo */}
        <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-light)] mb-5">
          <div
            className="h-48 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--warm-100) 0%, var(--warm-200) 100%)" }}
          >
            <div
              className="transition-all duration-700 ease-out"
              style={{ transform: current.transform }}
            >
              <div
                className="w-20 h-24 rounded-[40%] mx-auto"
                style={{
                  background: "radial-gradient(ellipse at 45% 40%, #e8c9a8 0%, #d4a574 50%, #c49060 100%)",
                  boxShadow: "inset 2px 2px 6px rgba(0,0,0,0.12), inset -1px -1px 4px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
            </div>
          </div>
          <div className="px-4 py-2 bg-[var(--bg-card)] text-center">
            <p className="text-[12px] font-semibold text-[var(--text-primary)]">{current.name}</p>
          </div>
        </div>

        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-4">
          {current.description}
        </p>

        {/* Effects */}
        <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-3">
          What this angle does to features
        </h4>
        <div className="space-y-2 mb-4">
          {current.effects.map((effect, i) => (
            <button
              key={i}
              onClick={() => {
                setRevealedFacts((prev) => {
                  const next = new Set(prev);
                  next.add(i);
                  return next;
                });
              }}
              className={`w-full text-left px-4 py-3 rounded-[var(--radius-sm)] border transition-all ${
                revealedFacts.has(i)
                  ? "bg-[var(--gold-light)] border-[var(--warm-300)]"
                  : "bg-[var(--bg-secondary)] border-[var(--border-light)] hover:border-[var(--border-hover)]"
              }`}
            >
              <p className={`text-[13px] leading-relaxed ${
                revealedFacts.has(i) ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              }`}>
                {revealedFacts.has(i) ? effect : "Tap to reveal..."}
              </p>
            </button>
          ))}
        </div>

        {/* Key takeaway */}
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-light)]">
          <p className="text-[12px] font-semibold text-[var(--amber)] mb-1">The real takeaway</p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            {current.distortion}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Day 5: Social Media Audit ────────────────────────────────
function Day5SocialMediaAudit() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [showInsight, setShowInsight] = useState<Record<number, boolean>>({});

  const prompts = [
    {
      question: "Think about the last 10 accounts you engaged with. How many of them consistently show 'perfect' skin?",
      placeholder: "Take a moment to scroll through your recent activity and count...",
      insight: "Research shows that the more 'perfect' appearance content you engage with, the lower your self-esteem about your own skin becomes. This is not weakness — it is how human brains work. We compare automatically.",
    },
    {
      question: "When you see someone with flawless skin on social media, what is your first reaction? Do you think about what edits might have been used?",
      placeholder: "Be honest with yourself — there are no wrong answers here...",
      insight: "Most people's first reaction is comparison ('I wish my skin looked like that') rather than skepticism ('that's probably edited'). After this week, your first reaction will start to shift toward the latter.",
    },
    {
      question: "Have you ever felt worse about your skin after spending time on social media? What was the trigger?",
      placeholder: "Think about a specific moment when scrolling affected how you felt...",
      insight: "This feeling has a name: 'appearance-related social comparison.' Studies show even 10 minutes of scrolling through appearance-focused content can lower body satisfaction. Knowing the trigger is the first step to managing it.",
    },
    {
      question: "Name three accounts you follow that make you feel good about yourself — not because they show 'perfect' skin, but because they feel genuine and real.",
      placeholder: "These might be friends, creators who show unfiltered content, or accounts focused on things other than appearance...",
      insight: "Curating your feed is one of the most powerful things you can do for your self-image. Following more accounts that show reality — including unfiltered skin, real conversations, and non-appearance content — gradually resets your perception of 'normal.'",
    },
  ];

  const current = prompts[currentPrompt];
  const responseCount = Object.keys(responses).filter((k) => responses[parseInt(k)]?.trim().length > 0).length;

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="card-gradient-coral rounded-[var(--radius-lg)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconSearch size={18} className="text-[var(--coral)]" />
          <h3 className="text-title text-[16px] text-[var(--text-primary)]">Key Insights</h3>
        </div>
        <ul className="space-y-3">
          {[
            "Your social media feed is a highlight reel curated by algorithms that prioritize engagement — not accuracy or mental health.",
            "The average teen spends 3+ hours daily on social media, consuming thousands of edited images that become their baseline for 'normal.'",
            "Unfollowing or muting accounts that trigger negative self-comparison is not petty — it is self-care backed by psychology research.",
          ].map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--coral)] text-white text-[10px] font-bold">
                {i + 1}
              </span>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Prompt Navigation */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          Reflection {currentPrompt + 1} of {prompts.length}
        </p>
        <p className="text-[12px] text-[var(--text-muted)]">
          {responseCount} / {prompts.length} answered
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-4">
        {prompts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPrompt(i)}
            className={`h-2 rounded-full transition-all ${
              i === currentPrompt
                ? "w-8 bg-[var(--coral)]"
                : responses[i]?.trim()
                  ? "w-2 bg-[var(--accent)]"
                  : "w-2 bg-[var(--warm-300)]"
            }`}
          />
        ))}
      </div>

      {/* Current Prompt */}
      <div className="card rounded-[var(--radius-lg)] p-6">
        <p className="text-[15px] font-semibold text-[var(--text-primary)] leading-relaxed mb-4">
          {current.question}
        </p>

        <textarea
          value={responses[currentPrompt] || ""}
          onChange={(e) =>
            setResponses((prev) => ({ ...prev, [currentPrompt]: e.target.value }))
          }
          placeholder={current.placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] leading-relaxed resize-none focus:outline-none focus:border-[var(--accent)] transition-colors"
        />

        {responses[currentPrompt]?.trim() && !showInsight[currentPrompt] && (
          <button
            onClick={() => setShowInsight((prev) => ({ ...prev, [currentPrompt]: true }))}
            className="mt-3 w-full py-3 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--warm-300)] transition-all"
          >
            Show insight for this question
          </button>
        )}

        {showInsight[currentPrompt] && (
          <div className="mt-3 p-4 rounded-[var(--radius-sm)] bg-[var(--accent-lighter)] border border-[var(--accent-light)] animate-fade-up">
            <p className="text-[12px] font-semibold text-[var(--accent)] mb-1">Research insight</p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              {current.insight}
            </p>
          </div>
        )}

        {/* Navigation between prompts */}
        <div className="flex justify-between mt-5">
          <button
            onClick={() => setCurrentPrompt((p) => Math.max(0, p - 1))}
            disabled={currentPrompt === 0}
            className="flex items-center gap-1 text-[13px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <IconArrowLeft size={14} /> Previous
          </button>
          <button
            onClick={() => setCurrentPrompt((p) => Math.min(prompts.length - 1, p + 1))}
            disabled={currentPrompt === prompts.length - 1}
            className="flex items-center gap-1 text-[13px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next <IconArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Action Items */}
      {responseCount >= 3 && (
        <div className="card rounded-[var(--radius-lg)] p-6 animate-fade-up">
          <h4 className="text-[14px] font-semibold text-[var(--text-primary)] mb-3">
            Your action steps
          </h4>
          <div className="space-y-3">
            {[
              "Mute or unfollow 3 accounts that consistently make you compare your skin negatively.",
              "Follow 3 new accounts that show real, unfiltered content or focus on non-appearance topics you enjoy.",
              "Set a daily screen time limit for appearance-focused apps (even 30 minutes less makes a measurable difference).",
            ].map((action, i) => (
              <div key={i} className="flex items-start gap-3 text-[13px] text-[var(--text-secondary)] leading-relaxed">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--coral)] text-white text-[10px] font-bold">
                  {i + 1}
                </span>
                {action}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="flex items-center gap-2 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)]">
        <IconShield size={14} className="text-[var(--accent)] shrink-0" />
        <p className="text-[11px] text-[var(--text-muted)]">
          Your reflections are stored only on this device. They are never uploaded or shared.
        </p>
      </div>
    </div>
  );
}

// ─── Day 6: Compliment Reframe ────────────────────────────────
function Day6ComplimentReframe() {
  const [step, setStep] = useState<"learn" | "reframe" | "build">("learn");
  const [reframeIndex, setReframeIndex] = useState(0);
  const [reframeDone, setReframeDone] = useState<Set<number>>(new Set());
  const [customAffirmations, setCustomAffirmations] = useState<string[]>([""]);
  const [selectedReframe, setSelectedReframe] = useState<Record<number, number>>({});

  const reframes = [
    {
      original: "I hate how my skin looks today.",
      options: [
        "My skin is doing its job protecting me, even on tough days.",
        "One bad skin day does not define me or my worth.",
        "I am more than what I see in the mirror right now.",
      ],
    },
    {
      original: "I wish I looked like that influencer.",
      options: [
        "That image was carefully crafted with lighting, angles, and editing. It is not real.",
        "I admire their creativity, but I do not need to look like them to be valuable.",
        "My uniqueness is not a flaw — it is what makes me, me.",
      ],
    },
    {
      original: "Everyone else has clear skin except me.",
      options: [
        "Most people edit their photos. I am comparing my reality to their highlight reel.",
        "Skin conditions are incredibly common — I am not alone in this, even if it feels that way.",
        "Clear skin is not a prerequisite for being interesting, talented, or worthy.",
      ],
    },
    {
      original: "I cannot go out looking like this.",
      options: [
        "The people who matter do not care about my skin — they care about me.",
        "No one scrutinizes my skin as closely as I do. Most people barely notice.",
        "I deserve to live fully regardless of what my skin looks like on any given day.",
      ],
    },
  ];

  const currentReframe = reframes[reframeIndex];

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="card-gradient-coral rounded-[var(--radius-lg)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconHeart size={18} className="text-[var(--coral)]" />
          <h3 className="text-title text-[16px] text-[var(--text-primary)]">Key Insights</h3>
        </div>
        <ul className="space-y-3">
          {[
            "The way you talk to yourself about your appearance physically changes your brain's stress response and self-image over time.",
            "Shifting from appearance-based self-worth to character-based self-worth is one of the strongest predictors of long-term well-being.",
            "It takes about 21 days of practice for a new thought pattern to start feeling natural. Today is the beginning.",
          ].map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--coral)] text-white text-[10px] font-bold">
                {i + 1}
              </span>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Step Tabs */}
      <div className="flex gap-2">
        {[
          { key: "learn" as const, label: "Learn" },
          { key: "reframe" as const, label: "Reframe" },
          { key: "build" as const, label: "Build" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStep(tab.key)}
            className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${
              step === tab.key
                ? "bg-[var(--coral)] text-white"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--warm-300)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Step Content */}
      {step === "learn" && (
        <div className="card rounded-[var(--radius-lg)] p-6 animate-fade-up">
          <h3 className="text-title text-[16px] text-[var(--text-primary)] mb-4">
            The science of self-talk
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)]">
              <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-2">
                Appearance-based self-talk
              </h4>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-2">
                Tying your self-worth to how you look: &ldquo;I am only worthwhile when my skin is clear.&rdquo; &ldquo;People judge me by my appearance.&rdquo;
              </p>
              <p className="text-[12px] text-[var(--coral)] font-medium">
                This creates fragile self-esteem that breaks every time you see an imperfection.
              </p>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <div className="w-8 h-px bg-[var(--border)]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">vs</span>
                <div className="w-8 h-px bg-[var(--border)]" />
              </div>
            </div>

            <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-lighter)] border border-[var(--accent-light)]">
              <h4 className="text-[13px] font-semibold text-[var(--text-primary)] mb-2">
                Character-based self-talk
              </h4>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-2">
                Valuing who you are beyond looks: &ldquo;I am creative, kind, and growing every day.&rdquo; &ldquo;My worth is not determined by my reflection.&rdquo;
              </p>
              <p className="text-[12px] text-[var(--accent)] font-medium">
                This creates resilient self-esteem that cannot be shaken by a bad skin day.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep("reframe")}
            className="mt-5 w-full py-3 rounded-[var(--radius-sm)] bg-[var(--coral)] text-white text-[14px] font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Practice reframing <IconArrowRight size={14} />
          </button>
        </div>
      )}

      {step === "reframe" && (
        <div className="card rounded-[var(--radius-lg)] p-6 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title text-[16px] text-[var(--text-primary)]">Reframe practice</h3>
            <span className="text-[12px] text-[var(--text-muted)]">
              {reframeIndex + 1} / {reframes.length}
            </span>
          </div>

          {/* Negative thought */}
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--coral-light)] border border-[var(--coral)] border-opacity-20 mb-4">
            <p className="text-[11px] font-semibold text-[var(--coral)] mb-1 uppercase tracking-wider">
              Negative thought
            </p>
            <p className="text-[15px] text-[var(--text-primary)] font-medium italic">
              &ldquo;{currentReframe.original}&rdquo;
            </p>
          </div>

          {/* Reframe options */}
          <p className="text-[12px] font-semibold text-[var(--text-muted)] mb-3 uppercase tracking-wider">
            Choose a reframe that resonates with you
          </p>
          <div className="space-y-2 mb-4">
            {currentReframe.options.map((option, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedReframe((prev) => ({ ...prev, [reframeIndex]: i }));
                  setReframeDone((prev) => {
                    const next = new Set(prev);
                    next.add(reframeIndex);
                    return next;
                  });
                }}
                className={`w-full text-left px-4 py-3 rounded-[var(--radius-sm)] border text-[13px] leading-relaxed transition-all ${
                  selectedReframe[reframeIndex] === i
                    ? "bg-[var(--accent-lighter)] border-[var(--accent-light)] text-[var(--text-primary)]"
                    : "bg-[var(--bg-card)] border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                }`}
              >
                <span className="flex items-start gap-2">
                  {selectedReframe[reframeIndex] === i && <IconCheck size={14} className="text-[var(--accent)] mt-0.5 shrink-0" />}
                  {option}
                </span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setReframeIndex((p) => Math.max(0, p - 1))}
              disabled={reframeIndex === 0}
              className="flex items-center gap-1 text-[13px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <IconArrowLeft size={14} /> Previous
            </button>
            {reframeIndex < reframes.length - 1 ? (
              <button
                onClick={() => setReframeIndex((p) => p + 1)}
                className="flex items-center gap-1 text-[13px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition"
              >
                Next <IconArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => setStep("build")}
                className="flex items-center gap-2 text-[13px] font-medium text-[var(--coral)] hover:opacity-80 transition"
              >
                Build your own <IconArrowRight size={14} />
              </button>
            )}
          </div>

          {reframeDone.size === reframes.length && (
            <div className="mt-4 p-4 rounded-[var(--radius-sm)] bg-[var(--accent-lighter)] border border-[var(--accent-light)]">
              <p className="text-[13px] text-[var(--accent)] font-semibold">
                All reframes complete! You are building a new inner dialogue.
              </p>
            </div>
          )}
        </div>
      )}

      {step === "build" && (
        <div className="card rounded-[var(--radius-lg)] p-6 animate-fade-up">
          <h3 className="text-title text-[16px] text-[var(--text-primary)] mb-2">
            Build your affirmations
          </h3>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-5">
            Write affirmations that are about who you are — your character, your strengths, your values — not about how you look. These become your armor against comparison culture.
          </p>

          <div className="space-y-3 mb-4">
            {customAffirmations.map((aff, i) => (
              <div key={i} className="flex gap-2">
                <span className="mt-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--coral)] text-white text-[10px] font-bold">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={aff}
                  onChange={(e) => {
                    const next = [...customAffirmations];
                    next[i] = e.target.value;
                    setCustomAffirmations(next);
                  }}
                  placeholder={
                    i === 0
                      ? "I am brave enough to show up as my real self."
                      : i === 1
                        ? "My worth is not measured by my reflection."
                        : "Write your own..."
                  }
                  className="flex-1 px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--coral)] transition-colors"
                />
              </div>
            ))}
          </div>

          {customAffirmations.length < 5 && (
            <button
              onClick={() => setCustomAffirmations([...customAffirmations, ""])}
              className="w-full py-2.5 rounded-[var(--radius-sm)] border border-dashed border-[var(--border)] text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-all"
            >
              + Add another affirmation
            </button>
          )}

          {customAffirmations.filter((a) => a.trim().length > 0).length >= 2 && (
            <div className="mt-5 p-4 rounded-[var(--radius-sm)] bg-[var(--accent-lighter)] border border-[var(--accent-light)]">
              <p className="text-[13px] text-[var(--accent)] font-semibold mb-1">
                Your affirmation collection is growing.
              </p>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Try reading these to yourself each morning for the next week. It will feel awkward at first — that is completely normal and means it is working.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Day 7: Graduation ────────────────────────────────────────
function Day7Graduation() {
  const { completedDays } = usePerceptionResetStore();
  const [pledgeSigned, setPledgeSigned] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const completedCount = completedDays.filter((d) => d < 7).length;

  const learnings = [
    {
      day: 1,
      title: "Spot the Edit",
      summary: "You learned to identify skin smoothing, face reshaping, and color grading in photos.",
      completed: completedDays.includes(1),
    },
    {
      day: 2,
      title: "The Filter Effect",
      summary: "You discovered how beauty filters, golden hour effects, and porcelain filters distort your perception of normal skin.",
      completed: completedDays.includes(2),
    },
    {
      day: 3,
      title: "Lighting Truth",
      summary: "You saw how the same skin looks completely different under ring lights, fluorescent, natural, and dim lighting.",
      completed: completedDays.includes(3),
    },
    {
      day: 4,
      title: "Angle Academy",
      summary: "You understood how camera angles and lens distortion physically change how features appear — without changing anything about the person.",
      completed: completedDays.includes(4),
    },
    {
      day: 5,
      title: "Social Media Audit",
      summary: "You reflected on your feed, identified triggers for negative self-comparison, and created action steps to curate a healthier feed.",
      completed: completedDays.includes(5),
    },
    {
      day: 6,
      title: "Compliment Reframe",
      summary: "You practiced reframing appearance-based negative thoughts into character-based affirmations.",
      completed: completedDays.includes(6),
    },
  ];

  const pledgeItems = [
    "I will question edited images instead of comparing myself to them.",
    "I will remember that lighting, angles, and filters are not reality.",
    "I will talk to myself with the same kindness I show my friends.",
    "I will curate my feed to support my well-being, not undermine it.",
    "I will measure my worth by who I am, not how I look.",
  ];

  return (
    <div className="space-y-6">
      {/* Celebration Banner */}
      <div className="card-gradient-sage rounded-[var(--radius-lg)] p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center">
            <IconStar size={28} className="text-white" />
          </div>
        </div>
        <h3 className="text-display text-[24px] text-[var(--text-primary)] mb-2">
          You made it.
        </h3>
        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
          You completed {completedCount} of 6 days of the Perception Reset. You now have the knowledge and tools to see through the illusion of &ldquo;perfect&rdquo; skin online.
        </p>
      </div>

      {/* Journey Review */}
      <div className="card rounded-[var(--radius-lg)] p-6">
        <h3 className="text-title text-[16px] text-[var(--text-primary)] mb-4">
          Your journey
        </h3>
        <div className="space-y-3">
          {learnings.map((l) => (
            <div
              key={l.day}
              className={`flex items-start gap-3 p-3 rounded-[var(--radius-sm)] transition-all ${
                l.completed
                  ? "bg-[var(--accent-lighter)]"
                  : "bg-[var(--bg-secondary)] opacity-60"
              }`}
            >
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                l.completed
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--warm-300)] text-[var(--text-muted)]"
              }`}>
                {l.completed ? <IconCheck size={12} /> : l.day}
              </span>
              <div>
                <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                  Day {l.day}: {l.title}
                </p>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed mt-0.5">
                  {l.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commitment Pledge */}
      <div className="card rounded-[var(--radius-lg)] p-6">
        <h3 className="text-title text-[16px] text-[var(--text-primary)] mb-2">
          Your commitment pledge
        </h3>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-5">
          Knowledge without action fades. Make these commitments to yourself — not to be perfect at them, but to keep trying.
        </p>

        <div className="space-y-3 mb-5">
          {pledgeItems.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-[var(--radius-sm)] border transition-all ${
                pledgeSigned
                  ? "bg-[var(--accent-lighter)] border-[var(--accent-light)]"
                  : "bg-[var(--bg-card)] border-[var(--border-light)]"
              }`}
            >
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                pledgeSigned
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--warm-300)] text-[var(--text-muted)]"
              }`}>
                {pledgeSigned ? <IconCheck size={10} /> : i + 1}
              </span>
              <p className={`text-[13px] leading-relaxed ${
                pledgeSigned ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
              }`}>
                {item}
              </p>
            </div>
          ))}
        </div>

        {!pledgeSigned ? (
          <button
            onClick={() => setPledgeSigned(true)}
            className="w-full py-3.5 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white text-[14px] font-semibold hover:opacity-90 transition-all"
          >
            I commit to these pledges
          </button>
        ) : (
          <div className="text-center animate-fade-up">
            <p className="text-[14px] font-semibold text-[var(--accent)] mb-1">
              Pledge signed.
            </p>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Come back to this whenever you need a reminder.
            </p>
          </div>
        )}
      </div>

      {/* Certificate */}
      {pledgeSigned && (
        <div className="animate-fade-up">
          {!showCertificate ? (
            <button
              onClick={() => setShowCertificate(true)}
              className="w-full py-4 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--accent)] text-[14px] font-medium text-[var(--accent)] hover:bg-[var(--accent-lighter)] transition-all"
            >
              Reveal your certificate of completion
            </button>
          ) : (
            <div className="card-elevated p-8 text-center animate-scale-in">
              <div className="border-2 border-[var(--accent-light)] rounded-[var(--radius-lg)] p-8">
                <div className="flex justify-center mb-3">
                  <IconShield size={32} className="text-[var(--accent)]" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--accent)] mb-2">
                  Certificate of Completion
                </p>
                <h4 className="text-display text-[22px] text-[var(--text-primary)] mb-2">
                  Perception Reset
                </h4>
                <p className="text-[13px] text-[var(--text-secondary)] mb-4">
                  7 days of learning to see through digital distortion
                </p>
                <div className="w-12 h-px bg-[var(--accent)] mx-auto mb-4" />
                <p className="text-[12px] text-[var(--text-tertiary)]">
                  Completed {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
                <p className="text-[11px] text-[var(--text-muted)] mt-6">
                  You now see what others miss. Your skin has nothing to hide.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Privacy reminder */}
      <div className="flex items-center gap-2 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)]">
        <IconShield size={14} className="text-[var(--accent)] shrink-0" />
        <p className="text-[11px] text-[var(--text-muted)]">
          Everything you did during this reset stays on your device. Zero data was sent to any server.
        </p>
      </div>
    </div>
  );
}

// ─── Day Content Renderer ─────────────────────────────────────
function DayContent({ day }: { day: DayNumber }) {
  switch (day) {
    case 1: return <Day1SpotTheEdit />;
    case 2: return <Day2FilterEffect />;
    case 3: return <Day3LightingTruth />;
    case 4: return <Day4AngleAcademy />;
    case 5: return <Day5SocialMediaAudit />;
    case 6: return <Day6ComplimentReframe />;
    case 7: return <Day7Graduation />;
    default: return null;
  }
}

/* ================================================================
   DAY MISSION LAYOUT — Shared frame for every day screen.
   ================================================================ */

export default function DayPage() {
  const params = useParams();
  const router = useRouter();
  const dayNum = parseInt(params.day as string) as DayNumber;

  const { isDayUnlocked, isDayCompleted, completeDay, currentDay, graduated } =
    usePerceptionResetStore();

  const mission = DAY_MISSIONS.find((m) => m.day === dayNum);
  if (!mission) {
    router.replace("/");
    return null;
  }

  const unlocked = isDayUnlocked(dayNum) || isDayCompleted(dayNum);
  if (!unlocked && !graduated) {
    router.replace("/");
    return null;
  }

  const completed = isDayCompleted(dayNum);

  const handleComplete = () => {
    completeDay(dayNum);
    if (dayNum < 7) {
      router.push(`/reset/day/${dayNum + 1}`);
    } else {
      router.push("/");
    }
  };

  const pillarColors = {
    simulator: { bg: "card-gradient-sage", text: "text-[var(--accent)]" },
    barrier: { bg: "card-gradient-warm", text: "text-[var(--amber)]" },
    journal: { bg: "card-gradient-coral", text: "text-[var(--coral)]" },
    graduation: { bg: "card-gradient-sage", text: "text-[var(--accent)]" },
  };

  return (
    <OnboardingGate>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <div className="max-w-2xl mx-auto px-6 py-8 md:px-12 md:py-10">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8 animate-fade-up">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition"
            >
              <IconArrowLeft size={16} />
              Back to missions
            </button>
            <OnDeviceBadge compact />
          </div>

          {/* Day header */}
          <div className="mb-8 animate-fade-up stagger-1">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-[12px] font-bold uppercase tracking-[0.08em] ${pillarColors[mission.pillar].text}`}
              >
                {mission.subtitle}
              </span>
              {completed && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded-full">
                  <IconCheck size={10} /> Done
                </span>
              )}
            </div>
            <h1 className="text-display text-[clamp(28px,4vw,40px)] text-[var(--text-primary)] mb-3">
              {mission.title}
            </h1>
            <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-lg">
              {mission.description}
            </p>
          </div>

          {/* Day-specific interactive content */}
          <div className="mb-10 animate-fade-up stagger-2">
            <DayContent day={dayNum} />
          </div>

          {/* Complete + navigate */}
          <div className="flex items-center justify-between animate-fade-up stagger-3">
            {dayNum > 1 && (
              <button
                onClick={() => router.push(`/reset/day/${dayNum - 1}`)}
                className="btn-ghost text-[14px]"
              >
                <IconArrowLeft size={16} />
                Day {dayNum - 1}
              </button>
            )}
            <div className="ml-auto">
              {!completed ? (
                <button onClick={handleComplete} className="btn-primary">
                  {dayNum === 7 ? "Complete the Reset" : "Complete & Continue"}
                  <IconArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() =>
                    dayNum < 7
                      ? router.push(`/reset/day/${dayNum + 1}`)
                      : router.push("/")
                  }
                  className="btn-secondary"
                >
                  {dayNum < 7 ? `Go to Day ${dayNum + 1}` : "Back to Home"}
                  <IconArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </OnboardingGate>
  );
}
