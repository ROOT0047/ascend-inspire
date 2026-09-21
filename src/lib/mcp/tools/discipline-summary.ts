import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, todayIso } from "../supabase";

export default defineTool({
  name: "discipline_summary",
  title: "Today's discipline summary",
  description: "Summarise today's habit check-ins, scheduled blocks and completion rate for the signed-in user.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const today = todayIso();
    const [habits, logs, blocks] = await Promise.all([
      supabase.from("habits").select("id").eq("archived", false),
      supabase.from("habit_logs").select("habit_id").eq("log_date", today),
      supabase.from("time_blocks").select("completed").eq("block_date", today),
    ]);
    const habitTotal = (habits.data ?? []).length;
    const habitDone = (logs.data ?? []).length;
    const blockList = blocks.data ?? [];
    const blockDone = blockList.filter((b) => b.completed).length;
    const parts = habitTotal + blockList.length;
    const score = parts ? Math.round(((habitDone + blockDone) / parts) * 100) : 0;
    return {
      content: [
        {
          type: "text",
          text: `${today}: habits ${habitDone}/${habitTotal}, blocks ${blockDone}/${blockList.length}, discipline score ${score}%.`,
        },
      ],
      structuredContent: {
        date: today,
        habitsCheckedIn: habitDone,
        habitsTotal: habitTotal,
        blocksCompleted: blockDone,
        blocksTotal: blockList.length,
        disciplineScore: score,
      },
    };
  },
});
