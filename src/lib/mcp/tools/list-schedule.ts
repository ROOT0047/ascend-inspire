import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, todayIso } from "../supabase";

export default defineTool({
  name: "list_schedule",
  title: "List schedule blocks",
  description: "List the signed-in user's time blocks for a given date (defaults to today).",
  inputSchema: {
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Date in YYYY-MM-DD form."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ date }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const day = date ?? todayIso();
    const { data, error } = await supabaseForUser(ctx)
      .from("time_blocks")
      .select("id, title, description, start_time, end_time, priority, completed, block_date")
      .eq("block_date", day)
      .order("start_time", { ascending: true });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const blocks = (data ?? []).map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      startTime: b.start_time,
      endTime: b.end_time,
      priority: b.priority,
      completed: b.completed,
      date: b.block_date,
    }));
    return {
      content: [
        {
          type: "text",
          text: blocks.length
            ? blocks.map((b) => `${b.startTime}-${b.endTime} ${b.title}${b.completed ? " (done)" : ""}`).join("\n")
            : `No blocks planned for ${day}.`,
        },
      ],
      structuredContent: { date: day, blocks },
    };
  },
});
