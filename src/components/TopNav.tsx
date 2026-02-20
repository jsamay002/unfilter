"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",          label: "Home",          icon: "🏠" },
  { href: "/check-in",  label: "Check-in",      icon: "📷" },
  { href: "/journal",   label: "Journal",        icon: "📓" },
  { href: "/routine",   label: "Routine",        icon: "🧴" },
  { href: "/learn",     label: "Learn",          icon: "📚" },
  { href: "/confidence", label: "Confidence",    icon: "✨" },
  { href: "/community", label: "Trusted Circle", icon: "👥" },
  { href: "/help",      label: "Help",           icon: "💬" },
  { href: "/settings",  label: "Settings",       icon: "⚙️" },
];

export function TopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="md:hidden sticky top-0 z-50 border-b border-sand-200 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage-600 text-white text-xs font-bold font-display">
            U
          </div>
          <span className="font-display text-base font-semibold text-sand-900 tracking-tight">
            Unfilter
          </span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sand-600 hover:bg-sand-100 transition"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="14" y2="14" />
              <line x1="14" y1="4" x2="4" y2="14" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="5" x2="15" y2="5" />
              <line x1="3" y1="9" x2="15" y2="9" />
              <line x1="3" y1="13" x2="15" y2="13" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="animate-fade-up border-t border-sand-100 bg-white px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-sage-50 text-sage-800"
                    : "text-sand-600 hover:bg-sand-50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
