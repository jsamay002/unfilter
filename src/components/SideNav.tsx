"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconCamera,
  IconJournal,
  IconShield,
  IconBook,
  IconSparkle,
  IconHelp,
  IconSettings,
  IconFlame,
  IconSearch,
  IconUsers,
} from "@/components/icons";

/* ---------- Navigation structure ---------- */

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

const MAIN: NavItem[] = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/lab", label: "Distortion Lab", icon: IconCamera },
  { href: "/detector", label: "Filter Detector", icon: IconSearch },
  { href: "/reality-check", label: "Reality Check", icon: IconFlame },
  { href: "/check-in", label: "Check-In", icon: IconSparkle },
];

const TOOLS: NavItem[] = [
  { href: "/routine", label: "Routine Safety", icon: IconShield },
  { href: "/journal", label: "Journal", icon: IconJournal },
  { href: "/confidence", label: "Confidence", icon: IconSparkle },
];

const RESOURCES: NavItem[] = [
  { href: "/learn", label: "Learn", icon: IconBook },
  { href: "/help", label: "Skin Guide", icon: IconHelp },
  { href: "/community", label: "Trusted Circle", icon: IconUsers },
];

interface SideNavProps {
  isOpen: boolean;
}

export function SideNav({ isOpen }: SideNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <aside className="hidden md:flex flex-col w-[240px] shrink-0 border-r border-[var(--border-light)] bg-[var(--bg-primary)] sticky top-[48px] h-[calc(100vh-48px)] overflow-y-auto">

      <nav className="flex-1 px-3 pt-4 pb-2">
        {/* Main */}
        <div className="mb-1">
          {MAIN.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        <Divider />

        {/* Tools */}
        <div className="mb-1">
          <SectionLabel text="Tools" />
          {TOOLS.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        <Divider />

        {/* Resources */}
        <div className="mb-1">
          <SectionLabel text="Resources" />
          {RESOURCES.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </div>

        <Divider />

        {/* Settings — right after resources, not buried at the bottom */}
        <div className="mb-1">
          <NavLink
            item={{ href: "/settings", label: "Settings", icon: IconSettings }}
            pathname={pathname}
          />
        </div>
      </nav>

      {/* Bottom tagline */}
      <div className="px-4 pb-4 pt-3 border-t border-[var(--border-light)]">
        <div className="flex items-center gap-2">
          <IconShield size={11} className="text-[var(--accent)] shrink-0" />
          <p className="text-[10px] text-[var(--text-muted)]">Nothing leaves your device.</p>
        </div>
      </div>
    </aside>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-2.5 rounded-[10px] px-3 py-[8px] text-[13.5px] font-medium transition-all duration-150 ${
        active
          ? "bg-[var(--accent-light)] text-[var(--accent-dark)] font-semibold"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[var(--accent)] transition-all" />
      )}
      <Icon
        size={16}
        className={`transition-colors duration-150 ${active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}
      />
      <span>{item.label}</span>
    </Link>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
      {text}
    </p>
  );
}

function Divider() {
  return <div className="mx-3 my-2 h-px bg-[var(--border-light)]" />;
}
