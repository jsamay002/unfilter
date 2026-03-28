"use client";

import { useEffect } from "react";
import Link from "next/link";

// Lightweight AOS — intersection observer that adds .aos-visible
function useAOS() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-aos]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const PILLARS = [
  {
    eyebrow: "Expose Distortion",
    title: "Show what filters change",
    body:
      "The lab and detector reveal smoothing, reshaping, and lighting tricks so edited skin stops feeling like the standard.",
  },
  {
    eyebrow: "Check In Honestly",
    title: "Focus on your real skin",
    body:
      "Private check-ins help users reflect without judgment and notice patterns over time, even after a rough skin day.",
  },
  {
    eyebrow: "Protect Privacy",
    title: "Keep sensitive data personal",
    body:
      "Photos, routines, and journals stay on-device, so the app can support teens without turning their skin into content.",
  },
];

const JOURNEY = [
  {
    step: "01",
    title: "See how digital beauty standards get made",
    body:
      "Start with the distortion tools to make the invisible visible. Users can see the editing tricks behind the images they compare themselves to every day.",
  },
  {
    step: "02",
    title: "Replace comparison with reflection",
    body:
      "Move into honest skin check-ins, educational guidance, and routine safety so the app becomes a support system with context and care.",
  },
  {
    step: "03",
    title: "Track truth over time",
    body:
      "The journal and routine flow turn isolated insecurity into long-term awareness: what changed, what helped, and what stayed real.",
  },
];

const BENEFITS = [
  "Teens learn that filtered skin is often manufactured, not normal.",
  "Users get a private place to reflect away from public performance.",
  "The app teaches patterns and habits with calm, educational guidance.",
];

export default function LandingPage() {
  useAOS();

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--bg-primary)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[color:color-mix(in_srgb,var(--bg-primary)_88%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--accent)]">
              <span
                className="text-[13px] font-bold text-white"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                U
              </span>
            </div>
            <span className="text-display text-[18px] text-[var(--text-primary)]">
              Unfilter
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-[10px] px-4 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-[10px] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[var(--accent-dark)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-6 pb-16 pt-16 md:pb-24 md:pt-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p
              data-aos="fade-up"
              className="mb-5 text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--coral)]"
            >
              Built for the Congressional App Challenge
            </p>

            <h1
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-display text-[clamp(40px,7vw,74px)] leading-[0.96] text-[var(--text-primary)]"
            >
              Filtered skin
              <br />
              became <MarkedWord style="circle">normal</MarkedWord>
              .
              <br />
              <span className="text-[var(--accent)]">It should not have.</span>
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="mt-6 max-w-2xl text-[17px] leading-[1.8] text-[var(--text-secondary)]"
            >
              Unfilter helps teens separate edited beauty from reality, understand
              their real skin privately, and track patterns over time without
              shame, diagnosis, or cloud uploads.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-[14px] bg-[var(--accent)] px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[var(--accent-dark)]"
              >
                Start Honestly
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-[14px] border border-[var(--border)] px-6 py-3.5 text-[15px] font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]"
              >
                Open the App
              </Link>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="mt-10 max-w-2xl"
            >
              <div className="flex flex-wrap gap-2.5">
                <SimplePill>On-device by default</SimplePill>
                <SimplePill>Educational guidance</SimplePill>
                <SimplePill>Built for teens</SimplePill>
              </div>
            </div>

            <div
              data-aos="fade-up"
              data-aos-delay="500"
              className="mt-6 flex items-center gap-3 text-[var(--text-tertiary)]"
            >
              <SmileyStarDoodle />
            </div>
          </div>

          <div data-aos="fade-left" className="relative">
            <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_30px_80px_rgba(42,35,28,0.08)]">
              <div className="border-b border-[var(--border-light)] bg-[var(--bg-secondary)] px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Why Unfilter Exists
                </p>
              </div>

              <div className="grid gap-0">
                <EvidenceBlock
                  tone="soft"
                  title="The problem"
                  body="Teen skin confidence is shaped by edited images that erase texture, blur breakouts, and make fake perfection feel ordinary."
                />
                <EvidenceBlock
                  tone="accent"
                  title="The intervention"
                  body="Unfilter reveals those distortions, supports honest check-ins, and turns skin care into reflection, context, and learning."
                />
                <EvidenceBlock
                  tone="warm"
                  title="The benefit"
                  body="Users leave with context, privacy, and healthier expectations that last beyond a single result screen."
                />
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-5 hidden h-24 w-24 rounded-full border border-[var(--border-light)] bg-[var(--bg-secondary)]/70 blur-[1px] lg:block"
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-8 md:pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[26px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--bg-card),var(--bg-secondary))] p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr] md:items-start">
              <div data-aos="fade-right">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  What Users Leave With
                </p>
                <h2 className="text-display text-[clamp(26px,4vw,40px)] leading-[1.02] text-[var(--text-primary)]">
                  A private tool
                  <br />
                  with staying power.
                </h2>
              </div>

              <div className="grid gap-3">
                {BENEFITS.map((benefit, index) => (
                  <div
                    key={benefit}
                    data-aos="fade-up"
                    data-aos-delay={String((index + 1) * 100)}
                    className="rounded-[18px] border border-[var(--border-light)] bg-[var(--bg-card)] px-4 py-4 text-[14px] leading-relaxed text-[var(--text-secondary)]"
                  >
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div data-aos="fade-up" className="lg:sticky lg:top-28">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Three Core Promises
              </p>
              <h2 className="text-display text-[clamp(28px,4vw,42px)] text-[var(--text-primary)]">
                One <MarkedWord style="underline">mission</MarkedWord>, three parts.
              </h2>
              <p
                data-aos="fade-up"
                data-aos-delay="100"
                className="mt-4 max-w-sm text-[15px] leading-[1.75] text-[var(--text-tertiary)]"
              >
                Unfilter works best when the experience feels connected: see
                through distortion, check in honestly, and keep the process private.
              </p>
            </div>

            <div className="space-y-4 lg:pl-8">
              {PILLARS.map((pillar, index) => (
                <PillarCard
                  key={pillar.title}
                  eyebrow={pillar.eyebrow}
                  title={pillar.title}
                  body={pillar.body}
                  delay={String(index * 100)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border-light)] bg-[var(--bg-secondary)] px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
            <div data-aos="fade-right" className="relative">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                User Journey
              </p>
              <h2 className="text-display text-[clamp(28px,4vw,42px)] leading-[1.04] text-[var(--text-primary)]">
                Designed to move users
                <br />
                from comparison to <MarkedWord style="loop">clarity</MarkedWord>.
              </h2>
            </div>

            <div className="space-y-5 lg:translate-y-6">
              {JOURNEY.map((item, index) => (
                <JourneyRow
                  key={item.step}
                  step={item.step}
                  title={item.title}
                  body={item.body}
                  delay={String(index * 100)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div
            data-aos="fade-up"
            className="rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] p-7 md:p-8"
          >
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
              Privacy Is Part Of The Product
            </p>
            <h2 className="text-display text-[clamp(26px,4vw,38px)] text-[var(--text-primary)]">
              Sensitive skin data deserves <MarkedWord color="accent" style="circle">privacy</MarkedWord>.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-[1.8] text-[var(--text-secondary)]">
              Unfilter keeps photos, check-ins, and routine history on the user&apos;s
              device whenever possible. Privacy is built into the experience from
              the first interaction, and that shapes why the product feels trustworthy.
            </p>
          </div>

          <div className="grid gap-4">
            <MetricCard
              dataAos="fade-left"
              value="0"
              label="cloud uploads required for skin photos"
            />
            <MetricCard
              dataAos="fade-left"
              delay="100"
              value="3"
              label="core ideas repeated across the app: truth, reflection, privacy"
            />
            <MetricCard
              dataAos="fade-left"
              delay="200"
              value="1"
              label="clear purpose: help teens see real skin more honestly"
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-4 md:pb-28">
        <div
          data-aos="fade-up"
          className="mx-auto max-w-4xl rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--bg-secondary),var(--bg-primary))] px-6 py-10 text-center md:px-10"
        >
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Built for the Congressional App Challenge
          </p>
          <h2 className="text-display text-[clamp(30px,4.5vw,46px)] leading-[1.03] text-[var(--text-primary)]">
            A teen-built app about <MarkedWord style="brush">truth</MarkedWord>,
            <br />
            confidence, and digital pressure.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-[1.8] text-[var(--text-secondary)]">
            Unfilter gives users context for what they see, a private place to
            reflect, and a healthier standard than filtered perfection.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-[14px] bg-[var(--accent)] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[var(--accent-dark)]"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-[14px] border border-[var(--border)] px-7 py-3.5 text-[15px] font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-card)]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border-light)] px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-[11px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>Unfilter · Privacy-first skin literacy for teens</p>
          <p>Educational guidance only · Not medical advice</p>
        </div>
      </footer>
    </main>
  );
}

function SimplePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-[12px] font-semibold text-[var(--text-secondary)]">
      {children}
    </span>
  );
}

function MarkedWord({
  children,
  color = "coral",
  style = "underline",
}: {
  children: React.ReactNode;
  color?: "coral" | "accent";
  style?: "underline" | "circle" | "loop" | "brush";
}) {
  return (
    <span className="relative inline-block">
      {children}
      <HandDrawnMark color={color} style={style} />
    </span>
  );
}

function HandDrawnMark({
  color = "coral",
  style = "underline",
}: {
  color?: "coral" | "accent";
  style?: "underline" | "circle" | "loop" | "brush";
}) {
  const stroke = color === "accent" ? "text-[var(--accent)]" : "text-[var(--coral)]";

  if (style === "circle") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 180 70"
        className={`pointer-events-none absolute -left-3 -top-3 h-[145%] w-[122%] ${stroke}`}
        fill="none"
      >
        <path
          d="M16 37C16 19 44 8 85 8C126 8 162 19 162 36C162 55 132 62 87 62C42 62 13 53 16 37Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M28 25C44 14 76 10 112 13"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    );
  }

  if (style === "loop") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 180 44"
        className={`pointer-events-none absolute -bottom-4 -left-1 h-[24px] w-[112%] ${stroke}`}
        fill="none"
      >
        <path
          d="M9 27C31 12 53 10 79 24C103 37 127 36 171 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M118 18C130 7 146 8 153 18C159 28 147 37 133 34"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (style === "brush") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 170 38"
        className={`pointer-events-none absolute -bottom-2 left-0 h-[20px] w-[108%] ${stroke}`}
        fill="none"
      >
        <path
          d="M5 24C26 17 46 12 71 13C98 14 122 20 164 15"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.26"
        />
        <path
          d="M8 27C35 20 62 19 90 21C117 23 138 23 160 18"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 26"
      className={`pointer-events-none absolute -bottom-3 left-0 h-[18px] w-[110%] ${stroke}`}
      fill="none"
    >
      <path
        d="M6 15C36 22 66 20 93 18C113 16 132 12 154 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M18 21C47 24 87 24 148 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

function SmileyStarDoodle() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 84 44"
      className="h-10 w-20 shrink-0 text-[var(--coral)]"
      fill="none"
    >
      <path
        d="M28 22C28 14 34 8 42 8C50 8 56 14 56 22C56 30 50 36 42 36C34 36 28 30 28 22Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M38 19H38.01" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M46 19H46.01" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path
        d="M36 26C38 29 41 30 42 30C43 30 46 29 48 26"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M16 11L17.5 14.5L21 16L17.5 17.5L16 21L14.5 17.5L11 16L14.5 14.5L16 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M66 7L67.2 10L70 11.2L67.2 12.4L66 15L64.8 12.4L62 11.2L64.8 10L66 7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M63 27L64.2 30L67 31.2L64.2 32.4L63 35L61.8 32.4L59 31.2L61.8 30L63 27Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EvidenceBlock({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "soft" | "accent" | "warm";
}) {
  const toneClass =
    tone === "accent"
      ? "bg-[var(--accent-lighter)]"
      : tone === "warm"
        ? "bg-[var(--gold-light)]"
        : "bg-[var(--bg-card)]";

  return (
    <div className={`border-b border-[var(--border-light)] px-5 py-5 last:border-b-0 ${toneClass}`}>
      <p className="mb-1 text-[12px] font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="text-[13px] leading-[1.7] text-[var(--text-secondary)]">{body}</p>
    </div>
  );
}

function PillarCard({
  eyebrow,
  title,
  body,
  delay,
}: {
  eyebrow: string;
  title: string;
  body: string;
  delay: string;
}) {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={delay}
      className="rounded-[22px] border border-[var(--border)] bg-[var(--bg-card)] p-6"
    >
      <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-start">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {eyebrow}
        </p>
        <div>
          <h3 className="text-[20px] font-semibold leading-[1.15] text-[var(--text-primary)]">
            {title}
          </h3>
          <p className="mt-3 text-[14px] leading-[1.75] text-[var(--text-secondary)]">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

function JourneyRow({
  step,
  title,
  body,
  delay,
}: {
  step: string;
  title: string;
  body: string;
  delay: string;
}) {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={delay}
      className="rounded-[22px] border border-[var(--border)] bg-[var(--bg-card)] p-5 md:p-6"
    >
      <div className="flex items-start gap-4">
        <span
          className="shrink-0 text-[30px] leading-none text-[var(--warm-400)]"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          {step}
        </span>
        <div>
          <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">
            {title}
          </h3>
          <p className="mt-2 text-[14px] leading-[1.75] text-[var(--text-secondary)]">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  value,
  label,
  dataAos,
  delay,
}: {
  value: string;
  label: string;
  dataAos: "fade-left" | "fade-up";
  delay?: string;
}) {
  return (
    <div
      data-aos={dataAos}
      data-aos-delay={delay}
      className="rounded-[22px] border border-[var(--border)] bg-[var(--bg-card)] px-6 py-5"
    >
      <p
        className="text-[34px] leading-none text-[var(--accent)]"
        style={{ fontFamily: "Fraunces, serif" }}
      >
        {value}
      </p>
      <p className="mt-2 text-[13px] leading-[1.7] text-[var(--text-secondary)]">
        {label}
      </p>
    </div>
  );
}

function HandDrawnUnderline({ color = "coral" }: { color?: "coral" | "accent" }) {
  const stroke = color === "accent" ? "text-[var(--accent)]" : "text-[var(--coral)]";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 26"
      className={`pointer-events-none absolute -bottom-3 left-0 h-[18px] w-[110%] ${stroke}`}
      fill="none"
    >
      <path
        d="M6 15C36 22 66 20 93 18C113 16 132 12 154 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M18 21C47 24 87 24 148 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
