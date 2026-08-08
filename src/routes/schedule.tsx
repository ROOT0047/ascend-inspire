import { createFileRoute } from "@tanstack/react-router";
import { Check, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { isoDate, useAscend } from "@/context/ascend";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — ASCEND" },
      {
        name: "description",
        content: "Time-blocked daily planner with priorities, recurring blocks and color labels.",
      },
      { property: "og:title", content: "Schedule — ASCEND" },
      { property: "og:description", content: "Plan the day in blocks and hold the line." },
    ],
  }),
  component: SchedulePage,
});

const dotColor: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

function SchedulePage() {
  const { schedule, toggleBlock, addBlock, deleteBlock, selectedDate, setSelectedDate, loading } =
    useAscend();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");

  const week = useMemo(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        iso: isoDate(d),
        day: d.toLocaleDateString(undefined, { weekday: "short" }),
        date: d.getDate(),
      };
    });
  }, []);

  const selectedLabel = useMemo(() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    return new Date(y!, m! - 1, d!);
  }, [selectedDate]);

  const current = schedule.find((b) => !b.completed);

  function submit() {
    if (!title.trim()) {
      toast.error("Give the block a name");
      return;
    }
    addBlock({
      title: title.trim(),
      description: "Added from the planner",
      startTime: start,
      endTime: end,
      priority: "Medium",
      color: "primary",
    });
    toast.success("Block added");
    setTitle("");
    setOpen(false);
  }

  return (
    <AppShell title="Schedule">
      <PageHeading
        title={selectedLabel.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        subtitle={selectedLabel.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      />

      <div className="-mx-1 mb-6 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {week.map((d) => (
          <button
            key={d.iso}
            onClick={() => setSelectedDate(d.iso)}
            className={cn(
              "flex min-w-[3.1rem] flex-col items-center gap-1 rounded-2xl border px-2 py-2.5 transition-colors",
              selectedDate === d.iso
                ? "border-primary bg-primary-soft text-foreground"
                : "border-border bg-surface text-muted-foreground",
            )}
          >
            <span className="text-[0.62rem] uppercase tracking-wider">{d.day}</span>
            <span className="num text-sm">{d.date}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-xs tracking-[0.24em] text-muted-foreground">LOADING…</p>
      ) : schedule.length === 0 ? (
        <div className="card-surface px-5 py-8 text-center">
          <p className="text-sm text-foreground">No blocks planned</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add your first time block for this day.
          </p>
        </div>
      ) : null}

      <ol className="relative space-y-2 pb-8 pl-[3.6rem]">
        {schedule.length ? (
          <span aria-hidden className="absolute left-[3.1rem] top-2 bottom-2 w-px bg-border" />
        ) : null}
        {schedule.map((block) => {
          const isCurrent = current?.id === block.id;
          return (
            <li key={block.id} className="relative">
              <span className="num absolute -left-[3.6rem] top-4 w-11 text-right text-xs text-muted-foreground">
                {block.startTime}
              </span>
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[0.79rem] top-[1.35rem] size-2.5 rounded-full ring-4 ring-background",
                  block.completed ? "bg-success" : dotColor[block.color],
                )}
              />
              <div
                className={cn(
                  "card-surface flex items-center gap-3 px-4 py-3",
                  isCurrent && "border-primary shadow-[var(--glow-primary)]",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm",
                      block.completed ? "text-muted-foreground line-through" : "text-foreground",
                    )}
                  >
                    {block.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {block.durationLabel} · {block.priority}
                  </p>
                </div>
                <button
                  aria-label={block.completed ? "Mark incomplete" : "Mark complete"}
                  onClick={() => toggleBlock(block.id)}
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border transition-colors",
                    block.completed
                      ? "border-success bg-success/15 text-success"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Check className="size-4" strokeWidth={2} />
                </button>
                <button
                  aria-label={`Delete ${block.title}`}
                  onClick={() => deleteBlock(block.id)}
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Add time block"
          className="fixed bottom-24 right-5 z-30 grid size-13 md:right-[calc(50%-11rem)] place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--glow-primary)] transition-transform active:scale-95"
        >
          <Plus className="size-5.5" strokeWidth={2} />
        </SheetTrigger>
        <SheetContent side="bottom" className="mx-auto max-w-md rounded-t-3xl border-border bg-surface">
          <SheetHeader>
            <SheetTitle>New time block</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 px-4">
            <div className="space-y-1.5">
              <Label htmlFor="block-title">Title</Label>
              <Input
                id="block-title"
                value={title}
                maxLength={60}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Deep work"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="block-start">Start</Label>
                <Input
                  id="block-start"
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="block-end">End</Label>
                <Input
                  id="block-end"
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={submit} className="w-full">
              Add block
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
