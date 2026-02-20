"use client";

import { useState, useRef, useCallback } from "react";
import type {
  CheckInStep,
  QualityReport,
  SymptomContext,
  SkinMetrics,
  SkinCategory,
  ActionPlan,
  RedFlagResult,
} from "@/features/checkin/types";
import { analyzeQuality } from "@/features/checkin/utils/qualityGate";
import { runSkinAnalysis } from "@/features/checkin/utils/inference";
import {
  detectRedFlags,
  generateCategories,
  generateActionPlan,
} from "@/features/checkin/utils/resultsEngine";
import { QualityGateCard } from "@/features/checkin/components/quality-gate/QualityGateCard";
import { SymptomForm } from "@/features/checkin/components/questions/SymptomForm";
import { ResultsCard } from "@/features/checkin/components/results/ResultsCard";
import { AnalyzingSpinner } from "@/features/checkin/components/AnalyzingSpinner";

export default function CheckInPage() {
  // Wizard state
  const [step, setStep] = useState<CheckInStep>("capture");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Pipeline data
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [metrics, setMetrics] = useState<SkinMetrics | null>(null);
  const [categories, setCategories] = useState<SkinCategory[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [redFlags, setRedFlags] = useState<RedFlagResult | null>(null);

  // ---- Step 1: Capture ----
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Load image, then run quality gate
      const img = new Image();
      img.onload = async () => {
        imgRef.current = img;
        const report = await analyzeQuality(img);
        setQualityReport(report);
        setStep("quality");
      };
      img.src = url;
    },
    []
  );

  const handleRetake = useCallback(() => {
    setPreviewUrl(null);
    setQualityReport(null);
    setStep("capture");
  }, []);

  // ---- Step 3: After questions, run analysis ----
  const handleSymptomSubmit = useCallback(
    async (symptoms: SymptomContext) => {
      if (!imgRef.current) return;
      setStep("analyzing");

      const m = await runSkinAnalysis(imgRef.current);
      setMetrics(m);

      const rf = detectRedFlags(symptoms, m);
      setRedFlags(rf);

      const cats = generateCategories(symptoms, m);
      setCategories(cats);

      const plan = generateActionPlan(cats, symptoms);
      setActionPlan(plan);

      setStep("results");
    },
    []
  );

  // ---- Save / discard ----
  const handleSave = useCallback(() => {
    // TODO: Persist to local journal (next sprint)
    alert("✅ Saved to your Skin Journal (local storage — coming next sprint)");
  }, []);

  const handleDiscard = useCallback(() => {
    // Reset everything
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setQualityReport(null);
    setMetrics(null);
    setCategories([]);
    setActionPlan(null);
    setRedFlags(null);
    setStep("capture");
  }, [previewUrl]);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Step indicator */}
      <StepBar current={step} />

      {/* ---- CAPTURE ---- */}
      {step === "capture" && (
        <div className="mt-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              New Check-in
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Take or upload a photo of the area you want guidance on. Crop
              close to the affected area — no need to include your full face.
            </p>

            {previewUrl ? (
              <div className="relative mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full rounded-xl object-cover"
                />
                <button
                  onClick={handleRetake}
                  className="absolute top-2 right-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur hover:bg-white"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 py-12 transition hover:border-slate-400 hover:bg-slate-50">
                <span className="text-3xl mb-2">📷</span>
                <span className="text-sm font-medium text-slate-600">
                  Tap to take or upload a photo
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  EXIF data is stripped · photo stays on-device
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {/* Privacy note */}
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span>🔒</span>
              <span>
                Your photo is analyzed on-device and never leaves your phone.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ---- QUALITY GATE ---- */}
      {step === "quality" && qualityReport && (
        <div className="mt-6">
          {previewUrl && (
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Your photo"
                className="w-full rounded-xl object-cover max-h-48"
              />
            </div>
          )}
          <QualityGateCard
            report={qualityReport}
            onContinue={() => setStep("questions")}
            onRetake={handleRetake}
          />
        </div>
      )}

      {/* ---- QUESTIONS ---- */}
      {step === "questions" && (
        <div className="mt-6">
          <SymptomForm
            onSubmit={handleSymptomSubmit}
            onBack={() => setStep("quality")}
          />
        </div>
      )}

      {/* ---- ANALYZING ---- */}
      {step === "analyzing" && <AnalyzingSpinner />}

      {/* ---- RESULTS ---- */}
      {step === "results" &&
        metrics &&
        actionPlan &&
        redFlags &&
        categories.length > 0 && (
          <div className="mt-6">
            <ResultsCard
              categories={categories}
              actionPlan={actionPlan}
              redFlags={redFlags}
              metrics={metrics}
              onSave={handleSave}
              onDiscard={handleDiscard}
              onNewCheckIn={handleDiscard}
            />
          </div>
        )}
    </div>
  );
}

/* ---- Step progress bar ---- */

const STEPS: { key: CheckInStep; label: string }[] = [
  { key: "capture", label: "Photo" },
  { key: "quality", label: "Quality" },
  { key: "questions", label: "Context" },
  { key: "analyzing", label: "Analysis" },
  { key: "results", label: "Results" },
];

function StepBar({ current }: { current: CheckInStep }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((s, i) => {
        const isActive = i === currentIdx;
        const isDone = i < currentIdx;
        return (
          <div key={s.key} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                isDone
                  ? "bg-slate-800"
                  : isActive
                    ? "bg-slate-500"
                    : "bg-slate-200"
              }`}
            />
            <p
              className={`mt-1 text-center text-[10px] font-medium ${
                isActive ? "text-slate-800" : "text-slate-400"
              }`}
            >
              {s.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
