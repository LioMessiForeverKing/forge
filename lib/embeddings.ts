import OpenAI from "openai";
import { requireEnv } from "./env";

export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}
