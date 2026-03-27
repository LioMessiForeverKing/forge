"use client";

import { useState } from "react";
import type { WorkflowStep } from "@/lib/types";
import IntegrationBadge from "./IntegrationBadge";

interface WorkflowPipelineProps {
  steps: WorkflowStep[];
  defaultExpanded?: boolean;
}

function StepIcon({ type }: { type: WorkflowStep["type"] }) {
  if (type === "trigger") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
  }
  if (type === "output") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }
  // action
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const TYPE_STYLES = {
  trigger: {
    color: "text-[#f97316]",
    bg: "bg-[#f97316]/10",
    border: "border-[#f97316]/30",
    line: "bg-[#f97316]/20",
  },
  action: {
    color: "text-[#3b82f6]",
    bg: "bg-[#3b82f6]/10",
    border: "border-[#3b82f6]/30",
    line: "bg-[#3b82f6]/20",
  },
  output: {
    color: "text-[#10b981]",
    bg: "bg-[#10b981]/10",
    border: "border-[#10b981]/30",
    line: "bg-[#10b981]/20",
  },
};

function StepNode({ step, isLast }: { step: WorkflowStep; isLast: boolean }) {
  const style = TYPE_STYLES[step.type] || TYPE_STYLES.action;

  return (
    <div className="relative flex gap-3">
      {/* Icon column with connector line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-lg ${style.bg} border ${style.border} flex items-center justify-center ${style.color}`}>
          <StepIcon type={step.type} />
        </div>
        {!isLast && (
          <div className={`w-px flex-1 min-h-[16px] ${style.line} workflow-connector`} />
        )}
      </div>

      {/* Content */}
      <div className={`pb-4 ${isLast ? "" : "pb-1"}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium uppercase tracking-wider ${style.color}`}>
            {step.type}
          </span>
          {step.integration && (
            <IntegrationBadge name={step.integration} />
          )}
        </div>
        <p className="text-[#e5e5e0] text-sm font-medium mt-1">
          {step.label}
        </p>
        <p className="text-[#777777] text-xs mt-0.5 leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function WorkflowPipeline({ steps, defaultExpanded = false }: WorkflowPipelineProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  if (sorted.length === 0) return null;

  const firstStep = sorted[0];
  const lastStep = sorted[sorted.length - 1];
  const middleCount = sorted.length - 2;

  return (
    <div className="stagger-in">
      {expanded ? (
        <>
          {sorted.map((step, i) => (
            <StepNode key={step.order} step={step} isLast={i === sorted.length - 1} />
          ))}
          {sorted.length > 3 && (
            <button
              onClick={() => setExpanded(false)}
              className="text-[#555555] text-xs hover:text-[#888888] transition-colors mt-1 ml-11"
            >
              Collapse workflow
            </button>
          )}
        </>
      ) : (
        <>
          <StepNode step={firstStep} isLast={false} />
          {middleCount > 0 && (
            <div className="relative flex gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <button
                  onClick={() => setExpanded(true)}
                  className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#555555] hover:text-[#999999] hover:border-[#444444] transition-all cursor-pointer"
                >
                  <span className="text-xs font-semibold font-[family-name:var(--font-geist-mono)]">
                    +{middleCount}
                  </span>
                </button>
                <div className="w-px flex-1 min-h-[16px] bg-[#2a2a2a] workflow-connector" />
              </div>
              <div className="pb-4">
                <button
                  onClick={() => setExpanded(true)}
                  className="text-[#555555] text-xs hover:text-[#999999] transition-colors cursor-pointer mt-2"
                >
                  {middleCount} more step{middleCount !== 1 ? "s" : ""} — click to expand
                </button>
              </div>
            </div>
          )}
          <StepNode step={lastStep} isLast={true} />
        </>
      )}
    </div>
  );
}
