import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/ascend/app-shell";
import { useAscend } from "@/context/ascend";
import { coachReplies } from "@/data/mock";
import { cn } from "@/lib/utils";
import logo from "@/assets/ascend-mark.png";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "ASCEND AI — Your Discipline Coach" },
      {
        name: "description",
        content: "A calm, analytical AI coach that reviews your day, finds patterns and sets tomorrow's priorities.",
      },
      { property: "og:title", content: "ASCEND AI — Your Discipline Coach" },
      { property: "og:description", content: "Daily briefings, pattern analysis, honest feedback." },
    ],
  }),
  component: CoachPage,
});

function CoachPage() {
  const { coach, addCoachMessage } = useAscend();
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [coach, thinking]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || thinking) return;
    addCoachMessage({ id: Math.random().toString(36).slice(2), role: "user", content: text });
    setInput("");
    setThinking(true);
    setTimeout(() => {
      addCoachMessage({
        id: Math.random().toString(36).slice(2),
        role: "coach",
        content: coachReplies[Math.floor(Math.random() * coachReplies.length)],
      });
      setThinking(false);
      inputRef.current?.focus();
    }, 900);
  }

  return (
    <AppShell title="ASCEND AI">
      <div className="mb-5 flex items-center gap-3">
        <img src={logo} alt="" className="size-10 rounded-xl" />
        <div>
          <p className="text-sm text-foreground">ASCEND AI</p>
          <p className="text-xs text-muted-foreground">Analytical. Direct. Never flattering.</p>
        </div>
      </div>

      <div className="space-y-3">
        {coach.map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <p
              className={cn(
                "max-w-[85%] text-sm leading-relaxed",
                m.role === "user"
                  ? "rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground"
                  : "rounded-2xl border border-border bg-surface px-4 py-3 text-foreground",
              )}
            >
              {m.content}
            </p>
          </div>
        ))}
        {thinking ? (
          <p className="text-xs text-muted-foreground">ASCEND AI is analysing…</p>
        ) : null}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={send}
        className="sticky bottom-2 mt-5 flex items-center gap-2 rounded-2xl border border-border bg-surface p-1.5"
      >
        <input
          ref={inputRef}
          value={input}
          maxLength={500}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about today's plan…"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!input.trim() || thinking}
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
        >
          <Send className="size-4" strokeWidth={2} />
        </button>
      </form>
    </AppShell>
  );
}
