"use client";

import { type ReactNode } from "react";

/* ============================================================
   Unfilter — Shared UI Primitives
   Premium wellness aesthetic. Reusable across all screens.
   ============================================================ */

// ---- Primary CTA Button ----
export function ButtonPrimary({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center
        rounded-[14px] bg-[#3d5a3d] px-7 py-3.5
        text-[15px] font-semibold tracking-[-0.01em] text-white
        shadow-[0_2px_12px_rgba(61,90,61,0.25)]
        transition-all duration-200
        hover:bg-[#4a6b4a] hover:shadow-[0_4px_20px_rgba(61,90,61,0.3)]
        active:scale-[0.97] active:shadow-[0_1px_6px_rgba(61,90,61,0.2)]
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ---- Secondary / Ghost Button ----
export function ButtonSecondary({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        rounded-[14px] border border-[#d8d0c4] bg-transparent
        px-7 py-3 text-[14px] font-medium text-[#6b5e50]
        transition-all duration-200
        hover:bg-[#f5f1eb] hover:border-[#c4bbb0]
        active:scale-[0.97]
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ---- Text Link Button ----
export function ButtonText({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        text-[13px] font-medium text-[#8a7d6e]
        underline decoration-[#d8d0c4] underline-offset-[3px]
        transition-colors duration-150
        hover:text-[#5c5245] hover:decoration-[#b0a697]
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ---- Trust Chip (small pill badge) ----
export function TrustChip({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0ede7] px-3 py-[6px] text-[11px] font-semibold tracking-[0.02em] text-[#6b5e50] uppercase">
      <span className="text-[13px]">{icon}</span>
      {label}
    </span>
  );
}

// ---- Callout Panel ----
export function CalloutPanel({
  icon,
  children,
  variant = "sage",
}: {
  icon?: string;
  children: ReactNode;
  variant?: "sage" | "warm" | "coral";
}) {
  const styles = {
    sage: "bg-[#eef3ee] border-[#d4e0d4] text-[#3d5a3d]",
    warm: "bg-[#f7f4ef] border-[#e8e2d8] text-[#5c5245]",
    coral: "bg-[#fef5f3] border-[#f8ddd6] text-[#8b3a2a]",
  };

  return (
    <div
      className={`rounded-2xl border px-5 py-4 ${styles[variant]}`}
    >
      <div className="flex gap-3 items-start">
        {icon && <span className="text-[18px] shrink-0 mt-0.5">{icon}</span>}
        <div className="text-[13px] leading-relaxed font-medium">{children}</div>
      </div>
    </div>
  );
}

// ---- Feature Row (icon + title + desc, left-aligned) ----
export function FeatureItem({
  icon,
  title,
  desc,
  className = "",
}: {
  icon: string;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div className={`flex gap-4 items-start ${className}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0ede7] text-[18px]">
        {icon}
      </div>
      <div>
        <p className="text-[14px] font-semibold text-[#2e2a25] leading-tight">
          {title}
        </p>
        <p className="mt-0.5 text-[13px] text-[#8a7d6e] leading-snug">
          {desc}
        </p>
      </div>
    </div>
  );
}

// ---- Section Heading ----
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#b0a697] mb-3">
      {children}
    </p>
  );
}

// ---- Divider ----
export function Divider() {
  return <div className="h-px bg-gradient-to-r from-transparent via-[#e0dbd3] to-transparent my-6" />;
}
