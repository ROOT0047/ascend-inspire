import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Dumbbell, Footprints, Moon } from "lucide-react";
import { AppShell } from "@/components/ascend/app-shell";
import { Meter, PageHeading, SectionHeader, StatTile } from "@/components/ascend/primitives";
import { Button } from "@/components/ui/button";
import { useAscend } from "@/context/ascend";
import { healthStats } from "@/data/mock";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Health — ASCEND" },
      { name: "description", content: "Water, sleep, steps, weight and workout tracking in one view." },
      { property: "og:title", content: "Health — ASCEND" },
      { property: "og:description", content: "Sleep, hydration and training are the inputs." },
    ],
  }),
  component: HealthPage,
});

function HealthPage() {
  const { water, sleep, addWater } = useAscend();

  return (
    <AppShell title="Health">
      <PageHeading title="Body" subtitle="Inputs first. Output follows." />

      <section className="card-surface px-4 py-4">
        <div className="flex items-center gap-2">
          <Droplets className="size-4 text-secondary" strokeWidth={1.75} />
          <p className="text-sm text-foreground">Hydration</p>
          <span className="num ml-auto text-sm text-muted-foreground">
            {(water / 1000).toFixed(1)} / {(healthStats.waterGoal / 1000).toFixed(1)} L
          </span>
        </div>
        <Meter value={water} max={healthStats.waterGoal} tone="secondary" className="mt-3" />
        <div className="mt-3 flex gap-2">
          {[250, 500, 750].map((ml) => (
            <Button key={ml} variant="outline" className="flex-1" onClick={() => addWater(ml)}>
              +{ml} ml
            </Button>
          ))}
        </div>
      </section>

      <section className="card-surface mt-4 px-4 py-4">
        <div className="flex items-center gap-2">
          <Moon className="size-4 text-primary" strokeWidth={1.75} />
          <p className="text-sm text-foreground">Sleep</p>
          <span className="num ml-auto text-sm text-muted-foreground">
            {sleep}h / {healthStats.sleepGoal}h
          </span>
        </div>
        <Meter value={sleep} max={healthStats.sleepGoal} className="mt-3" />
      </section>

      <SectionHeader title="This week" className="mt-6" />
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Steps" value={healthStats.steps.toLocaleString()} icon={Footprints} />
        <StatTile
          label="Workouts"
          value={`${healthStats.workoutsThisWeek}`}
          suffix="/7"
          tone="success"
          icon={Dumbbell}
        />
        <StatTile label="Weight" value={`${healthStats.weight}`} suffix="kg" />
        <StatTile label="Calories" value={`${healthStats.calories}`} suffix="kcal" tone="warning" />
      </div>
    </AppShell>
  );
}
