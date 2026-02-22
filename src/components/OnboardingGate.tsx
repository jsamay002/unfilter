"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useOnboardingStore } from "@/features/onboarding/store";

/**
 * Wrap this around page content to gate access behind onboarding.
 * First-time users → /onboarding
 * Returning users → pass through
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useOnboardingStore((s) => s.profile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Don't redirect if already on the onboarding page
    if (pathname === "/onboarding") {
      setReady(true);
      return;
    }

    // Zustand persist is async — wait for hydration
    // Check if onboarding is complete
    if (!profile.onboardingComplete) {
      router.replace("/onboarding");
    } else {
      setReady(true);
    }
  }, [profile.onboardingComplete, pathname, router]);

  // Show nothing while checking (prevents flash)
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand-50">
        <div className="h-8 w-8 rounded-full bg-sage-200 animate-pulse" />
      </div>
    );
  }

  return <>{children}</>;
}
