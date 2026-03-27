import OpenAI from "openai";
import { requireEnv } from "./env";
import { INTEGRATIONS_PROMPT_LIST } from "./integrations";

const SYSTEM_PROMPT = `You are an agent architect. Given a user's description of what they need, produce a structured agent definition.

Return ONLY valid JSON with this exact shape:
{
  "name": "Short memorable agent name (2-4 words)",
  "description": "One paragraph describing exactly what this agent does, how it helps, and what outcomes it produces.",
  "use_cases": ["use case 1", "use case 2", "use case 3"],
  "suggested_integrations": ["Tool1", "Tool2", "Tool3"],
  "estimated_monthly_cost": 29,
  "complexity": "moderate",
  "workflow_steps": [
    { "order": 1, "type": "trigger", "label": "Monitor Stripe webhooks", "description": "Listen for payment_intent.payment_failed events from Stripe.", "integration": "Stripe" },
    { "order": 2, "type": "action", "label": "Extract payment details", "description": "Parse the failed payment amount, customer email, and failure reason.", "integration": null },
    { "order": 3, "type": "action", "label": "Look up customer", "description": "Fetch customer profile and payment history from Stripe.", "integration": "Stripe" },
    { "order": 4, "type": "output", "label": "Send Slack alert", "description": "Post a formatted alert with payment context to the #payments channel.", "integration": "Slack" }
  ]
}

For estimated_monthly_cost: estimate the realistic monthly cost in USD to run this agent in production. Consider API call volumes, integration costs, compute needs, and data processing. Use whole numbers. Typical ranges: simple automation $5-20, moderate agents $20-80, complex multi-integration agents $80-300+.

For complexity: choose exactly one of "simple", "moderate", or "complex" based on the number of integrations, logic branching, data volume, and real-time requirements.

For workflow_steps: produce an ordered list of 3-8 steps that describe the agent's execution pipeline from trigger to output. Each step has:
- "order": integer starting at 1
- "type": exactly one of "trigger" (the event or schedule that starts the agent — always the first step), "action" (processing, transformation, or API call steps in the middle), or "output" (the final deliverable — always the last step)
- "label": 2-6 word name for this step
- "description": one sentence explaining what happens in this step
- "integration": the integration name from the allowed list that this step uses, or null if it is internal logic (e.g. data transformation, filtering, AI processing)
The first step MUST have type "trigger". The last step MUST have type "output". All middle steps should have type "action". Use 3-8 steps total. The workflow should tell a clear story of how data flows from input to output.

For suggested_integrations: you MUST only pick from the following known integrations. Do NOT suggest integrations outside this list. Pick the 2-5 most relevant ones.

${INTEGRATIONS_PROMPT_LIST}

These integrations are NOT built yet — just indicate which ones the agent would need.

Do not include any explanation, preamble, or markdown. Return raw JSON only.`;

export async function synthesizeAgent(prompt: string) {
  const openai = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY") });

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
