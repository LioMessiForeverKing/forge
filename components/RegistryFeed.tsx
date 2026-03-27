"use client";

import { useEffect, useState, useMemo } from "react";
import AgentCard from "./AgentCard";
import AgentDetailModal from "./AgentDetailModal";
import type { Agent } from "@/lib/types";

type SortOption = "newest" | "popular" | "cost-low" | "cost-high";

export default function RegistryFeed() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [complexityFilter, setComplexityFilter] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

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

  const filtered = useMemo(() => {
    let result = [...agents];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.suggested_integrations.some((i) => i.toLowerCase().includes(q))
      );
    }

    // Complexity filter
    if (complexityFilter !== "all") {
      result = result.filter((a) => a.complexity === complexityFilter);
    }

    // Sort
    switch (sort) {
      case "popular":
        result.sort((a, b) => b.uses - a.uses);
        break;
      case "cost-low":
        result.sort((a, b) => (a.estimated_monthly_cost || 0) - (b.estimated_monthly_cost || 0));
        break;
      case "cost-high":
        result.sort((a, b) => (b.estimated_monthly_cost || 0) - (a.estimated_monthly_cost || 0));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [agents, search, sort, complexityFilter]);

  // Stats
  const totalUses = agents.reduce((sum, a) => sum + a.uses, 0);
  const avgCost = agents.length > 0
    ? Math.round(agents.reduce((sum, a) => sum + (a.estimated_monthly_cost || 0), 0) / agents.length)
    : 0;

  if (loading) {
    return (
      <div>
        {/* Skeleton stats */}
        <div className="flex gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 w-32" />
          ))}
        </div>
        {/* Skeleton search */}
        <div className="skeleton h-11 w-full mb-6 max-w-sm" />
        {/* Skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#1e1e1e] flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <p className="text-[#666666] text-sm mb-1">No agents forged yet</p>
        <p className="text-[#444444] text-xs">Be the first to forge an agent</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats bar */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl px-5 py-3">
          <p className="text-[#444444] text-[10px] uppercase tracking-[0.15em] font-medium">Agents</p>
          <p className="text-[#f5f5f0] text-xl font-semibold font-[family-name:var(--font-geist-mono)]">{agents.length}</p>
        </div>
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl px-5 py-3">
          <p className="text-[#444444] text-[10px] uppercase tracking-[0.15em] font-medium">Total uses</p>
          <p className="text-[#f5f5f0] text-xl font-semibold font-[family-name:var(--font-geist-mono)]">{totalUses}</p>
        </div>
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl px-5 py-3">
          <p className="text-[#444444] text-[10px] uppercase tracking-[0.15em] font-medium">Avg. cost</p>
          <p className="text-[#f5f5f0] text-xl font-semibold font-[family-name:var(--font-geist-mono)]">${avgCost}<span className="text-[#525252] text-xs">/mo</span></p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444444]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents, integrations..."
            className="w-full bg-[#111111] border border-[#1e1e1e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f5f5f0] placeholder-[#444444] focus:outline-none focus:border-[#f97316]/30 transition-colors"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-[#111111] border border-[#1e1e1e] rounded-xl px-3 py-2.5 text-sm text-[#999999] focus:outline-none focus:border-[#f97316]/30 transition-colors appearance-none cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most used</option>
          <option value="cost-low">Cost: low to high</option>
          <option value="cost-high">Cost: high to low</option>
        </select>

        <div className="flex items-center gap-1.5">
          {["all", "simple", "moderate", "complex"].map((c) => (
            <button
              key={c}
              onClick={() => setComplexityFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                complexityFilter === c
                  ? "bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20"
                  : "bg-[#111111] text-[#555555] border border-[#1e1e1e] hover:text-[#888888] hover:border-[#333333]"
              }`}
            >
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {search.trim() && (
        <p className="text-[#555555] text-xs mb-4">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{search}&quot;
        </p>
      )}

      {/* Agent grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#555555] text-sm">No agents match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 stagger-in">
          {filtered.map((agent) => (
            <div key={agent.id} onClick={() => setSelectedAgent(agent)} className="cursor-pointer">
              <AgentCard agent={agent} compact />
            </div>
          ))}
        </div>
      )}

      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
}
