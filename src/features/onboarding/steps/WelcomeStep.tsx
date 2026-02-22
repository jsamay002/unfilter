"use client";

interface WelcomeStepProps {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 animate-fade-up">
      {/* Logo mark */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-sage-600 shadow-lg shadow-sage-200">
        <span className="font-display text-3xl font-bold text-white">U</span>
      </div>

      <h1 className="font-display text-3xl font-bold text-sand-900 tracking-tight">
        Unfilter
      </h1>
      <p className="mt-2 text-base text-sand-500 font-medium">
        Skin Health + Confidence Coach
      </p>

      <div className="mt-8 max-w-xs space-y-4">
        <FeatureRow icon="📷" text="Private photo check-ins with educational guidance" />
        <FeatureRow icon="🔒" text="Everything stays on your device — always" />
        <FeatureRow icon="🧴" text="Safe routines, not random internet advice" />
        <FeatureRow icon="✨" text="Real skin confidence, no filters needed" />
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-xl bg-sage-50 border border-sage-100 px-4 py-3 max-w-xs">
        <p className="text-xs text-sage-700 leading-relaxed">
          Unfilter gives <strong>educational guidance only</strong> — it&apos;s
          not a diagnosis tool. When something looks serious, we&apos;ll help
          you find the right person to talk to.
        </p>
      </div>

      <button
        onClick={onContinue}
        className="mt-8 w-full max-w-xs rounded-2xl bg-sage-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-sage-200 transition hover:bg-sage-700 active:scale-[0.98]"
      >
        Get Started
      </button>

      <p className="mt-4 text-[11px] text-sand-400">
        Free · No account required · No ads
      </p>
    </div>
  );
}

function FeatureRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3 text-left">
      <span className="text-lg shrink-0 mt-0.5">{icon}</span>
      <p className="text-sm text-sand-700 leading-snug">{text}</p>
    </div>
  );
}
