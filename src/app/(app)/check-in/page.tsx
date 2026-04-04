import { AppShell } from "@/components/AppShell";
import { OnboardingGate } from "@/components/OnboardingGate";
import CheckInWizard from "@/features/checkin/CheckInWizard";

export default function CheckInPage() {
  return (
    <OnboardingGate>
      <AppShell>
        <CheckInWizard />
      </AppShell>
    </OnboardingGate>
  );
}
