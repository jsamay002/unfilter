"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Home page — landing screen with hero text and primary CTAs.
 * Detects a saved session in localStorage to offer "Resume Session."
 */
export default function Home() {
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("session:bronze:sample-1");
    setHasResume(!!saved);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Algo-Coach</h1>

      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
        Learn to think through competitive programming problems before you code.
        Build the reasoning loop that gets you past Bronze.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/library/bronze"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
        >
          Start Bronze
        </Link>

        {hasResume && (
          <Link
            href="/session/bronze/sample-1"
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-neutral-900 transition"
          >
            Resume Session
          </Link>
        )}
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left max-w-2xl">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <h3 className="font-semibold mb-1">Guided Reasoning</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Step-by-step prompts that build your problem-solving instincts.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <h3 className="font-semibold mb-1">Pattern Drills</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quick exercises to sharpen classification and strategy selection.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <h3 className="font-semibold mb-1">Track Progress</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            See sessions completed and identify areas to improve.
          </p>
        </div>
      </div>
    </div>
  );
}
