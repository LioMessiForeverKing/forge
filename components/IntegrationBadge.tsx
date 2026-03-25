"use client";

interface IntegrationBadgeProps {
  name: string;
}

export default function IntegrationBadge({ name }: IntegrationBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1a1a1a] text-[#737373] border border-[#2a2a2a] cursor-default select-none"
      title="Integration coming soon"
    >
      {name}
    </span>
  );
}
