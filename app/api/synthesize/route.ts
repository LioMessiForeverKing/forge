import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { generateEmbedding } from "@/lib/embeddings";
import { synthesizeAgent } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();

    // Step 1: Generate embedding for the prompt
    let embedding: number[] | null = null;
    try {
      embedding = await generateEmbedding(prompt);
    } catch (err) {
      console.warn("Embedding generation failed, skipping dedup:", err);
    }

    // Step 2: Check for existing similar agent
    if (embedding) {
      const { data: matches, error: matchError } = await supabase.rpc(
        "match_agents",
        {
          query_embedding: embedding,
          match_threshold: 0.75,
          match_count: 1,
        }
      );

      if (!matchError && matches && matches.length > 0) {
        const existing = matches[0];

        // Increment uses count
        await supabase
          .from("agents")
          .update({ uses: (existing.uses || 1) + 1 })
          .eq("id", existing.id);

        return NextResponse.json({
          agent: { ...existing, uses: (existing.uses || 1) + 1 },
          is_new: false,
        });
      }
    }

    // Step 3: Synthesize new agent
    const agentDef = await synthesizeAgent(prompt);

    // Step 4: Save to Supabase
    const insertData: Record<string, unknown> = {
      name: agentDef.name,
      description: agentDef.description,
      use_cases: agentDef.use_cases,
      suggested_integrations: agentDef.suggested_integrations,
      original_prompt: prompt,
      uses: 1,
    };

    if (embedding) {
      insertData.embedding = embedding;
    }

    const { data: saved, error: saveError } = await supabase
      .from("agents")
      .insert(insertData)
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save agent:", saveError);
      // Still return the agent even if save fails
      return NextResponse.json({
        agent: {
          id: crypto.randomUUID(),
          ...agentDef,
          original_prompt: prompt,
          created_at: new Date().toISOString(),
          uses: 1,
        },
        is_new: true,
      });
    }

    return NextResponse.json({ agent: saved, is_new: true });
  } catch (err) {
    console.error("Synthesis error:", err);
    return NextResponse.json(
      { error: "Failed to synthesize agent. Please try again." },
      { status: 500 }
    );
  }
}
