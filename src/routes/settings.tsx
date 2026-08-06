import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/ascend/app-shell";
import { PageHeading, SectionHeader } from "@/components/ascend/primitives";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ASCEND" },
      { name: "description", content: "Theme, notifications, privacy and account preferences for ASCEND." },
      { property: "og:title", content: "Settings — ASCEND" },
      { property: "og:description", content: "Theme, notifications and privacy preferences." },
    ],
  }),
  component: SettingsPage,
});

const toggles = [
  { id: "push_enabled", label: "Push notifications", detail: "Streaks, sessions and reviews" },
  { id: "voice_alerts_enabled", label: "Voice alerts", detail: "Spoken reminders for key blocks" },
  { id: "haptics_enabled", label: "Haptics", detail: "Feedback on completion" },
  {
    id: "journal_lock_enabled",
    label: "Private journal lock",
    detail: "Require unlock to open entries",
  },
] as const;

function SettingsPage() {
  const { user, profile } = useAuth();

  return (
    <AppShell title="Settings">
      <PageHeading title="Settings" subtitle={profile?.timezone ?? "UTC"} />

      <SectionHeader title="Preferences" />
      <ul className="card-surface divide-y divide-border overflow-hidden">
        {toggles.map((t) => (
          <li key={t.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{t.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.detail}</p>
            </div>
            <Switch checked={profile?.[t.id] ?? false} disabled aria-readonly />
          </li>
        ))}
      </ul>
      <Link
        to="/profile/edit"
        className="mt-2 block text-center text-xs text-primary transition-opacity hover:opacity-80"
      >
        Change preferences in profile editor
      </Link>

      <SectionHeader title="Account" className="mt-6" />
      <div className="card-surface divide-y divide-border overflow-hidden text-sm">
        <p className="flex items-center justify-between px-4 py-3.5">
          <span className="text-muted-foreground">Email</span>
          <span className="text-foreground">{user?.email}</span>
        </p>
        <p className="flex items-center justify-between px-4 py-3.5">
          <span className="text-muted-foreground">Theme</span>
          <span className="text-foreground">Tactical Dark</span>
        </p>
        <p className="flex items-center justify-between px-4 py-3.5">
          <span className="text-muted-foreground">Version</span>
          <span className="num text-foreground">0.1.0</span>
        </p>
      </div>
    </AppShell>
  );
}
