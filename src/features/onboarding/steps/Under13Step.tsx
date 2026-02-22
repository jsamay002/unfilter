"use client";

interface Under13StepProps {
  onContinueLearnOnly: () => void;
}

export function Under13Step({ onContinueLearnOnly }: Under13StepProps) {
  return (
    <div className="px-2 animate-fade-up text-center">
      <span className="text-4xl">🌱</span>
      <h2 className="mt-4 font-display text-xl font-bold text-sand-900">
        You&apos;re a bit young for photo check-ins
      </h2>
      <p className="mt-2 text-sm text-sand-500 max-w-xs mx-auto leading-relaxed">
        That&apos;s totally okay! Photo-based check-ins require you to be 13 or
        older, but there&apos;s still a lot you can do:
      </p>

      <div className="mt-6 space-y-2.5 max-w-xs mx-auto text-left">
        <FeatureCard icon="📚" title="Learn Hub" desc="Understand your skin with myth-busting guides" />
        <FeatureCard icon="✨" title="Confidence Mode" desc="Real-skin normalization and media literacy" />
        <FeatureCard icon="🧴" title="Routine Basics" desc="Learn about gentle cleansing and moisturizing" />
      </div>

      <div className="mt-6 rounded-xl bg-sand-50 border border-sand-200 px-4 py-3 max-w-xs mx-auto">
        <p className="text-xs text-sand-600 leading-relaxed">
          💬 <strong>Tip:</strong> Ask a parent or guardian to help you
          with any skin concerns — they can also use Unfilter&apos;s check-in
          features on your behalf.
        </p>
      </div>

      <button
        onClick={onContinueLearnOnly}
        className="mt-6 w-full max-w-xs rounded-2xl bg-sage-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-sage-200 transition hover:bg-sage-700 active:scale-[0.98]"
      >
        Explore Learn-Only Mode
      </button>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="card border border-sand-200 p-3.5 flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-sand-800">{title}</p>
        <p className="text-xs text-sand-500">{desc}</p>
      </div>
    </div>
  );
}
