"use client";

import { ButtonPrimary, CalloutPanel, FeatureItem } from "@/components/ui";

interface Under13StepProps {
  onContinueLearnOnly: () => void;
}

export function Under13Step({ onContinueLearnOnly }: Under13StepProps) {
  return (
    <div className="max-w-md mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fef5f3] mb-4">
          <span className="text-[22px]">🌱</span>
        </div>
        <h2 className="text-heading text-[22px] text-[#2e2a25] mb-2">
          Great — here&apos;s your experience
        </h2>
        <p className="text-[14px] text-[#8a7d6e] leading-relaxed max-w-sm">
          Photo check-ins are available for ages 13+, but there&apos;s plenty
          you can explore right now:
        </p>
      </div>

      {/* Available features */}
      <div className="space-y-5 mb-8 animate-fade-up stagger-1">
        <FeatureItem
          icon="📚"
          title="Learn Hub"
          desc="Myth-busting guides, ingredient breakdowns, and skin science made simple"
        />
        <FeatureItem
          icon="✨"
          title="Confidence Mode"
          desc="Real-skin normalization, media literacy, and anti-filter content"
        />
        <FeatureItem
          icon="🧴"
          title="Routine Basics"
          desc="Learn about gentle cleansing, moisturizing, and sun protection"
        />
      </div>

      {/* Guardian note */}
      <div className="mb-8 animate-fade-up stagger-2">
        <CalloutPanel icon="💬" variant="warm">
          <strong>Tip for parents:</strong> You can use Unfilter&apos;s full
          features on behalf of your child. The app is designed for guided,
          educational use.
        </CalloutPanel>
      </div>

      {/* CTA */}
      <div className="animate-fade-up stagger-3">
        <ButtonPrimary onClick={onContinueLearnOnly} className="w-full">
          Start exploring
        </ButtonPrimary>
      </div>
    </div>
  );
}
