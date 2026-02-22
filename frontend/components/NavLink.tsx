"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  label: string;
};

/**
 * NavLink — active-aware navigation link.
 * Highlights when the current path matches or starts with the href.
 * Used inside the AppShell top nav bar.
 */
export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();

  // Exact match for "/" (Home), prefix match for everything else
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-neutral-800"
      }`}
    >
      {label}
    </Link>
  );
}
