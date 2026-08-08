import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const SYSTEM = `You are ASCEND AI, a discipline coach modelled on a calm, analytical strategist.
Rules: be direct, concise (max 90 words), never flattering, never use emoji.
Reference the user's real data when it is provided. Give one concrete next action.`;

export const askCoach = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ message: z.string().trim().min(1).max(1000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    await supabase
      .from("coach_messages")
      .insert({ user_id: userId, role: "user", content: data.message });

    const today = new Date().toISOString().slice(0, 10);
    const [history, habits, logs, blocks] = await Promise.all([
      supabase
        .from("coach_messages")
        .select("role, content")
        .order("created_at", { ascending: false })
        .limit(16),
      supabase.from("habits").select("title, cadence").eq("archived", false),
      supabase.from("habit_logs").select("habit_id").eq("log_date", today),
      supabase.from("time_blocks").select("title, completed").eq("block_date", today),
    ]);

    const habitList = habits.data ?? [];
    const blockList = blocks.data ?? [];
    const contextLine = [
      `Date: ${today}.`,
      `Habits tracked: ${habitList.length ? habitList.map((h) => h.title).join(", ") : "none yet"}.`,
      `Habits checked in today: ${(logs.data ?? []).length}/${habitList.length}.`,
      `Blocks today: ${blockList.length} planned, ${blockList.filter((b) => b.completed).length} completed${
        blockList.length ? ` (${blockList.map((b) => b.title).join(", ")})` : ""
      }.`,
    ].join(" ");

    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const [{ streamText }, { createLovableAiGatewayProvider }] = await Promise.all([
      import("ai"),
      import("./ai-gateway.server"),
    ]);

    const gateway = createLovableAiGatewayProvider(key);
    const priorMessages = (history.data ?? [])
      .slice()
      .reverse()
      .map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      }));

    let streamError: unknown = null;
    const result = streamText({
      model: gateway("google/gemini-3.6-flash"),
      instructions: `${SYSTEM}\n\nUser data: ${contextLine}`,
      messages: priorMessages,
      onError: ({ error }) => {
        streamError = error;
        console.error("[coach] gateway stream error", error);
      },
    });

    let reply = "";
    try {
      reply = (await result.text).trim();
    } catch (error) {
      throw new Error(
        `coach failed: ${error instanceof Error ? `${error.name}: ${error.message}` : String(error)} | stream: ${
          streamError instanceof Error ? streamError.message : String(streamError)
        }`,
      );
    }
    if (!reply) {
      throw new Error(
        `ASCEND AI returned nothing: ${
          streamError instanceof Error ? streamError.message : String(streamError)
        }`,
      );
    }

    await supabase
      .from("coach_messages")
      .insert({ user_id: userId, role: "coach", content: reply });

    return { reply };
  });
