import { AppShell } from "@/components/AppShell";
import CheckInWizard from "@/features/checkin/CheckInWizard";

export default function CheckInPage() {
  return (
    <AppShell>
      <CheckInWizard />
    </AppShell>
  );
}
