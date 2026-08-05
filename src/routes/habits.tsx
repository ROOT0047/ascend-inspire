import { createFileRoute } from "@tanstack/react-router";
import { Check, Flame, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/ascend/app-shell";
import { PageHeading } from "@/components/ascend/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAscend } from "@/context/ascend";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/habits")({
  head: () => ({
    meta: [
      { title: "Habits — ASCEND" },
      {
        name: "description",
        content: "Daily, weekly and monthly habits with streaks, misses and 30-day consistency grids.",
      },
      { property: "og:title", content: "Habits — ASCEND" },
      { property: "og:description", content: "Build streaks. Track every miss honestly." },
    ],
  }),
  component: HabitsPage,
});

const filters = ["All", "Daily", "Weekly", "Monthly"] as const;

function HabitsPage() {
  const { habits, toggleHabit, addHabit } = useAscend();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const visible = habits.filter((h) => filter === "All" || h.cadence === filter);
  const done = habits.filter((h) => h.completedToday).length;

  function submit() {
    if (!title.trim()) {
      toast.error("Name the habit first");
      return;
    }
    addHabit({ title: title.trim(), cadence: "Daily", goal: 1, unit: "session" });
    toast.success("Habit added");
    setTitle("");
    setOpen(false);
  }

  return (
    <AppShell title="Habits">
      <PageHeading
        title="Consistency"
        subtitle={`${done} of ${habits.length} completed today`}
      />

      <div className="mb-5 flex gap-1.5 rounded-2xl border border-border bg-surface p-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-1 rounded-xl py-1.5 text-xs transition-colors",
              filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {visible.map((habit) => (
          <li key={habit.id} className="card-surface px-4 py-3.5">
            <div className="flex items-center gap-3">
              <button
                aria-label={`Toggle ${habit.title}`}
                onClick={() => toggleHabit(habit.id)}
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border transition-colors",
                  habit.completedToday
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Check className="size-4" strokeWidth={2.2} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{habit.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {habit.cadence} · goal {habit.goal} {habit.unit}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-warning">
                <Flame className="size-3.5" strokeWidth={2} />
                <span className="num text-sm">{habit.streak}</span>
              </div>
            </div>
            <div className="mt-3 flex gap-[3px]">
              {habit.history.map((hit, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    hit ? "bg-primary" : "bg-border",
                  )}
                />
              ))}
            </div>
            <p className="mt-2 text-[0.68rem] text-muted-foreground">
              Best streak <span className="num text-foreground">{habit.bestStreak}</span> days
            </p>
          </li>
        ))}
      </ul>

      <Button onClick={() => setOpen(true)} className="mt-5 w-full gap-2">
        <Plus className="size-4" strokeWidth={2} />
        Add habit
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="mx-auto max-w-md rounded-t-3xl border-border bg-surface">
          <SheetHeader>
            <SheetTitle>New habit</SheetTitle>
          </SheetHeader>
          <div className="space-y-1.5 px-4">
            <Label htmlFor="habit-title">Habit</Label>
            <Input
              id="habit-title"
              value={title}
              maxLength={60}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Read 30 minutes"
            />
          </div>
          <SheetFooter>
            <Button onClick={submit} className="w-full">
              Add habit
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
