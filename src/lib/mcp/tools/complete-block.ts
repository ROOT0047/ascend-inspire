import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "complete_time_block",
  title: "Mark a time block complete",
  description: "Mark one of the signed-in user's time blocks complete or incomplete.",
  inputSchema: {
    blockId: z.string().uuid(),
    completed: z.boolean().optional().describe("Defaults to true."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ blockId, completed }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const done = completed ?? true;
    const { data, error } = await supabaseForUser(ctx)
      .from("time_blocks")
      .update({ completed: done })
      .eq("id", blockId)
      .select("id, title, completed")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "No such block for this user." }], isError: true };
    return {
      content: [{ type: "text", text: `"${data.title}" marked ${data.completed ? "complete" : "incomplete"}.` }],
      structuredContent: { block: { id: data.id, title: data.title, completed: data.completed } },
    };
  },
});
