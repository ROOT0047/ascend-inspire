import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, todayIso } from "../supabase";

export default defineTool({
  name: "list_habits",
  title: "List habits",
  description: "List the signed-in user's active habits with today's check-in status.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const today = todayIso();
    const [habits, logs] = await Promise.all([
      supabase.from("habits").select("id, title, cadence, goal, unit").eq("archived", false).order("created_at"),
      supabase.from("habit_logs").select("habit_id").eq("log_date", today),
    ]);
    if (habits.error) return { content: [{ type: "text", text: habits.error.message }], isError: true };
    const doneIds = new Set((logs.data ?? []).map((l) => l.habit_id));
    const items = (habits.data ?? []).map((h) => ({
      id: h.id,
      title: h.title,
      cadence: h.cadence,
      goal: h.goal,
      unit: h.unit,
      checkedInToday: doneIds.has(h.id),
    }));
    return {
      content: [
        {
          type: "text",
          text: items.length
            ? items.map((h) => `${h.checkedInToday ? "[x]" : "[ ]"} ${h.title} (${h.cadence})`).join("\n")
            : "No habits yet.",
        },
      ],
      structuredContent: { date: today, habits: items },
    };
  },
});
