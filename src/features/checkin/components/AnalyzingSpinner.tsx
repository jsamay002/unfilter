"use client";

import { IconSearch, IconShield } from "@/components/icons";

export function AnalyzingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-up">
      {/* Pulsing circle */}
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-full bg-[var(--accent-lighter)] animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <IconSearch size={24} className="text-[var(--accent)]" />
        </div>
      </div>

      <h3 className="text-heading text-[18px] text-[var(--text-primary)] mb-1">
        Analyzing your photo
      </h3>
      <p className="text-[13px] text-[var(--text-tertiary)] text-center max-w-xs leading-relaxed">
        Running on-device analysis. Your photo stays on your device and is never
        uploaded to any server.
      </p>

      {/* Progress dots */}
      <div className="mt-5 flex items-center gap-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDelay: "200ms" }} />
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" style={{ animationDelay: "400ms" }} />
      </div>

      {/* Privacy reassurance */}
      <div className="mt-6 flex items-center gap-2 rounded-full bg-[var(--accent-lighter)] border border-[var(--accent-light)] px-4 py-2">
        <IconShield size={12} className="text-[var(--accent)]" />
        <span className="text-[11px] font-medium text-[var(--accent-dark)]">100% on-device -- No cloud upload</span>
      </div>
    </div>
  );
}
