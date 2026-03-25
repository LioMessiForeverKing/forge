"use client";

import { useState } from "react";
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

interface SynthesisResult {
  agent: Agent;
  is_new: boolean;
}

export default function ChatInterface() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SynthesisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the agent you need..."
            rows={4}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 text-[#f5f5f0] placeholder-[#525252] text-sm resize-none focus:outline-none focus:border-[#f97316]/50 focus:ring-1 focus:ring-[#f97316]/25 transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute bottom-3 right-3 px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] disabled:bg-[#2a2a2a] disabled:text-[#525252] text-black text-sm font-medium rounded-lg transition-colors duration-200"
          >
            {loading ? "Forging..." : "Forge"}
          </button>
        </div>
        <p className="text-[#525252] text-xs mt-2 ml-1">
          Press Cmd+Enter to submit
        </p>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-1 mb-3">
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse" />
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
            <p className="text-[#737373] text-sm font-[var(--font-geist-mono)]">
              Forging your agent...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AgentCard agent={result.agent} isNew={result.is_new} />
        </div>
      )}
    </div>
  );
}
