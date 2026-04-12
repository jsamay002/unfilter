"use client";

import { useEffect, useState } from "react";
import { SideNav } from "./SideNav";
import { TopHeader } from "./TopHeader";
import { TopNav } from "./TopNav";

const STORAGE_KEY = "unfilter-sidebar-open";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setSidebarOpen(stored === "true");
    }
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  // Don't flash the wrong sidebar state on first render
  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Mobile: TopNav placeholder */}
        <div className="md:hidden h-[56px] border-b border-[var(--border-light)] bg-[var(--bg-elevated)]" />
        {/* Desktop: TopHeader placeholder */}
        <div className="hidden md:block h-[48px] border-b border-[var(--border-light)] bg-[var(--bg-elevated)]" />
        <div className="flex flex-1">
          <div className="hidden md:block w-[240px] border-r border-[var(--border-light)] bg-[var(--bg-primary)]" />
          <main className="flex-1 px-5 py-6 md:px-10 md:py-10">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile navigation */}
      <div className="md:hidden">
        <TopNav />
      </div>

      {/* Desktop header */}
      <div className="hidden md:block">
        <TopHeader sidebarOpen={sidebarOpen} onToggle={toggleSidebar} />
      </div>

      <div className="flex flex-1 min-h-0">
        <SideNav isOpen={sidebarOpen} />

        <main className="flex-1 min-w-0 overflow-auto px-5 py-6 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
