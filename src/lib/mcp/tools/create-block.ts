import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, todayIso } from "../supabase";

export default defineTool({
  name: "create_time_block",
  title: "Create a time block",
  description: "Schedule a new time block for the signed-in user.",
  inputSchema: {
    title: z.string().trim().min(1).max(120),
    startTime: z.string().regex(/^\d{2}:\d{2}$/).describe("Start time, HH:MM 24h."),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).describe("End time, HH:MM 24h."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Defaults to today."),
    description: z.string().trim().max(500).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, startTime, endTime, date, description, priority }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const userId = ctx.getUserId();
    if (!userId) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const day = date ?? todayIso();
    const { data, error } = await supabaseForUser(ctx)
      .from("time_blocks")
      .insert({
        user_id: userId,
        title,
        start_time: startTime,
        end_time: endTime,
        block_date: day,
        description: description ?? "",
        priority: priority ?? "medium",
      })
      .select("id, title, start_time, end_time, block_date, priority")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Scheduled "${data.title}" on ${data.block_date} ${data.start_time}-${data.end_time}.` }],
      structuredContent: {
        block: {
          id: data.id,
          title: data.title,
          startTime: data.start_time,
          endTime: data.end_time,
          date: data.block_date,
          priority: data.priority,
        },
      },
    };
  },
});
