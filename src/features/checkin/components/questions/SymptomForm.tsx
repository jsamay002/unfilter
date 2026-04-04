"use client";

import { useState } from "react";
import type { SymptomContext } from "../../types";
import { IconArrowLeft, IconArrowRight } from "@/components/icons";

interface SymptomFormProps {
  onSubmit: (data: SymptomContext) => void;
  onBack: () => void;
}

const DEFAULT: SymptomContext = {
  itchOrPain: "none",
  duration: "today",
  spreading: false,
  fever: false,
  newProducts: "",
  location: "",
  stressLevel: "skip",
};

export function SymptomForm({ onSubmit, onBack }: SymptomFormProps) {
  const [data, setData] = useState<SymptomContext>(DEFAULT);
  const set = <K extends keyof SymptomContext>(
    key: K,
    value: SymptomContext[K]
  ) => setData((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="card-elevated p-5">
      <p className="label-evidence text-[var(--text-muted)] mb-2">Context</p>
      <h3 className="text-heading text-[18px] text-[var(--text-primary)] mb-1">
        Quick Context
      </h3>
      <p className="text-[13px] text-[var(--text-tertiary)] mb-5 leading-relaxed">
        A few questions to give you better guidance. Skip anything you&apos;re
        not sure about.
      </p>

      <div className="space-y-5">
        {/* Itch / Pain */}
        <Field label="Does the area itch or hurt?">
          <Pills
            value={data.itchOrPain}
            onChange={(v) =>
              set("itchOrPain", v as SymptomContext["itchOrPain"])
            }
            options={[
              { value: "none", label: "Neither" },
              { value: "itch", label: "Itchy" },
              { value: "pain", label: "Painful" },
              { value: "both", label: "Both" },
            ]}
          />
        </Field>

        {/* Duration */}
        <Field label="How long has this been going on?">
          <Pills
            value={data.duration}
            onChange={(v) =>
              set("duration", v as SymptomContext["duration"])
            }
            options={[
              { value: "today", label: "Just today" },
              { value: "fewDays", label: "Few days" },
              { value: "week", label: "~1 week" },
              { value: "moreThanWeek", label: "1+ weeks" },
            ]}
          />
        </Field>

        {/* Spreading */}
        <Field label="Is it spreading or getting bigger?">
          <Pills
            value={data.spreading ? "yes" : "no"}
            onChange={(v) => set("spreading", v === "yes")}
            options={[
              { value: "no", label: "No / not sure" },
              { value: "yes", label: "Yes, spreading" },
            ]}
          />
        </Field>

        {/* Fever */}
        <Field label="Do you have a fever or feel unwell?">
          <Pills
            value={data.fever ? "yes" : "no"}
            onChange={(v) => set("fever", v === "yes")}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
          />
        </Field>

        {/* Location */}
        <Field label="Where on your body is this?">
          <input
            type="text"
            placeholder="e.g. cheek, forehead, arm..."
            value={data.location}
            onChange={(e) => set("location", e.target.value)}
            className="w-full rounded-[10px] border border-[var(--border-light)] bg-[var(--bg-card)] px-3 py-2.5 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        </Field>

        {/* New products */}
        <Field label="Started any new products recently?" hint="Optional">
          <input
            type="text"
            placeholder="e.g. new face wash, sunscreen..."
            value={data.newProducts}
            onChange={(e) => set("newProducts", e.target.value)}
            className="w-full rounded-[10px] border border-[var(--border-light)] bg-[var(--bg-card)] px-3 py-2.5 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
        </Field>

        {/* Stress */}
        <Field label="Stress level lately?" hint="Optional">
          <Pills
            value={data.stressLevel}
            onChange={(v) =>
              set("stressLevel", v as SymptomContext["stressLevel"])
            }
            options={[
              { value: "skip", label: "Skip" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        </Field>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={onBack}
          className="btn-secondary flex-1 gap-2"
        >
          <IconArrowLeft size={14} />
          Back
        </button>
        <button
          onClick={() => onSubmit(data)}
          className="btn-primary flex-1 gap-2"
        >
          Get Guidance
          <IconArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ---- small helper components ---- */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-baseline gap-2 text-[13px] font-medium text-[var(--text-primary)]">
        {label}
        {hint && (
          <span className="text-[11px] font-normal text-[var(--text-muted)]">{hint}</span>
        )}
      </label>
      {children}
    </div>
  );
}

function Pills({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
            value === opt.value
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--warm-300)]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
