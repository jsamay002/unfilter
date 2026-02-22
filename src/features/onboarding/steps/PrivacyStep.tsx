"use client";

interface PrivacyStepProps {
  onAccept: () => void;
  onDecline: () => void;
}

const PRIVACY_POINTS = [
  {
    icon: "📱",
    title: "On-device processing",
    desc: "Your photos are analyzed right on your phone. Nothing is uploaded to any server — ever.",
  },
  {
    icon: "🙈",
    title: "Face blur + crop by default",
    desc: "If a face is detected, it's automatically blurred. You're encouraged to crop to just the area of concern.",
  },
  {
    icon: "🗑️",
    title: "Auto-delete by default",
    desc: "Photos are deleted after each check-in unless you choose to save them. You control how long anything is kept.",
  },
  {
    icon: "🚫",
    title: "No face recognition",
    desc: "We never identify who you are from photos. No biometric data is collected or stored.",
  },
  {
    icon: "📤",
    title: "Export or delete anytime",
    desc: "Download a summary for a doctor or parent, or wipe everything with one tap. It's your data.",
  },
  {
    icon: "🔕",
    title: "No tracking, no ads, no accounts",
    desc: "No analytics tracking, no advertisements, no sign-up required. Just you and the app.",
  },
];

export function PrivacyStep({ onAccept, onDecline }: PrivacyStepProps) {
  return (
    <div className="px-2 animate-fade-up">
      <div className="text-center mb-6">
        <span className="text-3xl">🔒</span>
        <h2 className="mt-3 font-display text-xl font-bold text-sand-900">
          Your Privacy Comes First
        </h2>
        <p className="mt-1 text-sm text-sand-500">
          Here&apos;s exactly how we protect you — takes about 60 seconds to read.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {PRIVACY_POINTS.map((point) => (
          <div
            key={point.title}
            className="card border border-sand-200 p-4 flex gap-3"
          >
            <span className="text-xl shrink-0">{point.icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-sand-800">
                {point.title}
              </h3>
              <p className="mt-0.5 text-xs text-sand-500 leading-relaxed">
                {point.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TL;DR */}
      <div className="rounded-xl bg-sage-50 border border-sage-100 px-4 py-3 mb-6">
        <p className="text-xs text-sage-700 leading-relaxed">
          <strong>TL;DR:</strong> Your photos and data stay on your device,
          are never uploaded, and are deleted automatically. You&apos;re in
          complete control.
        </p>
      </div>

      <button
        onClick={onAccept}
        className="w-full rounded-2xl bg-sage-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-sage-200 transition hover:bg-sage-700 active:scale-[0.98]"
      >
        I Understand — Continue
      </button>

      <button
        onClick={onDecline}
        className="mt-2 w-full rounded-2xl border border-sand-200 py-3 text-sm font-medium text-sand-500 transition hover:bg-sand-50"
      >
        I&apos;d rather not — Learn-Only Mode
      </button>

      <p className="mt-3 text-center text-[10px] text-sand-400">
        You can review these policies anytime in Settings
      </p>
    </div>
  );
}
