import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an agent architect. Given a user's description of what they need, produce a structured agent definition.

Return ONLY valid JSON with this exact shape:
{
  "name": "Short memorable agent name (2-4 words)",
  "description": "One paragraph describing exactly what this agent does, how it helps, and what outcomes it produces.",
  "use_cases": ["use case 1", "use case 2", "use case 3"],
  "suggested_integrations": ["Tool1", "Tool2", "Tool3"]
}

For suggested_integrations: list the real tools/platforms this agent would need to connect to in order to function (e.g. Gmail, Slack, Shopify, Twitter, Notion, Stripe). Be specific. List 2-5 integrations max. These are NOT built yet — just what the agent would need.

Do not include any explanation, preamble, or markdown. Return raw JSON only.`;

export async function synthesizeAgent(prompt: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No response from OpenAI");

  return JSON.parse(content);
}
