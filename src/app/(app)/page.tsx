"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";

const QUICK_ACTIONS = [
  {
    href: "/check-in",
    icon: "📷",
    title: "New Check-in",
    desc: "Get guidance on a skin concern",
    color: "bg-sage-50 border-sage-200 hover:border-sage-300",
  },
  {
    href: "/journal",
    icon: "📓",
    title: "Skin Journal",
    desc: "Track your progress over time",
    color: "bg-sand-50 border-sand-200 hover:border-sand-300",
  },
  {
    href: "/routine",
    icon: "🧴",
    title: "Routine Builder",
    desc: "Build a safe, simple routine",
    color: "bg-coral-50 border-coral-200 hover:border-coral-300",
  },
  {
    href: "/learn",
    icon: "📚",
    title: "Learn Hub",
    desc: "Myth-busting & ingredient guides",
    color: "bg-sage-50 border-sage-200 hover:border-sage-300",
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        {/* Greeting */}
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-2xl font-bold text-sand-900 tracking-tight">
            Welcome to Unfilter
          </h1>
          <p className="mt-1 text-sm text-sand-500">
            Your private skin health + confidence coach. No filters, no
            judgment — just guidance.
          </p>
        </div>

        {/* Quick actions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {QUICK_ACTIONS.map((action, i) => (
            <Link
              key={action.href}
              href={action.href}
              className={`card border p-4 transition-all hover:shadow-md ${action.color} animate-fade-up`}
              style={{ animationDelay: `${i * 70}ms`, animationFillMode: "both" }}
            >
              <span className="text-2xl">{action.icon}</span>
              <h3 className="mt-2 font-display text-sm font-semibold text-sand-900">
                {action.title}
              </h3>
              <p className="mt-0.5 text-xs text-sand-500">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Privacy reminder */}
        <div className="card border border-sage-200 bg-sage-50 p-4 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
          <div className="flex items-start gap-3">
            <span className="text-lg">🔒</span>
            <div>
              <h3 className="text-sm font-semibold text-sage-800">
                Your privacy comes first
              </h3>
              <p className="mt-0.5 text-xs text-sage-600 leading-relaxed">
                Everything runs on your device. Photos are never uploaded. Data
                auto-deletes unless you choose to save it. No accounts, no
                tracking, no ads.
              </p>
            </div>
          </div>
        </div>

        {/* Educational disclaimer */}
        <p className="mt-6 text-center text-[11px] text-sand-400 leading-relaxed max-w-sm mx-auto">
          Unfilter provides educational guidance only — not medical diagnosis.
          Always talk to a healthcare provider for medical concerns.
        </p>
      </div>
    </AppShell>
  );
}
