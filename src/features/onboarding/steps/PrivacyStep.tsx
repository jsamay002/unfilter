"use client";

import {
  ButtonPrimary,
  ButtonSecondary,
  CalloutPanel,
  SectionLabel,
  Divider,
} from "@/components/ui";

interface PrivacyStepProps {
  onAccept: () => void;
  onDecline: () => void;
}

const SECTIONS = [
  {
    label: "Processing",
    items: [
      {
        icon: "📱",
        title: "Analyzed on your phone",
        desc: "Photos are processed locally using on-device models. Nothing is sent to a server.",
      },
      {
        icon: "🙈",
        title: "Automatic face protection",
        desc: "Faces are blurred by default. You're encouraged to crop to just the area of concern.",
      },
    ],
  },
  {
    label: "Storage",
    items: [
      {
        icon: "🗑️",
        title: "Auto-delete by default",
        desc: "Photos are removed after each check-in. You decide if anything gets saved, and for how long.",
      },
      {
        icon: "💾",
        title: "Encrypted if you save",
        desc: "Anything you keep is stored encrypted on your device — not in the cloud.",
      },
    ],
  },
  {
    label: "Identity",
    items: [
      {
        icon: "🚫",
        title: "No accounts, no tracking",
        desc: "No sign-up, no analytics cookies, no behavioral tracking. We don't know who you are.",
      },
      {
        icon: "🧬",
        title: "No biometric data",
        desc: "We never use facial recognition or collect biometric identifiers of any kind.",
      },
    ],
  },
  {
    label: "Control",
    items: [
      {
        icon: "📤",
        title: "Export or delete anytime",
        desc: "Download a summary for a doctor, or wipe everything with a single tap.",
      },
    ],
  },
];

export function PrivacyStep({ onAccept, onDecline }: PrivacyStepProps) {
  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3ee]">
            <span className="text-[22px]">🔒</span>
          </div>
          <div>
            <h2 className="text-heading text-[22px] text-[#2e2a25]">
              Private by design
            </h2>
            <p className="text-[13px] text-[#8a7d6e]">
              Here&apos;s how your data is protected
            </p>
          </div>
        </div>
      </div>

      {/* Grouped privacy items */}
      <div className="space-y-6">
        {SECTIONS.map((section, si) => (
          <div
            key={section.label}
            className={`animate-fade-up stagger-${si + 1}`}
          >
            <SectionLabel>{section.label}</SectionLabel>
            <div className="space-y-2.5">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="card px-4 py-3.5 flex gap-3.5 items-start"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f7f4ef] text-[17px]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#2e2a25] leading-tight">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-[#8a7d6e] leading-snug mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* Why this matters */}
      <div className="animate-fade-up stagger-5">
        <CalloutPanel icon="💡" variant="sage">
          <strong>Why this matters:</strong> Skin concerns are personal. We
          built Unfilter so you can get guidance without giving up your privacy
          or worrying about your photos ending up somewhere unexpected.
        </CalloutPanel>
      </div>

      {/* CTAs */}
      <div className="mt-8 space-y-2.5 animate-fade-up stagger-6">
        <ButtonPrimary onClick={onAccept} className="w-full">
          Sounds good — continue
        </ButtonPrimary>
        <ButtonSecondary onClick={onDecline} className="w-full">
          Skip photo features — explore learn-only mode
        </ButtonSecondary>
      </div>

      <p className="mt-4 text-center text-[11px] text-[#b0a697]">
        You can revisit these details anytime in Settings
      </p>
    </div>
  );
}
