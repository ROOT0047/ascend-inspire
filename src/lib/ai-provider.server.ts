import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function getAiApiKey(): string {
  const key =
    process.env["GEMINI_API_KEY"] ||
    process.env["OPENAI_API_KEY"] ||
    process.env["AI_API_KEY"];
  if (!key) {
    throw new Error(
      "Missing AI API key. Please set GEMINI_API_KEY or OPENAI_API_KEY in your environment."
    );
  }
  return key;
}

export function createAiProvider(apiKey: string) {
  const isGoogleKey = apiKey.startsWith("AIza") || process.env["GEMINI_API_KEY"];

  if (isGoogleKey) {
    return createOpenAICompatible({
      name: "google",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      apiKey,
    });
  }

  return createOpenAICompatible({
    name: "openai",
    baseURL: process.env["AI_BASE_URL"] || "https://api.openai.com/v1",
    apiKey,
  });
}

