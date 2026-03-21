"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { OnboardingGate } from "@/components/OnboardingGate";
import {
  IconCamera,
  IconJournal,
  IconShield,
  IconSparkle,
  IconBook,
  IconArrowRight,
} from "@/components/icons";
import { useAuthStore } from "@/features/auth/store";

export default function HomePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const firstName = user?.username ?? "there";

  return (
    <OnboardingGate>
      <AppShell>
        <div className="mx-auto max-w-xl">
          {/* Greeting — quiet, personal */}
          <p className="text-[13px] text-[var(--text-muted)] mb-6 animate-fade-up">
            Hi {firstName}
          </p>

          {/* Hero — one dominant message, one dominant action */}
          <section className="mb-10 animate-fade-up stagger-1">
            <h1 className="text-display text-[clamp(30px,6vw,48px)] text-[var(--text-primary)] leading-[1.1] mb-4">
              See what filters<br />
              <span className="gradient-text">actually do.</span>
            </h1>
            <p className="text-[16px] leading-relaxed text-[var(--text-secondary)] max-w-md mb-8">
              Upload a selfie and watch it change in real time.
              Everything stays on your device.
            </p>

            {/* Primary CTA */}
            <button
              onClick={() => router.push("/lab")}
              className="group w-full flex items-center justify-between rounded-[16px] bg-[var(--accent)] px-7 py-5 text-white transition-all hover:bg-[var(--accent-dark)] hover:shadow-lg hover:shadow-[var(--accent)]/15 active:scale-[0.99]"
            >
              <div className="text-left">
                <p className="text-[18px] font-semibold mb-0.5">
                  Try the Distortion Lab
                </p>
                <p className="text-[13px] text-white/70">
                  See how beauty filters manipulate photos
                </p>
              </div>
              <IconArrowRight size={22} className="shrink-0 opacity-70 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => router.push("/lab?demo=true")}
              className="mt-3 w-full rounded-[12px] border border-[var(--border-light)] bg-[var(--bg-card)] px-5 py-3.5 text-[14px] font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] hover:bg-[var(--bg-secondary)]"
            >
              Use a demo image instead
            </button>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mb-8 animate-fade-up stagger-2" />

          {/* Other tools — visually quiet, discoverable */}
          <section className="animate-fade-up stagger-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] mb-3">
              Your tools
            </p>
            <div className="space-y-2">
              <ToolRow
                href="/routine"
                icon={<IconShield size={18} />}
                color="text-[var(--coral)]"
                bg="bg-[var(--coral-light)]"
                title="Barrier Safety Copilot"
                desc="Check ingredients for conflicts"
              />
              <ToolRow
                href="/journal"
                icon={<IconJournal size={18} />}
                color="text-[var(--gold)]"
                bg="bg-[var(--gold-light)]"
                title="Skin Journal"
                desc="Track your skin over time"
              />
              <ToolRow
                href="/check-in"
                icon={<IconCamera size={18} />}
                color="text-[var(--accent)]"
                bg="bg-[var(--accent-light)]"
                title="Check-In"
                desc="Quick skin photo assessment"
              />
              <ToolRow
                href="/learn"
                icon={<IconBook size={18} />}
                color="text-[var(--text-secondary)]"
                bg="bg-[var(--bg-secondary)]"
                title="Learn"
                desc="Skin science in plain English"
              />
              <ToolRow
                href="/confidence"
                icon={<IconSparkle size={18} />}
                color="text-[var(--amber)]"
                bg="bg-[var(--gold-light)]"
                title="Confidence"
                desc="Media literacy + self-image"
              />
            </div>
          </section>

          {/* Privacy — bottom, subtle */}
          <div className="mt-10 mb-4 flex items-center gap-2.5 justify-center animate-fade-in stagger-4">
            <IconShield size={13} className="text-[var(--accent)]" />
            <p className="text-[11px] text-[var(--text-muted)]">
              Everything runs on your device. Nothing is uploaded.
            </p>
          </div>
        </div>
      </AppShell>
    </OnboardingGate>
  );
}

/* --- Tool Row --- */

function ToolRow({
  href,
  icon,
  color,
  bg,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 rounded-[12px] px-4 py-3 transition hover:bg-[var(--bg-secondary)]"
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${bg} ${color}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="text-[12px] text-[var(--text-muted)]">{desc}</p>
      </div>
      <IconArrowRight size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition shrink-0" />
    </Link>
  );
}
