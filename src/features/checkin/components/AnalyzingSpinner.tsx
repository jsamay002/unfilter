"use client";

export function AnalyzingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Pulsing circle */}
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-full bg-slate-200 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🔬
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        Analyzing your photo…
      </h3>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        Running on-device analysis. Your photo stays on your phone and is never
        uploaded to any server.
      </p>

      {/* Privacy reassurance */}
      <div className="mt-6 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
        <span>🔒</span>
        <span>100% on-device · No cloud upload</span>
      </div>
    </div>
  );
}
