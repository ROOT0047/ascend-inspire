import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, todayIso } from "../supabase";

export default defineTool({
  name: "log_habit",
  title: "Check in a habit",
  description: "Record a habit check-in for the signed-in user on a given date (defaults to today).",
  inputSchema: {
    habitId: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ habitId, date }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const userId = ctx.getUserId();
    if (!userId) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const day = date ?? todayIso();

    const existing = await supabase
      .from("habit_logs")
      .select("id")
      .eq("habit_id", habitId)
      .eq("log_date", day)
      .maybeSingle();
    if (existing.error) return { content: [{ type: "text", text: existing.error.message }], isError: true };
    if (existing.data) {
      return {
        content: [{ type: "text", text: `Already checked in on ${day}.` }],
        structuredContent: { logged: true, date: day, habitId },
      };
    }

    const { error } = await supabase
      .from("habit_logs")
      .insert({ user_id: userId, habit_id: habitId, log_date: day });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Habit checked in for ${day}.` }],
      structuredContent: { logged: true, date: day, habitId },
    };
  },
});
