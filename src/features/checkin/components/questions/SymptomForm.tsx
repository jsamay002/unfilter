"use client";

import { useState } from "react";
import type { SymptomContext } from "../../types";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        📝 Quick Context
      </h3>
      <p className="text-sm text-slate-500 mb-5">
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
            placeholder="e.g. cheek, forehead, arm…"
            value={data.location}
            onChange={(e) => set("location", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
          />
        </Field>

        {/* New products */}
        <Field label="Started any new products recently? (optional)">
          <input
            type="text"
            placeholder="e.g. new face wash, sunscreen…"
            value={data.newProducts}
            onChange={(e) => set("newProducts", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
          />
        </Field>

        {/* Stress */}
        <Field label="Stress level lately? (optional)">
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
          className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          ← Back
        </button>
        <button
          onClick={() => onSubmit(data)}
          className="flex-1 rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Get Guidance →
        </button>
      </div>
    </div>
  );
}

/* ---- small helper components ---- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
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
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            value === opt.value
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
