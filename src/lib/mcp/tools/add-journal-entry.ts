import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, todayIso } from "../supabase";

export default defineTool({
  name: "add_journal_entry",
  title: "Add a journal entry",
  description: "Save a reflection to the signed-in user's journal.",
  inputSchema: {
    title: z.string().trim().min(1).max(120),
    content: z.string().trim().max(5000).optional(),
    mood: z.string().trim().max(40).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, content, mood, date }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const userId = ctx.getUserId();
    if (!userId) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const day = date ?? todayIso();
    const { data, error } = await supabaseForUser(ctx)
      .from("journal_entries")
      .insert({
        user_id: userId,
        title,
        content: content ?? "",
        ...(mood ? { mood } : {}),
        entry_date: day,
      })
      .select("id, title, mood, entry_date")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Journal entry "${data.title}" saved for ${data.entry_date}.` }],
      structuredContent: {
        entry: { id: data.id, title: data.title, mood: data.mood, date: data.entry_date },
      },
    };
  },
});
