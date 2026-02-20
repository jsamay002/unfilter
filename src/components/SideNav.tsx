"use client";

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
];

const BOTTOM_ITEMS = [
  { href: "/help",     label: "Help",     icon: "💬" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-sand-200 bg-white/60 backdrop-blur-sm h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sage-600 text-white text-sm font-bold font-display">
            U
          </div>
          <span className="font-display text-lg font-semibold text-sand-900 tracking-tight">
            Unfilter
          </span>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-sage-50 text-sage-800"
                  : "text-sand-600 hover:bg-sand-50 hover:text-sand-800"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-sage-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sand-200 px-3 py-3 space-y-0.5">
        {BOTTOM_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-sage-50 text-sage-800"
                  : "text-sand-500 hover:bg-sand-50 hover:text-sand-700"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Privacy badge */}
        <div className="mt-3 mx-1 rounded-xl bg-sage-50 px-3 py-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sage-600">
            🔒 100% On-Device
          </p>
          <p className="text-[10px] text-sage-500 mt-0.5">
            Your data never leaves your phone
          </p>
        </div>
      </div>
    </aside>
  );
}
