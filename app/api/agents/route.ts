import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("agents")
    .select(
      "id, name, description, use_cases, suggested_integrations, estimated_monthly_cost, complexity, original_prompt, created_at, uses, workflow_steps"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch agents:", error);
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
  }

  return NextResponse.json({ agents: data });
}
