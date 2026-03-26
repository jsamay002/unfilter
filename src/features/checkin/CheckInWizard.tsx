"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  type CrossReferenceResult,
} from "@/features/checkin/utils/resultsEngine";
import { crossReference } from "@/features/checkin/utils/crossReference";
import { QualityGateCard } from "@/features/checkin/components/quality-gate/QualityGateCard";
import { SymptomForm } from "@/features/checkin/components/questions/SymptomForm";
import { ResultsCard } from "@/features/checkin/components/results/ResultsCard";
import { AnalyzingSpinner } from "@/features/checkin/components/AnalyzingSpinner";
import { useJournalStore } from "@/features/journal/store";
import type { JournalEntry } from "@/features/journal/types";

export default function CheckInWizard() {
  const router = useRouter();
  const { addEntry } = useJournalStore();

  // Wizard state
  const [step, setStep] = useState<CheckInStep>("capture");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Pipeline data
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [metrics, setMetrics] = useState<SkinMetrics | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomContext | null>(null);
  const [categories, setCategories] = useState<SkinCategory[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [redFlags, setRedFlags] = useState<RedFlagResult | null>(null);
  const [crossRef, setCrossRef] = useState<CrossReferenceResult | null>(null);

  // ---- Step 1: Capture ----
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Also read as data URL for journal persistence
      const reader = new FileReader();
      reader.onload = () => setPhotoDataUrl(reader.result as string);
      reader.readAsDataURL(file);

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
    setPhotoDataUrl(null);
    setQualityReport(null);
    setStep("capture");
  }, []);

  // ---- Step 3: After questions, run analysis ----
  const handleSymptomSubmit = useCallback(
    async (s: SymptomContext) => {
      if (!imgRef.current) return;
      setSymptoms(s);
      setStep("analyzing");

      const m = await runSkinAnalysis(imgRef.current);
      setMetrics(m);

      const cr = crossReference(m, s);
      setCrossRef(cr);

      const rf = detectRedFlags(s, m);
      setRedFlags(rf);

      const cats = generateCategories(s, m);
      setCategories(cats);

      const plan = generateActionPlan(cats, s);
      setActionPlan(plan);

      setStep("results");
    },
    []
  );

  // ---- Save to journal ----
  const handleSave = useCallback(() => {
    if (!metrics || !symptoms || !redFlags) return;

    const entry: JournalEntry = {
      id: `checkin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      photoDataUrl,
      metrics,
      symptoms,
      categories: categories.map((c) => ({
        name: c.name,
        confidence: c.confidence,
        severity: c.severity,
      })),
      hadRedFlags: redFlags.triggered,
      escalationLevel: redFlags.escalationLevel,
      note: "",
      tags: [],
    };

    addEntry(entry);
    router.push("/journal");
  }, [metrics, symptoms, redFlags, categories, photoDataUrl, addEntry, router]);

  // ---- Discard ----
  const handleDiscard = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPhotoDataUrl(null);
    setQualityReport(null);
    setMetrics(null);
    setSymptoms(null);
    setCategories([]);
    setActionPlan(null);
    setRedFlags(null);
    setCrossRef(null);
    setStep("capture");
  }, [previewUrl]);

  return (
    <div className="mx-auto max-w-lg">
      {/* Step indicator */}
      <StepBar current={step} />

      {/* ---- CAPTURE ---- */}
      {step === "capture" && (
        <div className="mt-6 animate-fade-up">
          <div className="card p-5">
            <h2 className="text-heading text-[18px] text-[var(--text-primary)] mb-1">
              New Check-in
            </h2>
            <p className="text-[13px] text-[var(--text-tertiary)] mb-4">
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
                  className="absolute top-2 right-2 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] backdrop-blur shadow-sm hover:bg-white transition"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border-hover)] py-14 transition hover:border-[var(--accent)] hover:bg-[var(--warm-100)]">
                <span className="text-3xl mb-2">📷</span>
                <span className="text-[14px] font-medium text-[var(--text-secondary)]">
                  Tap to take or upload a photo
                </span>
                <span className="text-[12px] text-[var(--text-muted)] mt-1">
                  EXIF data is stripped · stays on your device
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

            <div className="mt-3 flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
              <span>🔒</span>
              <span>Analyzed on-device. Never uploaded anywhere.</span>
            </div>
          </div>
        </div>
      )}

      {/* ---- QUALITY GATE ---- */}
      {step === "quality" && qualityReport && (
        <div className="mt-6 animate-fade-up">
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
        <div className="mt-6 animate-fade-up">
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
          <div className="mt-6 animate-fade-up">
            <ResultsCard
              categories={categories}
              actionPlan={actionPlan}
              redFlags={redFlags}
              metrics={metrics}
              crossRef={crossRef}
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
    <div className="flex items-center gap-1.5">
      {STEPS.map((s, i) => {
        const isActive = i === currentIdx;
        const isDone = i < currentIdx;
        return (
          <div key={s.key} className="flex-1">
            <div
              className={`h-[3px] rounded-full transition-all duration-500 ${
                isDone
                  ? "bg-[var(--accent-dark)]"
                  : isActive
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--border)]"
              }`}
            />
            <p
              className={`mt-1 text-center text-[10px] font-semibold ${
                isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
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
