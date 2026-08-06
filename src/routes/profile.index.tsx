import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Award, ChevronRight, LogOut, Pencil } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/ascend/app-shell";
import { PageHeading, SectionHeader, StatTile } from "@/components/ascend/primitives";
import { useAscend } from "@/context/ascend";
import { useAuth } from "@/hooks/use-auth";
import { profile } from "@/data/mock";
import mark from "@/assets/ascend-mark.png";

export const Route = createFileRoute("/profile/")({
  head: () => ({
    meta: [
      { title: "Profile — ASCEND" },
      {
        name: "description",
        content: "Your rank, level, lifetime discipline stats and unlocked achievements.",
      },
      { property: "og:title", content: "Profile — ASCEND" },
      { property: "og:description", content: "Rank, level and lifetime discipline stats." },
    ],
  }),
  component: ProfilePage,
});

const links = [
  { to: "/profile/edit", label: "Edit profile" },
  { to: "/achievements", label: "Achievements" },
  { to: "/health", label: "Health" },
  { to: "/learn", label: "Learning" },
  { to: "/reminders", label: "Reminders" },
  { to: "/sync", label: "Sync & backup" },
  { to: "/settings", label: "Settings" },
] as const;

function ProfilePage() {
  const { disciplineScore, habits, achievements } = useAscend();
  const { user, profile: account, avatarSrc, signOut } = useAuth();
  const navigate = useNavigate();
  const name = account?.display_name ?? user?.email?.split("@")[0] ?? profile.name;

  return (
    <AppShell title="Profile">
      <div className="card-surface flex items-center gap-4 px-4 py-4">
        <img src={avatarSrc ?? mark} alt="" className="size-14 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-base text-foreground">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email ?? profile.email}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-[0.65rem] text-primary">
              Level {profile.level}
            </span>
            <span className="rounded-full bg-warning/15 px-2.5 py-0.5 text-[0.65rem] text-warning">
              {profile.rank}
            </span>
          </div>
        </div>
        <Link
          to="/profile/edit"
          aria-label="Edit profile"
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
        >
          <Pencil className="size-4" strokeWidth={1.75} />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatTile label="Discipline" value={`${disciplineScore}`} tone="primary" />
        <StatTile label="Habits" value={`${habits.length}`} />
        <StatTile
          label="Badges"
          value={`${achievements.filter((a) => a.unlocked).length}`}
          tone="warning"
        />
      </div>

      <SectionHeader title="Recent badges" className="mt-6" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {achievements
          .filter((a) => a.unlocked)
          .map((a) => (
            <div key={a.id} className="card-surface min-w-[8.5rem] px-3 py-3">
              <Award className="size-4 text-warning" strokeWidth={1.75} />
              <p className="mt-2 text-xs text-foreground">{a.name}</p>
            </div>
          ))}
      </div>

      <SectionHeader title="Manage" className="mt-6" />
      <ul className="card-surface divide-y divide-border overflow-hidden">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="flex items-center justify-between px-4 py-3.5 text-sm text-foreground"
            >
              {l.label}
              <ChevronRight className="size-4 text-muted-foreground" strokeWidth={1.75} />
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={async () => {
          await signOut();
          void navigate({ to: "/", replace: true });
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut className="size-4" strokeWidth={1.75} />
        Sign out
      </button>
    </AppShell>
  );
}
