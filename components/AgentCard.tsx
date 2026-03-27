"use client";

import IntegrationBadge from "./IntegrationBadge";
import WorkflowPipeline from "./WorkflowPipeline";
import type { Agent } from "@/lib/types";

interface AgentCardProps {
  agent: Agent;
  isNew?: boolean;
  compact?: boolean;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getComplexityConfig(complexity: string) {
  switch (complexity) {
    case "simple":
      return { label: "Simple", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", dot: "bg-emerald-400" };
    case "complex":
      return { label: "Complex", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", dot: "bg-orange-400" };
    default:
      return { label: "Moderate", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", dot: "bg-blue-400" };
  }
}

function formatCost(cost: number | null): string {
  if (!cost) return "—";
  return `$${cost}`;
}

export default function AgentCard({ agent, isNew, compact }: AgentCardProps) {
  const complexity = getComplexityConfig(agent.complexity);

  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6 hover:border-[#f97316]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.06)] group">
      {/* Top row: status + cost */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {isNew !== undefined && (
            isNew ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20">
                <span className="w-1 h-1 rounded-full bg-[#f97316] animate-pulse" />
                Just forged
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1a1a1a] text-[#666666] border border-[#252525]">
                Used {agent.uses} time{agent.uses !== 1 ? "s" : ""}
              </span>
            )
          )}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${complexity.bg} ${complexity.color} border ${complexity.border}`}>
            <span className={`w-1 h-1 rounded-full ${complexity.dot}`} />
            {complexity.label}
          </span>
        </div>

        {/* Cost badge */}
        {agent.estimated_monthly_cost && (
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-lg font-semibold font-[family-name:var(--font-geist-mono)] text-[#f5f5f0]">
              {formatCost(agent.estimated_monthly_cost)}
              <span className="text-[#525252] text-xs font-normal">/mo</span>
            </div>
            <p className="text-[#444444] text-[10px] uppercase tracking-wider">Est. cost</p>
          </div>
        )}
      </div>

      {/* Agent name */}
      <h3 className="text-xl font-semibold text-[#f5f5f0] font-[family-name:var(--font-geist-mono)] mb-2 group-hover:text-[#f97316] transition-colors duration-300">
        {agent.name}
      </h3>

      {/* Description */}
      <p className={`text-[#999999] text-sm leading-relaxed mb-5 ${compact ? "line-clamp-2" : ""}`}>
        {agent.description}
      </p>

      {/* Use cases */}
      {agent.use_cases && agent.use_cases.length > 0 && !compact && (
        <div className="mb-5">
          <p className="text-[#555555] text-[10px] uppercase tracking-[0.15em] font-medium mb-2.5">
            Use cases
          </p>
          <ul className="space-y-1.5">
            {agent.use_cases.map((uc, i) => (
              <li key={i} className="text-[#888888] text-sm flex items-start gap-2.5">
                <span className="text-[#f97316]/60 mt-1.5 flex-shrink-0">
                  <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                    <rect width="6" height="6" rx="1" />
                  </svg>
                </span>
                {uc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Workflow */}
      {agent.workflow_steps && agent.workflow_steps.length > 0 && !compact && (
        <div className="mb-5">
          <p className="text-[#555555] text-[10px] uppercase tracking-[0.15em] font-medium mb-2.5">
            Workflow
          </p>
          <WorkflowPipeline steps={agent.workflow_steps} />
        </div>
      )}

      {/* Integrations */}
      {agent.suggested_integrations && agent.suggested_integrations.length > 0 && (
        <div className="mb-4">
          <p className="text-[#555555] text-[10px] uppercase tracking-[0.15em] font-medium mb-2.5">
            Integrations needed
          </p>
          <div className="flex flex-wrap gap-1.5">
            {agent.suggested_integrations.map((integration) => (
              <IntegrationBadge key={integration} name={integration} />
            ))}
          </div>
        </div>
      )}

      {/* Footer: time + cost summary */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a] mt-1">
        <p className="text-[#444444] text-xs">
          Forged {timeAgo(agent.created_at)}
        </p>
        <div className="flex items-center gap-3">
          {agent.suggested_integrations && (
            <span className="text-[#444444] text-xs">
              {agent.suggested_integrations.length} integration{agent.suggested_integrations.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
