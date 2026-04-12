"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ============================================================
// Landing Page — "The Reveal"
//
// The page itself demonstrates unfiltering. Sections move from
// blurred/distorted to sharp/real. The visitor experiences the
// product's core idea just by scrolling.
// ============================================================

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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ---- Interactive before/after slider ----

function FilterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      handleMove(clientX);
    };
    const onUp = () => { dragging.current = false; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="landing-slider relative aspect-[4/5] sm:aspect-[3/4] w-full max-w-[420px] mx-auto rounded-[24px] overflow-hidden cursor-col-resize select-none touch-none"
      onMouseDown={(e) => { dragging.current = true; handleMove(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; handleMove(e.touches[0].clientX); }}
    >
      {/* "Filtered" side — full background */}
      <div className="absolute inset-0 landing-face-filtered" />

      {/* "Real" side — clipped by slider position */}
      <div
        className="absolute inset-0 landing-face-real"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white/80 z-10"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 10L3 10M3 10L5.5 7.5M3 10L5.5 12.5" stroke="#2a231c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 10L17 10M17 10L14.5 7.5M17 10L14.5 12.5" stroke="#2a231c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/90">Filtered</span>
      </div>
      <div className="absolute bottom-4 right-4 z-10 rounded-full bg-white/80 backdrop-blur-sm px-3 py-1.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#2a231c]">Real</span>
      </div>
    </div>
  );
}

// ---- Scroll-aware counter ----

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// ---- Main page ----

export default function LandingPage() {
  useAOS();

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* ---- NAV ---- */}
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

      {/* ============================================================
          HERO — Split: bold copy left, interactive demo right
          ============================================================ */}
      <section className="relative bg-[var(--bg-primary)]">
        {/* Subtle mesh */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(194,88,64,0.06), transparent 70%), radial-gradient(ellipse 50% 60% at 80% 70%, rgba(107,127,94,0.05), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            {/* Left — copy */}
            <div>
              <p
                data-aos="fade-up"
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--coral)]/30 bg-[var(--coral-light)] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--coral)]"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--coral)] animate-pulse" />
                Built by a teen, for teens
              </p>

              <h1
                data-aos="fade-up"
                data-aos-delay="100"
                className="text-display text-[clamp(36px,6.5vw,72px)] leading-[0.95] text-[var(--text-primary)]"
              >
                Every filter
                <br />
                is a <span className="relative inline-block">
                  lie
                  <svg aria-hidden="true" viewBox="0 0 100 14" className="absolute -bottom-1 left-0 w-full h-[14px] text-[var(--coral)]" fill="none" preserveAspectRatio="none">
                    <path d="M2 8C20 3 45 2 55 5C65 8 80 11 98 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M5 11C30 6 60 5 95 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </span>
                <span className="text-[var(--text-muted)]">.</span>
                <br />
                <span className="text-[var(--accent)]">See through it.</span>
              </h1>

              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="mt-7 max-w-lg text-[17px] leading-[1.8] text-[var(--text-secondary)]"
              >
                Unfilter shows you what beauty filters actually change, lets you
                check in with your real skin privately, and helps you notice
                patterns over time. No cloud uploads. No diagnosis. No shame.
              </p>

              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href="/signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-[14px] bg-[var(--accent)] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[var(--accent-dark)] hover:shadow-lg hover:shadow-[var(--accent)]/15"
                >
                  Start for free
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M3 8h10m0 0L9.5 4.5M13 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-[14px] border border-[var(--border)] px-6 py-3.5 text-[15px] font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]"
                >
                  Sign in
                </Link>
              </div>

              {/* Trust chips */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="mt-8 flex flex-wrap gap-4 text-[12px] text-[var(--text-tertiary)]"
              >
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  On-device by default
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
                  Educational, not clinical
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  Zero shame design
                </span>
              </div>
            </div>

            {/* Right — interactive before/after */}
            <div data-aos="fade-left" data-aos-delay="200">
              <FilterSlider />
              <p className="mt-4 text-center text-[13px] text-[var(--text-muted)] italic" style={{ fontFamily: "Fraunces, serif" }}>
                Drag to see what filters hide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          STAT STRIP — Full-width, dark, punchy
          ============================================================ */}
      <section className="landing-stat-strip border-y border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: 80, suffix: "%", label: "of teens see filtered faces daily" },
              { value: 10000, suffix: "+", label: "beauty filters on Instagram alone" },
              { value: 0, suffix: "", label: "photos uploaded to any server" },
              { value: 100, suffix: "%", label: "on-device. Always." },
            ].map((stat, i) => (
              <div key={stat.label} data-aos="fade-up" data-aos-delay={String(i * 80)} className="text-center md:text-left">
                <p
                  className="text-[clamp(32px,5vw,48px)] font-semibold leading-none text-[var(--text-primary)]"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-[13px] leading-snug text-[var(--text-tertiary)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          WHAT IT DOES — Alternating feature blocks (no cards)
          ============================================================ */}
      <section className="px-6 py-20 md:py-28 bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-6xl">
          <div data-aos="fade-up" className="mb-16 max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--accent)] mb-3">
              How it works
            </p>
            <h2 className="text-display text-[clamp(28px,4vw,44px)] text-[var(--text-primary)] leading-[1.05]">
              What Unfilter actually does.
            </h2>
          </div>

          <div className="space-y-20 md:space-y-28">
            {/* Feature 1 — Expose */}
            <div data-aos="fade-up" className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--coral-light)] text-[var(--coral)] text-[14px] font-bold" style={{ fontFamily: "Fraunces, serif" }}>1</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--coral)]">Expose Distortion</span>
                </div>
                <h3 className="text-[clamp(22px,3vw,30px)] font-semibold leading-[1.15] text-[var(--text-primary)] mb-4">
                  Shows you what filters actually change
                </h3>
                <p className="text-[15px] leading-[1.8] text-[var(--text-secondary)] max-w-md">
                  The Distortion Lab and Filter Detector show you what beauty filters
                  actually do. Smoothed pores, reshaped jaws, faked lighting. Once you
                  see the tricks, filtered skin stops looking normal.
                </p>
              </div>
              <div className="landing-feature-visual landing-feature-expose rounded-[20px] aspect-[4/3] overflow-hidden" />
            </div>

            {/* Feature 2 — Reflect */}
            <div data-aos="fade-up" className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="md:order-2">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-[14px] font-bold" style={{ fontFamily: "Fraunces, serif" }}>2</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">Reflect Honestly</span>
                </div>
                <h3 className="text-[clamp(22px,3vw,30px)] font-semibold leading-[1.15] text-[var(--text-primary)] mb-4">
                  Private skin check-ins, no judgment
                </h3>
                <p className="text-[15px] leading-[1.8] text-[var(--text-secondary)] max-w-md">
                  Quick check-ins with no judgment. Your photo never leaves the device.
                  See how your skin actually changes over days and weeks instead of
                  how a filter makes it look.
                </p>
              </div>
              <div className="md:order-1 landing-feature-visual landing-feature-reflect rounded-[20px] aspect-[4/3] overflow-hidden" />
            </div>

            {/* Feature 3 — Protect */}
            <div data-aos="fade-up" className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold-light)] text-[var(--gold)] text-[14px] font-bold" style={{ fontFamily: "Fraunces, serif" }}>3</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--gold)]">Stay Private</span>
                </div>
                <h3 className="text-[clamp(22px,3vw,30px)] font-semibold leading-[1.15] text-[var(--text-primary)] mb-4">
                  Nothing leaves your phone
                </h3>
                <p className="text-[15px] leading-[1.8] text-[var(--text-secondary)] max-w-md">
                  Photos, routines, and journals all stay on your device.
                  No cloud uploads, no ad profiles, no skin data getting sold.
                  Privacy is the whole point.
                </p>
              </div>
              <div className="landing-feature-visual landing-feature-protect rounded-[20px] aspect-[4/3] overflow-hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FULL-BLEED QUOTE — Typographic break, no cards
          ============================================================ */}
      <section className="landing-quote-section border-y border-[var(--border-light)] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <blockquote
            data-aos="fade-up"
            className="text-display text-[clamp(24px,4vw,42px)] leading-[1.2] text-[var(--text-primary)]"
          >
            &ldquo;I built this because I watched my friends
            <span className="relative inline-block mx-1">
              hate their skin
              <svg aria-hidden="true" viewBox="0 0 180 70" className="pointer-events-none absolute -left-3 -top-3 h-[145%] w-[122%] text-[var(--coral)]" fill="none">
                <path d="M16 37C16 19 44 8 85 8C126 8 162 19 162 36C162 55 132 62 87 62C42 62 13 53 16 37Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            based on images that
            <em className="text-[var(--accent)]"> weren&apos;t even real</em>.&rdquo;
          </blockquote>
          <p data-aos="fade-up" data-aos-delay="100" className="mt-6 text-[14px] text-[var(--text-tertiary)]">
            The developer, 14 years old
          </p>
        </div>
      </section>

      {/* ============================================================
          CTA — Final, focused
          ============================================================ */}
      <section className="px-6 pb-20 pt-4 md:pb-28">
        <div
          data-aos="fade-up"
          className="landing-cta mx-auto max-w-4xl rounded-[28px] px-6 py-14 text-center md:px-12 md:py-20 relative overflow-hidden"
        >
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "128px 128px",
          }} />

          <div className="relative z-10">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Congressional App Challenge 2026
            </p>
            <h2 className="text-display text-[clamp(28px,4.5vw,44px)] leading-[1.06] text-[var(--text-primary)]">
              Stop comparing.
              <br />
              Start seeing.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.8] text-[var(--text-secondary)]">
              Unfilter is free, private, and built by a teenager who got tired
              of watching filtered skin become everyone&apos;s standard.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 rounded-[14px] bg-[var(--accent)] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[var(--accent-dark)] hover:shadow-lg hover:shadow-[var(--accent)]/15"
              >
                Create your account
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M3 8h10m0 0L9.5 4.5M13 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-[14px] border border-[var(--border)] px-7 py-3.5 text-[15px] font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-card)]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-[var(--border-light)] px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-[11px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>Unfilter · Privacy-first skin literacy for teens</p>
          <p>Educational guidance only · Not medical advice</p>
        </div>
      </footer>
    </main>
  );
}
