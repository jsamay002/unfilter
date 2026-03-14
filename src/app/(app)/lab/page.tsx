"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OnboardingGate } from "@/components/OnboardingGate";
import { OnDeviceBadge } from "@/components/OnDeviceBadge";
import { IconCamera, IconShield } from "@/components/icons";

// ============================================================
// Distortion Lab — Interactive Filter Education System
//
// Demonstrates how social media beauty filters work by
// decomposing them into 4 distortion categories, each
// controlled by a single slider that maps to multiple
// internal transformations.
// ============================================================

/* ---------- Types ---------- */

type CompareMode = "slider" | "side-by-side" | "heatmap";

type DistortionState = {
  skinTexture: number;
  faceShape: number;
  lightingTone: number;
  makeup: number;
};

type CategoryKey = keyof DistortionState;

/* ---------- Presets ---------- */

const PRESETS: { id: string; label: string; state: DistortionState }[] = [
  { id: "natural", label: "Natural", state: { skinTexture: 0, faceShape: 0, lightingTone: 0, makeup: 0 } },
  { id: "subtle", label: "Subtle Retouch", state: { skinTexture: 25, faceShape: 10, lightingTone: 15, makeup: 10 } },
  { id: "beauty", label: "Beauty Filter", state: { skinTexture: 50, faceShape: 35, lightingTone: 30, makeup: 30 } },
  { id: "heavy", label: "Heavy Filter", state: { skinTexture: 80, faceShape: 60, lightingTone: 50, makeup: 55 } },
  { id: "glow", label: "Glow Filter", state: { skinTexture: 40, faceShape: 15, lightingTone: 70, makeup: 20 } },
];

/* ---------- Educational Content ---------- */

const EDUCATION: Record<CategoryKey, { title: string; icon: string; changed: string; matters: string }> = {
  skinTexture: {
    title: "Skin Texture Manipulation",
    icon: "texture",
    changed: "Smooths pores, removes blemishes, reduces fine lines and natural texture. Softens highlights to eliminate shine.",
    matters: "Real skin has pores, texture, and natural variation. When every photo is smoothed, you start believing normal skin is flawed.",
  },
  faceShape: {
    title: "Face Shape Changes",
    icon: "shape",
    changed: "Enlarges eyes, slims the face, sharpens the jawline, narrows the nose, and enhances lip fullness.",
    matters: "These changes are geometrically impossible in real life. Comparing yourself to warped proportions creates expectations no one can meet.",
  },
  lightingTone: {
    title: "Lighting & Tone",
    icon: "light",
    changed: "Increases brightness, adjusts contrast, shifts color warmth, boosts saturation, and adds highlight glow.",
    matters: "Professional lighting setup costs thousands. Filters simulate it for free — making everyday selfies look 'worse' by comparison.",
  },
  makeup: {
    title: "Makeup Simulation",
    icon: "makeup",
    changed: "Adds virtual lip tint, blush, eyeliner, contour, and an evening foundation effect.",
    matters: "Digital makeup is always perfect — no skill needed, no smudging, no cost. It creates an illusion of effortless beauty that doesn't exist.",
  },
};

const CATEGORY_ORDER: CategoryKey[] = ["skinTexture", "faceShape", "lightingTone", "makeup"];

/* ---------- Filter Computation ---------- */

function computeFilterCSS(s: DistortionState): string {
  // Skin texture: blur + contrast reduction + brightness lift
  const blur = (s.skinTexture / 100) * 2.8;
  const txContrast = 1 - (s.skinTexture / 100) * 0.12;
  const txBright = 1 + (s.skinTexture / 100) * 0.06;

  // Lighting: brightness, contrast, saturate, warmth
  const ltBright = 1 + (s.lightingTone / 100) * 0.22;
  const ltContrast = 1 - (s.lightingTone / 100) * 0.1;
  const ltSaturate = 1 + (s.lightingTone / 100) * 0.18;
  const warmth = (s.lightingTone / 100) * 0.1;

  // Makeup: slight saturation + contrast boost
  const mkSaturate = 1 + (s.makeup / 100) * 0.12;
  const mkContrast = 1 + (s.makeup / 100) * 0.04;

  const totalBright = txBright * ltBright;
  const totalContrast = txContrast * ltContrast * mkContrast;
  const totalSaturate = ltSaturate * mkSaturate;

  const parts = [
    `blur(${blur.toFixed(2)}px)`,
    `brightness(${totalBright.toFixed(3)})`,
    `contrast(${totalContrast.toFixed(3)})`,
    `saturate(${totalSaturate.toFixed(3)})`,
  ];
  if (warmth > 0.005) parts.push(`sepia(${warmth.toFixed(3)})`);

  return parts.join(" ");
}

function computeFaceTransform(faceShape: number): string {
  if (faceShape <= 0) return "none";
  const slimX = 1 - (faceShape / 100) * 0.06;
  const stretchY = 1 + (faceShape / 100) * 0.03;
  return `scaleX(${slimX.toFixed(3)}) scaleY(${stretchY.toFixed(3)})`;
}

function computeMakeupOverlay(makeup: number): number {
  return (makeup / 100) * 0.22;
}

/* ---------- Distortion Meter ---------- */

function getDistortionInfo(s: DistortionState) {
  const avg = (s.skinTexture + s.faceShape + s.lightingTone + s.makeup) / 4;
  const changes: string[] = [];
  if (s.skinTexture > 8) changes.push("Texture smoothing");
  if (s.faceShape > 8) changes.push("Face reshaping");
  if (s.lightingTone > 8) changes.push("Lighting alteration");
  if (s.makeup > 8) changes.push("Makeup overlay");

  let level: "None" | "Low" | "Moderate" | "High" = "None";
  if (avg > 55) level = "High";
  else if (avg > 25) level = "Moderate";
  else if (avg > 5) level = "Low";

  return { level, score: Math.round(avg), changes };
}

const LEVEL_COLORS = {
  None: "text-[var(--accent)]",
  Low: "text-[var(--gold)]",
  Moderate: "text-[var(--amber)]",
  High: "text-[var(--coral)]",
} as const;

/* ============================================================
   Main Page Component
   ============================================================ */

export default function DistortionLabPage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [state, setState] = useState<DistortionState>({ skinTexture: 0, faceShape: 0, lightingTone: 0, makeup: 0 });
  const [compareMode, setCompareMode] = useState<CompareMode>("side-by-side");
  const [expandedCategory, setExpandedCategory] = useState<CategoryKey | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null);

  const filterCSS = useMemo(() => computeFilterCSS(state), [state]);
  const faceTransform = useMemo(() => computeFaceTransform(state.faceShape), [state.faceShape]);
  const makeupOpacity = useMemo(() => computeMakeupOverlay(state.makeup), [state.makeup]);
  const distortion = useMemo(() => getDistortionInfo(state), [state]);
  const svgDisplaceScale = useMemo(() => (state.faceShape / 100) * 14, [state.faceShape]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }, []);

  const setSlider = useCallback((key: CategoryKey, value: number) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyPreset = useCallback((preset: DistortionState) => {
    setState(preset);
  }, []);

  // ---- Comparison slider drag ----
  const dragging = useRef(false);

  const onPointerDown = useCallback(() => { dragging.current = true; }, []);
  const onPointerUp = useCallback(() => { dragging.current = false; }, []);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSliderPos(x * 100);
  }, []);

  // ---- Heatmap rendering ----
  useEffect(() => {
    if (compareMode !== "heatmap" || !photo || !heatmapCanvasRef.current) return;
    const canvas = heatmapCanvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const w = Math.min(img.width, 600);
      const h = Math.round((img.height / img.width) * w);
      canvas.width = w;
      canvas.height = h;

      // Draw original
      ctx.filter = "none";
      ctx.drawImage(img, 0, 0, w, h);
      const original = ctx.getImageData(0, 0, w, h);

      // Draw filtered
      ctx.filter = filterCSS;
      ctx.drawImage(img, 0, 0, w, h);
      const filtered = ctx.getImageData(0, 0, w, h);

      // Compute difference heatmap
      const output = ctx.createImageData(w, h);
      for (let i = 0; i < original.data.length; i += 4) {
        const dr = Math.abs(original.data[i] - filtered.data[i]);
        const dg = Math.abs(original.data[i + 1] - filtered.data[i + 1]);
        const db = Math.abs(original.data[i + 2] - filtered.data[i + 2]);
        const diff = (dr + dg + db) / 3;
        const intensity = Math.min(255, diff * 4);

        // Blue → Yellow → Red gradient
        if (intensity < 128) {
          output.data[i] = Math.round((intensity / 128) * 255);
          output.data[i + 1] = Math.round((intensity / 128) * 200);
          output.data[i + 2] = Math.round(180 - (intensity / 128) * 180);
        } else {
          output.data[i] = 255;
          output.data[i + 1] = Math.round(200 - ((intensity - 128) / 127) * 200);
          output.data[i + 2] = 0;
        }
        output.data[i + 3] = Math.max(60, intensity);
      }

      ctx.filter = "none";
      // Draw original as base, then overlay heatmap
      ctx.drawImage(img, 0, 0, w, h);
      ctx.globalAlpha = 0.7;
      ctx.putImageData(output, 0, 0);
      ctx.globalAlpha = 1;
    };
    img.src = photo;
  }, [compareMode, photo, filterCSS]);

  const hasAnyDistortion = distortion.score > 0;

  return (
    <OnboardingGate>
      <AppShell>
        {/* Inline SVG filter for face displacement */}
        <svg className="absolute h-0 w-0" aria-hidden="true">
          <defs>
            <filter id="face-displace">
              <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3" seed="2" result="turb" />
              <feDisplacementMap in="SourceGraphic" in2="turb" scale={svgDisplaceScale} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <header className="mb-8 animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Flagship Experience
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[var(--border)] to-transparent" />
            </div>
            <h1 className="text-display text-[clamp(28px,5vw,44px)] text-[var(--text-primary)] text-center">
              Distortion Lab
            </h1>
            <p className="mt-3 mx-auto max-w-xl text-center text-[15px] leading-[1.65] text-[var(--text-tertiary)]">
              Every beauty filter is just a combination of simple distortions.
              Drag the sliders to see exactly what they change&mdash;and why it matters.
            </p>
          </header>

          <div className="mb-6 flex justify-center animate-fade-up stagger-1">
            <OnDeviceBadge />
          </div>

          {/* Main grid: Preview + Controls */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr] animate-fade-up stagger-2">

            {/* Left: Image preview area */}
            <div className="space-y-4">
              {/* Upload area or preview */}
              {!photo ? (
                <div className="card-elevated flex flex-col items-center justify-center p-10 text-center" style={{ minHeight: 400 }}>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-light)]">
                    <IconCamera size={24} className="text-[var(--accent)]" />
                  </div>
                  <p className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
                    Upload a photo to begin
                  </p>
                  <p className="text-[13px] text-[var(--text-tertiary)] mb-5 max-w-xs">
                    Your photo stays on your device. Nothing is uploaded to any server.
                  </p>
                  <label className="btn-primary cursor-pointer text-[14px] !py-3 !px-6">
                    <IconCamera size={16} />
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="sr-only"
                      onChange={handleFile}
                    />
                  </label>
                </div>
              ) : (
                <>
                  {/* Compare mode tabs */}
                  <div className="flex items-center gap-1 rounded-[10px] bg-[var(--bg-secondary)] p-1">
                    {(["side-by-side", "slider", "heatmap"] as CompareMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setCompareMode(mode)}
                        className={`flex-1 rounded-[8px] px-3 py-2 text-[12px] font-semibold transition ${
                          compareMode === mode
                            ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                        }`}
                      >
                        {mode === "side-by-side" ? "Side by Side" : mode === "slider" ? "Slider" : "Heatmap"}
                      </button>
                    ))}
                  </div>

                  {/* Preview */}
                  <div className="card-elevated overflow-hidden">
                    {compareMode === "side-by-side" && (
                      <div className="grid grid-cols-2 gap-px bg-[var(--border-light)]">
                        <div className="bg-[var(--bg-card)]">
                          <p className="px-4 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
                            Real Skin
                          </p>
                          <div className="aspect-[4/5] overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photo} alt="Original" className="h-full w-full object-cover" />
                          </div>
                        </div>
                        <div className="bg-[var(--bg-card)]">
                          <p className="px-4 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--coral)]">
                            Filtered
                          </p>
                          <div className="aspect-[4/5] overflow-hidden">
                            <div className="relative h-full w-full">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photo}
                                alt="Filtered"
                                className="h-full w-full object-cover"
                                style={{
                                  filter: `${filterCSS}${svgDisplaceScale > 0 ? " url(#face-displace)" : ""}`,
                                  transform: faceTransform,
                                }}
                              />
                              {/* Makeup overlay */}
                              {makeupOpacity > 0 && (
                                <div
                                  className="pointer-events-none absolute inset-0"
                                  style={{
                                    background: `linear-gradient(180deg, rgba(200,140,120,${makeupOpacity * 0.5}) 0%, rgba(190,100,90,${makeupOpacity}) 60%, rgba(180,70,70,${makeupOpacity * 0.8}) 100%)`,
                                    mixBlendMode: "soft-light",
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {compareMode === "slider" && (
                      <div
                        ref={sliderContainerRef}
                        className="relative aspect-[4/5] cursor-col-resize select-none overflow-hidden"
                        onPointerDown={onPointerDown}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerUp}
                        onPointerMove={onPointerMove}
                      >
                        {/* Filtered (full) */}
                        <div className="absolute inset-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo}
                            alt="Filtered"
                            className="h-full w-full object-cover"
                            style={{
                              filter: `${filterCSS}${svgDisplaceScale > 0 ? " url(#face-displace)" : ""}`,
                              transform: faceTransform,
                            }}
                          />
                          {makeupOpacity > 0 && (
                            <div
                              className="pointer-events-none absolute inset-0"
                              style={{
                                background: `linear-gradient(180deg, rgba(200,140,120,${makeupOpacity * 0.5}) 0%, rgba(190,100,90,${makeupOpacity}) 60%, rgba(180,70,70,${makeupOpacity * 0.8}) 100%)`,
                                mixBlendMode: "soft-light",
                              }}
                            />
                          )}
                        </div>

                        {/* Original (clipped) */}
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{ width: `${sliderPos}%` }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo}
                            alt="Original"
                            className="h-full object-cover"
                            style={{ width: `${sliderContainerRef.current?.offsetWidth ?? 600}px`, maxWidth: "none" }}
                          />
                        </div>

                        {/* Divider line */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-lg"
                          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
                        >
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#666" strokeWidth="1.5">
                              <path d="M4 2L1 7L4 12" />
                              <path d="M10 2L13 7L10 12" />
                            </svg>
                          </div>
                        </div>

                        {/* Labels */}
                        <span className="absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                          Real
                        </span>
                        <span className="absolute top-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                          Filtered
                        </span>
                      </div>
                    )}

                    {compareMode === "heatmap" && (
                      <div className="relative">
                        <canvas
                          ref={heatmapCanvasRef}
                          className="w-full"
                          style={{ aspectRatio: "4/5", objectFit: "cover" }}
                        />
                        {!hasAnyDistortion && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-card)]/80">
                            <p className="text-[13px] text-[var(--text-tertiary)]">
                              Move a slider to see the heatmap.
                            </p>
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-[8px] bg-black/60 px-3 py-2 backdrop-blur-sm">
                          <div className="h-2 flex-1 rounded-full" style={{ background: "linear-gradient(90deg, #335599, #ddcc44, #cc3322)" }} />
                          <div className="flex gap-3 text-[9px] font-semibold uppercase tracking-wider text-white/80">
                            <span>Low</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Change photo */}
                  <label className="btn-secondary cursor-pointer text-[12px] !py-2 !px-4 w-fit">
                    Change Photo
                    <input type="file" accept="image/*" capture="user" className="sr-only" onChange={handleFile} />
                  </label>
                </>
              )}
            </div>

            {/* Right: Controls panel */}
            <div className="space-y-4">
              {/* Presets */}
              <div className="card p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  Presets
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => {
                    const isActive =
                      state.skinTexture === p.state.skinTexture &&
                      state.faceShape === p.state.faceShape &&
                      state.lightingTone === p.state.lightingTone &&
                      state.makeup === p.state.makeup;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyPreset(p.state)}
                        className={`rounded-[8px] px-3 py-1.5 text-[12px] font-semibold transition ${
                          isActive
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--warm-300)]"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Distortion sliders */}
              <div className="card p-4">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  Distortion Controls
                </p>
                <div className="space-y-5">
                  {CATEGORY_ORDER.map((key) => {
                    const ed = EDUCATION[key];
                    const isExpanded = expandedCategory === key;
                    const value = state[key];
                    return (
                      <div key={key}>
                        <div className="mb-2 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setExpandedCategory(isExpanded ? null : key)}
                            className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition"
                          >
                            <span>{ed.title}</span>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            >
                              <path d="M3 5L6 8L9 5" />
                            </svg>
                          </button>
                          <span className="text-[13px] font-bold tabular-nums text-[var(--text-primary)]">
                            {value}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={value}
                          onChange={(e) => setSlider(key, Number(e.target.value))}
                          className="w-full accent-[var(--accent)] h-1.5 rounded-full appearance-none bg-[var(--warm-300)] cursor-pointer"
                          aria-label={ed.title}
                        />

                        {/* Educational dropdown */}
                        {isExpanded && (
                          <div className="mt-3 rounded-[10px] bg-[var(--bg-secondary)] px-4 py-3 animate-fade-up">
                            <div className="mb-2">
                              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--coral)] mb-1">
                                What changed
                              </p>
                              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
                                {ed.changed}
                              </p>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--accent)] mb-1">
                                Why this matters
                              </p>
                              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
                                {ed.matters}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Distortion Meter */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                    Distortion Meter
                  </p>
                  <span className={`text-[14px] font-bold ${LEVEL_COLORS[distortion.level]}`}>
                    {distortion.level}
                  </span>
                </div>

                {/* Meter bar */}
                <div className="mb-3 h-2 w-full rounded-full bg-[var(--warm-300)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${distortion.score}%`,
                      background:
                        distortion.score > 55
                          ? "var(--coral)"
                          : distortion.score > 25
                            ? "var(--amber)"
                            : "var(--accent)",
                    }}
                  />
                </div>

                {/* Detected changes */}
                {distortion.changes.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {distortion.changes.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-[var(--bg-secondary)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-tertiary)]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[var(--text-muted)]">
                    No distortions applied. This is what real skin looks like.
                  </p>
                )}
              </div>

              {/* Privacy note */}
              <div className="rounded-[10px] border border-[var(--accent-light)] bg-[var(--accent-lighter)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <IconShield size={14} className="text-[var(--accent)] shrink-0" />
                  <p className="text-[11px] font-medium text-[var(--accent-dark)]">
                    Your photo never leaves this device.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom educational section */}
          <section className="mt-10 mb-8 animate-fade-up stagger-3">
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mb-8" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-5">
              How filters really work
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORY_ORDER.map((key) => {
                const ed = EDUCATION[key];
                return (
                  <div key={key} className="card p-4">
                    <h3 className="text-[13px] font-semibold text-[var(--text-primary)] mb-2">
                      {ed.title}
                    </h3>
                    <p className="text-[12px] leading-relaxed text-[var(--text-tertiary)]">
                      {ed.changed}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </AppShell>
    </OnboardingGate>
  );
}
