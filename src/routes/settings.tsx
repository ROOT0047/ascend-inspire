import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/ascend/app-shell";
import { PageHeading, SectionHeader } from "@/components/ascend/primitives";
import { Switch } from "@/components/ui/switch";
import { profile } from "@/data/mock";

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
  { id: "push", label: "Push notifications", detail: "Streaks, sessions and reviews" },
  { id: "voice", label: "Voice alerts", detail: "Spoken reminders for key blocks" },
  { id: "haptics", label: "Haptics", detail: "Feedback on completion" },
  { id: "private", label: "Private journal lock", detail: "Require unlock to open entries" },
];

function SettingsPage() {
  const [state, setState] = useState<Record<string, boolean>>({
    push: true,
    voice: true,
    haptics: true,
    private: false,
  });

  return (
    <AppShell title="Settings">
      <PageHeading title="Settings" subtitle={profile.timezone} />

      <SectionHeader title="Preferences" />
      <ul className="card-surface divide-y divide-border overflow-hidden">
        {toggles.map((t) => (
          <li key={t.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{t.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.detail}</p>
            </div>
            <Switch
              checked={state[t.id] ?? false}
              onCheckedChange={(v) => setState((p) => ({ ...p, [t.id]: v }))}
            />
          </li>
        ))}
      </ul>

      <SectionHeader title="Account" className="mt-6" />
      <div className="card-surface divide-y divide-border overflow-hidden text-sm">
        <p className="flex items-center justify-between px-4 py-3.5">
          <span className="text-muted-foreground">Email</span>
          <span className="text-foreground">{profile.email}</span>
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
