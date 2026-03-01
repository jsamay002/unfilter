"use client";

import { IconShield } from "@/components/icons";

/*  ================================================================
    ON-DEVICE BADGE
    Shown on every mission screen. Not a tooltip or footer —
    a persistent, visible indicator that this is local processing.
    ================================================================ */

export function OnDeviceBadge({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-light)] px-3 py-1.5">
        <IconShield size={12} className="text-[var(--accent)]" />
        <span className="text-[11px] font-semibold text-[var(--accent-dark)]">
          On-device only
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] card-gradient-sage px-4 py-3">
      <IconShield size={16} className="text-[var(--accent)]" />
      <div>
        <p className="text-[12px] font-bold text-[var(--accent-dark)]">
          On-device processing. Not saved unless you choose.
        </p>
        <p className="text-[11px] text-[var(--accent)] mt-0.5">
          Your photo never leaves this device. Zero bytes uploaded.
        </p>
      </div>
    </div>
  );
}
