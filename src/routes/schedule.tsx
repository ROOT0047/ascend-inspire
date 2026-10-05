import { createFileRoute } from "@tanstack/react-router";
import { Check, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { scheduleTemplates } from "@/data/templates";
import { cn } from "@/lib/utils";

type ScheduleSearch = { date?: string; block?: string };

export const Route = createFileRoute("/schedule")({
  validateSearch: (search: Record<string, unknown>): ScheduleSearch => {
    const out: ScheduleSearch = {};
    if (typeof search['date'] === "string") out.date = search['date'];
    if (typeof search['block'] === "string") out.block = search['block'];
    return out;
  },
  head: () => ({
    meta: [
      { title: "Schedule — AROHA" },
      {
        name: "description",
        content: "Time-blocked daily planner with priorities, recurring blocks and color labels.",
      },
      { property: "og:title", content: "Schedule — AROHA" },
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
  const { schedule, toggleBlock, addBlock, deleteBlock, selectedDate, setSelectedDate, loading, weekPlan } =
    useAscend();
  const { date: dateParam, block: blockParam } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [open, setOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const focusRef = useRef<HTMLLIElement | null>(null);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [weeks, setWeeks] = useState(1);

  const week = weekPlan;
  const weekTotals = useMemo(
    () =>
      week.reduce(
        (acc, d) => ({ total: acc.total + d.total, done: acc.done + d.done }),
        { total: 0, done: 0 },
      ),
    [week],
  );

  const selectedLabel = useMemo(() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    return new Date(y!, m! - 1, d!);
  }, [selectedDate]);

  const current = schedule.find((b) => !b.completed);
  const focusedBlock = focusedId ? schedule.find((b) => b.id === focusedId) : undefined;

  // Deep link from a notification tap: jump to the right day…
  useEffect(() => {
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) && dateParam !== selectedDate) {
      setSelectedDate(dateParam);
    }
  }, [dateParam, selectedDate, setSelectedDate]);

  // …then focus the exact block once that day's data is in.
  useEffect(() => {
    if (!blockParam) return;
    if (!schedule.some((b) => b.id === blockParam)) return;
    setFocusedId(blockParam);
  }, [blockParam, schedule]);

  useEffect(() => {
    if (focusedId && focusRef.current) {
      focusRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusedId]);

  function clearFocus() {
    setFocusedId(null);
    if (dateParam || blockParam) {
      void navigate({ to: "/schedule", search: {}, replace: true });
    }
  }

  function submit() {
    if (!title.trim()) {
      toast.error("Give the block a name");
      return;
    }
    addBlock(
      {
        title: title.trim(),
        description: "Added from the planner",
        startTime: start,
        endTime: end,
        priority: "Medium",
        color: "primary",
      },
      repeatDays.length ? { weekdays: repeatDays, weeks } : undefined,
    );
    toast.success(
      repeatDays.length
        ? `Planned on ${repeatDays.length} day${repeatDays.length > 1 ? "s" : ""} × ${weeks} week${weeks > 1 ? "s" : ""}`
        : "Block added",
    );
    setTitle("");
    setRepeatDays([]);
    setWeeks(1);
    setOpen(false);
  }

  function applyTemplate(templateId: string) {
    const template = scheduleTemplates.find((t) => t.id === templateId);
    if (!template) return;
    for (const b of template.blocks) {
      addBlock({
        title: b.title,
        description: b.description,
        startTime: b.startTime,
        endTime: b.endTime,
        priority: b.priority,
        color: b.color,
      });
    }
    toast.success(
      `${template.name} template added — ${template.blocks.length} blocks planned for this day`,
    );
    setTemplatesOpen(false);
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
              "flex min-w-[3.1rem] flex-col items-center gap-1 rounded-2xl border px-2 py-2 transition-colors",
              selectedDate === d.iso
                ? "border-primary bg-primary-soft text-foreground"
                : "border-border bg-surface text-muted-foreground",
            )}
          >
            <span className="text-[0.62rem] uppercase tracking-wider">{d.day}</span>
            <span className="num text-sm">{d.date}</span>
            <span
              className={cn(
                "num rounded-full px-1.5 text-[0.58rem] leading-4",
                d.total === 0
                  ? "text-muted-foreground/60"
                  : d.done === d.total
                    ? "bg-success/15 text-success"
                    : "bg-primary/12 text-primary",
              )}
            >
              {d.total ? `${d.done}/${d.total}` : "—"}
            </span>
          </button>
        ))}
      </div>

      <div className="card-surface mb-5 flex items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">This week</p>
          <p className="mt-0.5 text-sm text-foreground">
            <span className="num">{weekTotals.done}</span> of{" "}
            <span className="num">{weekTotals.total}</span> blocks done
          </p>
        </div>
        <span className="num text-lg text-primary">
          {weekTotals.total ? Math.round((weekTotals.done / weekTotals.total) * 100) : 0}%
        </span>
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
          const isFocused = focusedId === block.id;
          return (
            <li key={block.id} className="relative" ref={isFocused ? focusRef : undefined}>
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
                  isFocused && "border-primary ring-2 ring-primary/40",
                )}
              >
                <button
                  type="button"
                  onClick={() => setFocusedId(block.id)}
                  className="min-w-0 flex-1 text-left"
                >
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
                </button>
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

      <Sheet open={Boolean(focusedBlock)} onOpenChange={(v) => (v ? null : clearFocus())}>
        <SheetContent side="bottom" className="mx-auto max-w-md rounded-t-3xl border-border bg-surface">
          <SheetHeader>
            <SheetTitle>{focusedBlock?.title ?? "Block"}</SheetTitle>
          </SheetHeader>
          {focusedBlock ? (
            <div className="space-y-4 px-4">
              <p className="num text-sm text-muted-foreground">
                {selectedLabel.toLocaleDateString(undefined, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                · {focusedBlock.startTime} — {focusedBlock.endTime}
              </p>
              <p className="text-sm text-foreground">
                {focusedBlock.description || "No notes for this block."}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border px-2.5 py-1">
                  {focusedBlock.priority} priority
                </span>
                <span className="rounded-full border border-border px-2.5 py-1">
                  {focusedBlock.durationLabel}
                </span>
                <span className="rounded-full border border-border px-2.5 py-1">
                  {focusedBlock.completed ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
          ) : null}
          <SheetFooter className="gap-2">
            <Button
              onClick={() => {
                if (focusedBlock) toggleBlock(focusedBlock.id);
              }}
              className="w-full"
            >
              {focusedBlock?.completed ? "Mark incomplete" : "Mark complete"}
            </Button>
            <Button variant="outline" onClick={clearFocus} className="w-full">
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

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

            <div className="space-y-2">
              <Label>Repeat weekly on</Label>
              <div className="flex gap-1.5">
                {week.map((d, i) => {
                  const on = repeatDays.includes(i);
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setRepeatDays((prev) =>
                          prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
                        )
                      }
                      className={cn(
                        "flex-1 rounded-xl border py-1.5 text-[0.65rem] uppercase transition-colors",
                        on
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {d.day.slice(0, 2)}
                    </button>
                  );
                })}
              </div>
              {repeatDays.length ? (
                <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-background p-1">
                  {[1, 2, 4, 8].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWeeks(w)}
                      className={cn(
                        "flex-1 rounded-xl py-1.5 text-xs transition-colors",
                        weeks === w ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                      )}
                    >
                      {w}w
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[0.68rem] text-muted-foreground">
                  Leave empty to add this block to the selected day only.
                </p>
              )}
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
