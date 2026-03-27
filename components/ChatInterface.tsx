"use client";

import { useState } from "react";
import AgentCard from "./AgentCard";
import type { SynthesisResult } from "@/lib/types";

interface ChatInterfaceProps {
  examplePrompts?: string[];
}

export default function ChatInterface({ examplePrompts }: ChatInterfaceProps) {
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
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f97316]/20 to-[#f97316]/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm" />
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the agent you need..."
              rows={4}
              className="w-full bg-[#111111] border border-[#2a2a2a] rounded-2xl px-5 py-4 pr-24 text-[#f5f5f0] placeholder-[#444444] text-sm resize-none focus:outline-none focus:border-[#f97316]/40 transition-colors duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="absolute bottom-3 right-3 px-5 py-2.5 bg-[#f97316] hover:bg-[#ea580c] disabled:bg-[#1a1a1a] disabled:text-[#444444] text-black text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:shadow-none"
            >
              {loading ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-current rounded-full animate-pulse" />
                  <span className="w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:0.15s]" />
                  <span className="w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:0.3s]" />
                </span>
              ) : (
                "Forge"
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[#444444] text-xs">
            {prompt.trim().length > 0 ? `${prompt.trim().length} chars` : "Press Cmd+Enter to submit"}
          </p>
        </div>
      </form>

      {/* Example prompts */}
      {!result && !loading && examplePrompts && examplePrompts.length > 0 && (
        <div className="mb-8 stagger-in">
          <p className="text-[#525252] text-xs uppercase tracking-wider mb-3 px-1">Try an example</p>
          <div className="flex flex-col gap-2">
            {examplePrompts.map((ep, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ep)}
                className="text-left px-4 py-3 rounded-xl bg-[#111111] border border-[#1a1a1a] text-[#737373] text-sm hover:border-[#f97316]/30 hover:text-[#a3a3a3] transition-all duration-200 truncate"
              >
                {ep}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 rounded-xl bg-[#f97316]/20 animate-ping" />
              <div className="relative w-12 h-12 rounded-xl bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <p className="text-[#737373] text-sm font-[family-name:var(--font-geist-mono)]">
              Forging your agent...
            </p>
            <p className="text-[#444444] text-xs mt-1">
              Synthesizing specs, estimating costs
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6 animate-in">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-400 text-xs">!</span>
            </div>
            <div>
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-400/60 text-xs mt-1 hover:text-red-400 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="animate-in">
          <AgentCard agent={result.agent} isNew={result.is_new} />
        </div>
      )}
    </div>
  );
}
