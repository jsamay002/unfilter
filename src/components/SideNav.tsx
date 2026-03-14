"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import {
  IconHome,
  IconCamera,
  IconJournal,
  IconShield,
  IconBook,
  IconSparkle,
  IconHelp,
  IconSettings,
} from "@/components/icons";

const CORE_ITEMS = [
  { href: "/lab", label: "Distortion Lab", icon: IconCamera },
  { href: "/routine", label: "Barrier Safety", icon: IconShield },
  { href: "/journal", label: "Journal", icon: IconJournal },
];

const SUPPORT_ITEMS = [
  { href: "/check-in", label: "On-Device Insight", icon: IconSparkle },
  { href: "/learn", label: "Learn Hub", icon: IconBook },
  { href: "/help", label: "Skin Literacy Guide", icon: IconHelp },
];

const INFRA_ITEMS = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <aside className="hidden md:flex flex-col w-[240px] shrink-0 border-r border-[var(--border-light)] bg-[var(--bg-primary)] h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--accent)]">
            <span className="text-white text-[13px] font-bold" style={{ fontFamily: "Fraunces" }}>
              U
            </span>
          </div>
          <span className="text-display text-[18px] text-[var(--text-primary)]">
            Unfilter
          </span>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-[var(--border-light)]" />

      {/* Main nav */}
      <nav className="flex-1 px-3 pt-4 space-y-0.5 overflow-y-auto">
        <NavSection label="Core" items={CORE_ITEMS} pathname={pathname} />
        <NavSection label="Support" items={SUPPORT_ITEMS} pathname={pathname} />
        <NavSection label="" items={INFRA_ITEMS} pathname={pathname} />
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-2">
        {/* User + logout */}
        {user && (
          <div className="mx-1 rounded-[12px] bg-[var(--bg-secondary)] px-3.5 py-2.5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">
                  {user.username}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] truncate">
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-[10px] font-medium text-[var(--text-muted)] hover:text-[var(--coral)] transition shrink-0 ml-2"
              >
                Log out
              </button>
            </div>
          </div>
        )}

        {/* Privacy badge */}
        <div className="mx-1 rounded-[12px] border border-[var(--accent-light)] bg-[var(--accent-lighter)] px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <IconShield size={14} className="text-[var(--accent)] shrink-0" />
            <p className="text-[11px] font-medium text-[var(--accent-dark)]">
              100% On-Device
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

function NavSection({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div className="mb-2">
      {label && (
        <p className="px-3 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
          {label}
        </p>
      )}
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition-all ${
              active
                ? "bg-[var(--accent-light)] text-[var(--accent-dark)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Icon size={17} className={active ? "text-[var(--accent)]" : "text-[var(--text-muted)]"} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
