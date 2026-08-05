import { createFileRoute } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/ascend/app-shell";
import { PageHeading } from "@/components/ascend/primitives";
import { Switch } from "@/components/ui/switch";
import { reminders as seed } from "@/data/mock";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — ASCEND" },
      { name: "description", content: "Smart wake-up, workout, hydration and journal reminders with voice alerts." },
      { property: "og:title", content: "Reminders — ASCEND" },
      { property: "og:description", content: "Smart, voice-enabled nudges at the right hour." },
    ],
  }),
  component: RemindersPage,
});

function RemindersPage() {
  const [items, setItems] = useState(seed);

  return (
    <AppShell title="Reminders">
      <PageHeading title="Nudges" subtitle="Alerts that protect the routine." />
      <ul className="card-surface divide-y divide-border overflow-hidden">
        {items.map((r) => (
          <li key={r.id} className="flex items-center gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm text-foreground">
                {r.title}
                {r.voice ? <Mic className="size-3.5 text-primary" strokeWidth={1.75} /> : null}
              </p>
              <p className="num mt-0.5 text-xs text-muted-foreground">
                {r.time} · {r.repeat}
              </p>
            </div>
            <Switch
              checked={r.enabled}
              onCheckedChange={(v) =>
                setItems((prev) => prev.map((i) => (i.id === r.id ? { ...i, enabled: v } : i)))
              }
            />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
