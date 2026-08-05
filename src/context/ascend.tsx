import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  healthStats,
  seedAchievements,
  seedCoach,
  seedHabits,
  seedJournal,
  seedSchedule,
  type CoachMessage,
  type Habit,
  type JournalEntry,
  type ScheduleBlock,
} from "@/data/mock";

type AscendState = {
  schedule: ScheduleBlock[];
  habits: Habit[];
  journal: JournalEntry[];
  achievements: typeof seedAchievements;
  coach: CoachMessage[];
  focusMinutes: number;
  sessions: number;
  water: number;
  sleep: number;
  disciplineScore: number;
  toggleBlock: (id: string) => void;
  addBlock: (block: Omit<ScheduleBlock, "id" | "completed">) => void;
  toggleHabit: (id: string) => void;
  addHabit: (habit: Pick<Habit, "title" | "cadence" | "goal" | "unit">) => void;
  addJournal: (entry: Pick<JournalEntry, "title" | "mood" | "content">) => void;
  addCoachMessage: (message: CoachMessage) => void;
  logFocus: (minutes: number) => void;
  addWater: (ml: number) => void;
};

const AscendContext = createContext<AscendState | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function AscendProvider({ children }: { children: ReactNode }) {
  const [schedule, setSchedule] = useState<ScheduleBlock[]>(seedSchedule);
  const [habits, setHabits] = useState<Habit[]>(seedHabits);
  const [journal, setJournal] = useState<JournalEntry[]>(seedJournal);
  const [achievements] = useState(seedAchievements);
  const [coach, setCoach] = useState<CoachMessage[]>(seedCoach);
  const [focusMinutes, setFocusMinutes] = useState(145);
  const [sessions, setSessions] = useState(3);
  const [water, setWater] = useState(healthStats.water);
  const [sleep] = useState(healthStats.sleep);

  const toggleBlock = useCallback((id: string) => {
    setSchedule((prev) => prev.map((b) => (b.id === id ? { ...b, completed: !b.completed } : b)));
  }, []);

  const addBlock = useCallback((block: Omit<ScheduleBlock, "id" | "completed">) => {
    setSchedule((prev) =>
      [...prev, { ...block, id: uid(), completed: false }].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      ),
    );
  }, []);

  const toggleHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completedToday: !h.completedToday,
              streak: h.completedToday ? Math.max(0, h.streak - 1) : h.streak + 1,
              history: [...h.history.slice(0, 29), !h.completedToday],
            }
          : h,
      ),
    );
  }, []);

  const addHabit = useCallback((habit: Pick<Habit, "title" | "cadence" | "goal" | "unit">) => {
    setHabits((prev) => [
      ...prev,
      {
        ...habit,
        id: uid(),
        icon: "target",
        streak: 0,
        bestStreak: 0,
        completedToday: false,
        history: Array.from({ length: 30 }, () => false),
      },
    ]);
  }, []);

  const addJournal = useCallback((entry: Pick<JournalEntry, "title" | "mood" | "content">) => {
    setJournal((prev) => [
      { ...entry, id: uid(), createdAt: "Today" },
      ...prev,
    ]);
  }, []);

  const addCoachMessage = useCallback((message: CoachMessage) => {
    setCoach((prev) => [...prev, message]);
  }, []);

  const logFocus = useCallback((minutes: number) => {
    setFocusMinutes((prev) => prev + minutes);
    setSessions((prev) => prev + 1);
  }, []);

  const addWater = useCallback((ml: number) => {
    setWater((prev) => Math.min(4000, prev + ml));
  }, []);

  const disciplineScore = useMemo(() => {
    const habitRate = habits.length
      ? habits.filter((h) => h.completedToday).length / habits.length
      : 0;
    const taskRate = schedule.length
      ? schedule.filter((b) => b.completed).length / schedule.length
      : 0;
    const focusRate = Math.min(1, focusMinutes / 240);
    const sleepRate = Math.min(1, sleep / 7.5);
    const waterRate = Math.min(1, water / healthStats.waterGoal);
    const journalRate = journal.length > 0 ? 1 : 0;
    const learningRate = 0.72;
    const workoutRate = habits.find((h) => h.id === "h2")?.completedToday ? 1 : 0.3;

    const weighted =
      habitRate * 0.22 +
      taskRate * 0.2 +
      focusRate * 0.16 +
      sleepRate * 0.14 +
      workoutRate * 0.1 +
      waterRate * 0.07 +
      journalRate * 0.06 +
      learningRate * 0.05;

    return Math.round(weighted * 100);
  }, [habits, schedule, focusMinutes, sleep, water, journal.length]);

  const value = useMemo<AscendState>(
    () => ({
      schedule,
      habits,
      journal,
      achievements,
      coach,
      focusMinutes,
      sessions,
      water,
      sleep,
      disciplineScore,
      toggleBlock,
      addBlock,
      toggleHabit,
      addHabit,
      addJournal,
      addCoachMessage,
      logFocus,
      addWater,
    }),
    [
      schedule,
      habits,
      journal,
      achievements,
      coach,
      focusMinutes,
      sessions,
      water,
      sleep,
      disciplineScore,
      toggleBlock,
      addBlock,
      toggleHabit,
      addHabit,
      addJournal,
      addCoachMessage,
      logFocus,
      addWater,
    ],
  );

  return <AscendContext.Provider value={value}>{children}</AscendContext.Provider>;
}

export function useAscend() {
  const ctx = useContext(AscendContext);
  if (!ctx) throw new Error("useAscend must be used inside AscendProvider");
  return ctx;
}
