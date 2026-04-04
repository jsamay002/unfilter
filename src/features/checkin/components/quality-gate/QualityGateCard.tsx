"use client";

import type { QualityReport } from "../../types";
import { IconCamera, IconCheck, IconAlertTriangle, IconShield } from "@/components/icons";

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

  const passCount = checks.filter((c) => c.pass).length;

  return (
    <div className="card-elevated p-5">
      <p className="label-evidence text-[var(--text-muted)] mb-2">Quality Gate</p>
      <h3 className="text-heading text-[18px] text-[var(--text-primary)] mb-1">
        Image Quality Check
      </h3>
      <p className="text-[13px] text-[var(--text-tertiary)] mb-4">
        Better photos lead to better guidance — here&apos;s how yours looks:
      </p>

      {/* Progress summary */}
      <div className="flex items-center gap-3 mb-4 rounded-[10px] bg-[var(--bg-secondary)] px-3 py-2">
        <div className="flex items-center gap-1.5">
          {checks.map((c, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                c.pass ? "bg-[var(--accent)]" : "bg-[var(--warm-400)]"
              }`}
            />
          ))}
        </div>
        <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
          {passCount}/{checks.length} passed
        </span>
      </div>

      <div className="space-y-3 mb-5">
        {checks.map((c) => (
          <div key={c.label} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                c.pass
                  ? "bg-[var(--accent-light)] text-[var(--accent)]"
                  : "bg-[var(--gold-light)] text-[var(--gold)]"
              }`}
            >
              {c.pass ? (
                <IconCheck size={12} />
              ) : (
                <IconAlertTriangle size={12} />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--text-primary)]">
                {c.label}
                {c.score !== undefined && (
                  <span className="ml-2 text-[11px] text-[var(--text-muted)]">
                    ({c.score})
                  </span>
                )}
              </p>
              <p className="text-[12px] text-[var(--text-tertiary)] leading-relaxed">{c.message}</p>
            </div>
          </div>
        ))}
      </div>

      {report.pass ? (
        <div className="space-y-3">
          <div className="rounded-[10px] bg-[var(--accent-lighter)] border border-[var(--accent-light)] px-4 py-2.5 flex items-center gap-2">
            <IconShield size={14} className="text-[var(--accent)] shrink-0" />
            <p className="text-[12px] font-medium text-[var(--accent-dark)]">
              Looks good. Your photo quality is sufficient for educational guidance.
            </p>
          </div>
          <button
            onClick={onContinue}
            className="btn-primary w-full"
          >
            Continue to Questions
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-[10px] bg-[var(--gold-light)] border border-[var(--gold)]/20 px-4 py-2.5 flex items-center gap-2">
            <IconAlertTriangle size={14} className="text-[var(--gold)] shrink-0" />
            <p className="text-[12px] font-medium text-[var(--gold)]">
              A retake could improve accuracy — but you can continue anyway.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onRetake}
              className="btn-primary flex-1 gap-2"
            >
              <IconCamera size={14} />
              Retake Photo
            </button>
            <button
              onClick={onContinue}
              className="btn-secondary flex-1"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
