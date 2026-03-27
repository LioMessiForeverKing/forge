export interface WorkflowStep {
  order: number;
  type: "trigger" | "action" | "output";
  label: string;
  description: string;
  integration: string | null;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  use_cases: string[];
  suggested_integrations: string[];
  estimated_monthly_cost: number | null;
  complexity: string;
  original_prompt: string;
  created_at: string;
  uses: number;
  workflow_steps?: WorkflowStep[] | null;
}

export interface SynthesisResult {
  agent: Agent;
  is_new: boolean;
}
