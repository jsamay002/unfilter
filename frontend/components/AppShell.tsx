"use client";

import NavLink from "./NavLink";

type AppShellProps = {
  children: React.ReactNode;
};

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/drills", label: "Drills" },
  { href: "/progress", label: "Progress" },
  { href: "/settings", label: "Settings" },
];

/**
 * AppShell — persistent layout wrapper for the entire app.
 *
 * Provides:
 * 1. Sticky top navigation bar with the 5 primary tabs
 * 2. Centered content container (max-w-4xl) with consistent padding
 * 3. Branding in the nav (logo/title)
 *
 * Every page renders inside {children} without needing its own
 * <main> wrapper, padding, or max-width — AppShell handles it.
 */
export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Brand */}
          <span className="text-lg font-bold tracking-tight select-none">
            Algo-Coach
          </span>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
