import { createFileRoute } from "@tanstack/react-router";
import { Check, Plus } from "lucide-react";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAscend } from "@/context/ascend";
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

const week = [
  { day: "Mon", date: 18 },
  { day: "Tue", date: 19 },
  { day: "Wed", date: 20 },
  { day: "Thu", date: 21 },
  { day: "Fri", date: 22 },
  { day: "Sat", date: 23 },
  { day: "Sun", date: 24 },
];

const dotColor: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

function SchedulePage() {
  const { schedule, toggleBlock, addBlock } = useAscend();
  const [selected, setSelected] = useState(21);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");

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
      durationLabel: `${start}–${end}`,
      priority: "Medium",
      color: "primary",
    });
    toast.success("Block added to today");
    setTitle("");
    setOpen(false);
  }

  return (
    <AppShell title="Schedule">
      <PageHeading title="May 2026" subtitle="Thursday, 21 May" />

      <div className="-mx-1 mb-6 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {week.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelected(d.date)}
            className={cn(
              "flex min-w-[3.1rem] flex-col items-center gap-1 rounded-2xl border px-2 py-2.5 transition-colors",
              selected === d.date
                ? "border-primary bg-primary-soft text-foreground"
                : "border-border bg-surface text-muted-foreground",
            )}
          >
            <span className="text-[0.62rem] uppercase tracking-wider">{d.day}</span>
            <span className="num text-sm">{d.date}</span>
          </button>
        ))}
      </div>

      <ol className="relative space-y-2 pl-[3.6rem]">
        <span aria-hidden className="absolute left-[3.1rem] top-2 bottom-2 w-px bg-border" />
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
              </div>
            </li>
          );
        })}
      </ol>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Add time block"
          className="fixed bottom-24 left-1/2 z-30 ml-[7.5rem] grid size-13 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--glow-primary)] transition-transform active:scale-95"
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
