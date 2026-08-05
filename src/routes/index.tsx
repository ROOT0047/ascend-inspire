import { createFileRoute, Link } from "@tanstack/react-router";
import { Apple, Chrome, Mail } from "lucide-react";
import mark from "@/assets/ascend-mark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ASCEND — Discipline shapes destiny" },
      {
        name: "description",
        content:
          "Sign in to ASCEND, the discipline operating system for schedule, habits, focus, health and AI coaching.",
      },
      { property: "og:title", content: "ASCEND — Discipline shapes destiny" },
      {
        property: "og:description",
        content: "Master your habits. Master yourself.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[28rem] -translate-x-1/2 rounded-full opacity-45 blur-[120px]"
        style={{ background: "var(--primary)" }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-between px-6 py-14">
        <div className="rise flex flex-1 flex-col items-center justify-center text-center">
          <img
            src={mark}
            alt="ASCEND logo"
            width={816}
            height={816}
            className="size-16 drop-shadow-[0_0_28px_oklch(0.618_0.207_288/0.55)]"
          />
          <h1 className="mt-6 text-3xl tracking-[0.28em] text-foreground">ASCEND</h1>
          <p className="mt-3 text-sm text-muted-foreground">Discipline shapes destiny.</p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            Master your habits. Master yourself.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/home"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-primary px-4 py-3.5 text-sm font-medium text-primary-foreground transition-transform duration-200 active:scale-[0.98]"
          >
            <Mail className="size-4.5" strokeWidth={1.75} />
            Continue with Email
          </Link>
          <Link
            to="/home"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Chrome className="size-4.5" strokeWidth={1.75} />
            Continue with Google
          </Link>
          <Link
            to="/home"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Apple className="size-4.5" strokeWidth={1.75} />
            Continue with Apple
          </Link>
          <p className="pt-3 text-center text-[0.7rem] leading-relaxed text-muted-foreground">
            Prototype preview — sign-in is visual only. Data resets on reload.
          </p>
        </div>
      </div>
    </div>
  );
}
