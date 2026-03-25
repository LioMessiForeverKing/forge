"use client";

import { useEffect, useState } from "react";
import AgentCard from "./AgentCard";

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

export default function RegistryFeed() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAgents() {
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      if (data.agents) setAgents(data.agents);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse" />
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#525252] text-sm">
          No agents forged yet. Be the first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[#525252] text-sm mb-8">
        {agents.length} agent{agents.length !== 1 ? "s" : ""} forged
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
