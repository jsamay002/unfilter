"use client";

import type { QualityReport } from "../../types";

interface QualityGateCardProps {
  report: QualityReport;
  onContinue: () => void;
  onRetake: () => void;
}

export function QualityGateCard({
  report,
  onContinue,
  onRetake,
}: QualityGateCardProps) {
  const checks = [
    { label: "Sharpness", ...report.blur },
    { label: "Lighting", ...report.lighting },
    { label: "Glare", ...report.glare },
    { label: "Resolution", ...report.resolution, score: undefined },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        📷 Image Quality Check
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        Better photos lead to better guidance — here&apos;s how yours looks:
      </p>

      <div className="space-y-3 mb-5">
        {checks.map((c) => (
          <div key={c.label} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                c.pass
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {c.pass ? "✓" : "!"}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700">
                {c.label}
                {c.score !== undefined && (
                  <span className="ml-2 text-xs text-slate-400">
                    ({c.score})
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500">{c.message}</p>
            </div>
          </div>
        ))}
      </div>

      {report.pass ? (
        <div className="space-y-2">
          <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            Looks good! Your photo quality is sufficient for educational guidance.
          </div>
          <button
            onClick={onContinue}
            className="w-full rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Continue to Questions →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">
            A retake could improve accuracy — but you can continue anyway.
          </div>
          <div className="flex gap-2">
            <button
              onClick={onRetake}
              className="flex-1 rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              📷 Retake Photo
            </button>
            <button
              onClick={onContinue}
              className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Continue Anyway →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
