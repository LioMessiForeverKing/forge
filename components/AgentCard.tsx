"use client";

import IntegrationBadge from "./IntegrationBadge";

interface Agent {
  id: string;
  name: string;
  description: string;
  use_cases: string[];
  suggested_integrations: string[];
  original_prompt: string;
  created_at: string;
  uses: number;
}

interface AgentCardProps {
  agent: Agent;
  isNew?: boolean;
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

export default function AgentCard({ agent, isNew }: AgentCardProps) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#f97316]/50 transition-colors duration-300">
      {isNew !== undefined && (
        <div className="mb-3">
          {isNew ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30">
              Just forged
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1a1a1a] text-[#737373] border border-[#2a2a2a]">
              Already in registry &mdash; used {agent.uses} time
              {agent.uses !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      <h3 className="text-xl font-semibold text-[#f5f5f0] font-[var(--font-geist-mono)] mb-2">
        {agent.name}
      </h3>

      <p className="text-[#a3a3a3] text-sm leading-relaxed mb-4">
        {agent.description}
      </p>

      {agent.use_cases && agent.use_cases.length > 0 && (
        <div className="mb-4">
          <p className="text-[#737373] text-xs uppercase tracking-wider mb-2">
            Use cases
          </p>
          <ul className="space-y-1">
            {agent.use_cases.map((uc, i) => (
              <li key={i} className="text-[#a3a3a3] text-sm flex items-start">
                <span className="text-[#f97316] mr-2 mt-0.5">&#8226;</span>
                {uc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {agent.suggested_integrations &&
        agent.suggested_integrations.length > 0 && (
          <div className="mb-4">
            <p className="text-[#737373] text-xs uppercase tracking-wider mb-2">
              Would need
            </p>
            <div className="flex flex-wrap gap-2">
              {agent.suggested_integrations.map((integration) => (
                <IntegrationBadge key={integration} name={integration} />
              ))}
            </div>
          </div>
        )}

      <p className="text-[#525252] text-xs mt-4">
        Forged {timeAgo(agent.created_at)}
      </p>
    </div>
  );
}
