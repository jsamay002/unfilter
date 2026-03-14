"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { OnboardingGate } from "@/components/OnboardingGate";
import { DistortionDemo } from "@/components/DistortionDemo";
import {
  IconCamera,
  IconJournal,
  IconShield,
  IconSparkle,
  IconBook,
  IconSettings,
} from "@/components/icons";

export default function HomePage() {
  return (
    <OnboardingGate>
      <AppShell>
        <div className="mx-auto max-w-3xl">
          {/* Editorial hero */}
          <section className="mb-12 animate-fade-up">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Skin Literacy Platform
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[var(--border)] to-transparent" />
            </div>
            <h1 className="text-display text-[clamp(36px,7vw,60px)] text-[var(--text-primary)] text-center">
              See Skin Clearly.
            </h1>
            <p className="mt-5 mx-auto max-w-lg text-center text-[16px] leading-[1.7] text-[var(--text-tertiary)]">
              Filters hide what real skin looks like. Unfilter shows you the
              difference&mdash;and protects you from skincare trends that do
              more harm than good.
            </p>
          </section>

          {/* Distortion Demo — the 60-second hook */}
          <section className="mb-14 animate-fade-up stagger-1">
            <DistortionDemo />
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mb-14" />

          {/* Three pillars — editorial row */}
          <section className="mb-14 animate-fade-up stagger-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-6">
              Core Tools
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <PillarCard
                href="/lab"
                icon={<IconCamera size={20} />}
                title="Distortion Lab"
                desc="See how smoothing, lighting, and contrast distort real skin."
                accent="sage"
              />
              <PillarCard
                href="/routine"
                icon={<IconShield size={20} />}
                title="Barrier Safety"
                desc="Warns about ingredient overuse, conflicts, and risky stacking."
                accent="coral"
              />
              <PillarCard
                href="/journal"
                icon={<IconJournal size={20} />}
                title="Skin Journal"
                desc="Track confidence, routine changes, and skin over time."
                accent="gold"
              />
            </div>
          </section>

          {/* Privacy — inline editorial callout */}
          <section className="mb-14 animate-fade-up stagger-3">
            <div className="rounded-[var(--radius-lg)] bg-[var(--accent-lighter)] border border-[var(--accent-light)] px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)]">
                  <IconShield size={16} className="text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--accent-dark)]">
                    100% On-Device Processing
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-tertiary)]">
                    Photos never leave your device. No cloud uploads. Auto-delete
                    enabled by default. Your skin data stays yours.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Supporting tools — quieter, editorial list */}
          <section className="mb-14 animate-fade-up stagger-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-5">
              Learn &amp; Support
            </p>
            <div className="space-y-1">
              <EditorialLink
                href="/check-in"
                icon={<IconSparkle size={16} />}
                title="On-Device Skin Insight"
                desc="Private capture and observation"
              />
              <EditorialLink
                href="/learn"
                icon={<IconBook size={16} />}
                title="Learn Hub"
                desc="Myth-busting and practical skin literacy"
              />
              <EditorialLink
                href="/help"
                icon={<IconSparkle size={16} />}
                title="Help & Escalation"
                desc="Red flags, conversation scripts, and resources"
              />
              <EditorialLink
                href="/settings"
                icon={<IconSettings size={16} />}
                title="Settings"
                desc="Accessibility, privacy controls, and account"
              />
            </div>
          </section>
        </div>
      </AppShell>
    </OnboardingGate>
  );
}

function PillarCard({
  href,
  icon,
  title,
  desc,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: "sage" | "coral" | "gold";
}) {
  const iconBg = {
    sage: "bg-[var(--accent-light)] text-[var(--accent)]",
    coral: "bg-[var(--coral-light)] text-[var(--coral)]",
    gold: "bg-[var(--gold-light)] text-[var(--gold)]",
  }[accent];

  return (
    <Link
      href={href}
      className="card-interactive block rounded-[var(--radius-md)] p-5"
    >
      <div
        className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[10px] ${iconBg}`}
      >
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold text-[var(--text-primary)] leading-snug">
        {title}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-tertiary)]">
        {desc}
      </p>
    </Link>
  );
}

function EditorialLink({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-[var(--radius-sm)] px-4 py-3.5 transition-colors hover:bg-[var(--bg-secondary)]"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--warm-200)] text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-[var(--text-primary)]">
          {title}
        </p>
        <p className="text-[12px] text-[var(--text-muted)]">{desc}</p>
      </div>
      <span className="text-[var(--text-muted)] group-hover:text-[var(--text-tertiary)] transition-colors text-[13px]">
        &rarr;
      </span>
    </Link>
  );
}
