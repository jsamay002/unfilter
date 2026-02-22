"use client";

import {
  ButtonPrimary,
  ButtonText,
  TrustChip,
  CalloutPanel,
} from "@/components/ui";

interface WelcomeStepProps {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-between px-6 py-8 md:px-12 md:py-12">
      {/* Top bar */}
      <div className="flex items-center gap-2.5 animate-fade-in">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#3d5a3d] shadow-sm">
          <span className="text-white text-[15px] font-bold" style={{ fontFamily: "Outfit" }}>
            U
          </span>
        </div>
        <span
          className="text-[17px] font-semibold text-[#2e2a25] tracking-[-0.02em]"
          style={{ fontFamily: "Outfit" }}
        >
          Unfilter
        </span>
      </div>

      {/* Main content — asymmetric on desktop */}
      <div className="flex-1 flex items-center mt-8 md:mt-0">
        <div className="w-full grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="animate-fade-up">
              <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#7da37d] mb-3">
                Skin health + confidence
              </p>
              <h1
                className="text-display text-[clamp(32px,5vw,48px)] text-[#2e2a25] mb-4"
              >
                Understand your skin.
                <br />
                <span className="text-[#5c875c]">Skip the guesswork.</span>
              </h1>
              <p className="text-[16px] leading-[1.6] text-[#6b5e50] max-w-md mb-6">
                Photo-based guidance that helps you learn what&apos;s going on
                with your skin — privately, on your device, with zero judgment.
              </p>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 mb-8 animate-fade-up stagger-1">
              <TrustChip icon="🔒" label="On-device" />
              <TrustChip icon="🚫" label="No account" />
              <TrustChip icon="🧹" label="Auto-delete" />
              <TrustChip icon="📵" label="No ads" />
            </div>

            {/* CTA */}
            <div className="animate-fade-up stagger-2">
              <ButtonPrimary onClick={onContinue} className="w-full sm:w-auto">
                Get Started — It&apos;s Free
              </ButtonPrimary>
              <p className="mt-3 text-[12px] text-[#b0a697]">
                No sign-up required. Takes about 2 minutes.
              </p>
            </div>
          </div>

          {/* Right: Visual card stack */}
          <div className="hidden md:block animate-scale-in stagger-3">
            <div className="relative">
              {/* Background decorative card */}
              <div className="absolute -top-3 -right-3 w-full h-full rounded-3xl bg-[#eef3ee] border border-[#d4e0d4]" />

              {/* Main preview card */}
              <div className="relative card-elevated p-6">
                <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#b0a697] mb-4">
                  How it works
                </p>

                <div className="space-y-5">
                  <HowStep
                    num="1"
                    title="Snap a photo"
                    desc="Crop to the area of concern. Face blur is automatic."
                  />
                  <HowStep
                    num="2"
                    title="Answer a few questions"
                    desc="Duration, symptoms, recent products — all optional."
                  />
                  <HowStep
                    num="3"
                    title="Get guidance"
                    desc="Educational categories, a gentle action plan, and red-flag alerts."
                  />
                </div>

                <div className="mt-5 pt-4 border-t border-[#f0ede7]">
                  <CalloutPanel icon="🎓" variant="sage">
                    Educational guidance, not a diagnosis. When something looks
                    serious, we help you find the right person to talk to.
                  </CalloutPanel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only: How it works (below CTA) */}
      <div className="md:hidden mt-10 animate-fade-up stagger-4">
        <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#b0a697] mb-4">
          How it works
        </p>
        <div className="grid grid-cols-3 gap-3">
          <MobileStep num="1" title="Snap" desc="Photo of the area" />
          <MobileStep num="2" title="Context" desc="Quick questions" />
          <MobileStep num="3" title="Guidance" desc="Action plan" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-[#eae5dd] flex items-center justify-between animate-fade-in stagger-5">
        <p className="text-[11px] text-[#b0a697]">
          Educational guidance only — not medical advice
        </p>
        <ButtonText>How privacy works →</ButtonText>
      </div>
    </div>
  );
}

/* -- Sub-components -- */

function HowStep({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3.5 items-start">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0ede7] text-[13px] font-bold text-[#6b5e50]">
        {num}
      </div>
      <div>
        <p className="text-[14px] font-semibold text-[#2e2a25]">{title}</p>
        <p className="text-[12px] text-[#8a7d6e] leading-snug mt-0.5">
          {desc}
        </p>
      </div>
    </div>
  );
}

function MobileStep({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="card p-3 text-center">
      <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef3ee] text-[12px] font-bold text-[#3d5a3d]">
        {num}
      </div>
      <p className="text-[13px] font-semibold text-[#2e2a25]">{title}</p>
      <p className="text-[11px] text-[#8a7d6e] mt-0.5">{desc}</p>
    </div>
  );
}
