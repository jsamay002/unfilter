"use client";

interface TutorialStepProps {
  onFinish: () => void;
}

const TIPS = [
  {
    icon: "💡",
    do: "Face a window for natural light",
    dont: "Don't use flash or overhead lighting",
  },
  {
    icon: "📏",
    do: "Hold phone 6–10 inches from the area",
    dont: "Don't zoom in with the camera zoom",
  },
  {
    icon: "✂️",
    do: "Crop close to the affected area",
    dont: "No need to include your full face",
  },
  {
    icon: "🚫",
    do: "Use your normal camera app",
    dont: "Don't use beauty mode or smoothing filters",
  },
  {
    icon: "🤳",
    do: "Hold steady — brace your elbow",
    dont: "Avoid moving while taking the photo",
  },
];

export function TutorialStep({ onFinish }: TutorialStepProps) {
  return (
    <div className="px-2 animate-fade-up">
      <div className="text-center mb-6">
        <span className="text-3xl">📷</span>
        <h2 className="mt-3 font-display text-xl font-bold text-sand-900">
          Quick Photo Tips
        </h2>
        <p className="mt-1 text-sm text-sand-500 max-w-xs mx-auto">
          Better photos = better guidance. This takes 30 seconds.
        </p>
      </div>

      {/* Visual tips */}
      <div className="space-y-2.5 mb-6">
        {TIPS.map((tip, i) => (
          <div
            key={i}
            className="card border border-sand-200 px-4 py-3.5"
            style={{
              animationDelay: `${i * 60}ms`,
              animationFillMode: "both",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">{tip.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sage-100 text-[9px] font-bold text-sage-700">
                    ✓
                  </span>
                  <p className="text-sm text-sage-800 font-medium leading-snug">
                    {tip.do}
                  </p>
                </div>
                <div className="flex items-start gap-2 mt-1.5">
                  <span className="shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coral-100 text-[9px] font-bold text-coral-600">
                    ✕
                  </span>
                  <p className="text-xs text-sand-500 leading-snug">
                    {tip.dont}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary card */}
      <div className="rounded-xl bg-sage-50 border border-sage-100 px-4 py-3 mb-6">
        <p className="text-xs text-sage-700 leading-relaxed text-center">
          <strong>Remember:</strong> Our quality check will let you know if a
          retake would help. No pressure to get it perfect.
        </p>
      </div>

      <button
        onClick={onFinish}
        className="w-full rounded-2xl bg-sage-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-sage-200 transition hover:bg-sage-700 active:scale-[0.98]"
      >
        I&apos;m Ready — Let&apos;s Go! 🎉
      </button>
    </div>
  );
}
