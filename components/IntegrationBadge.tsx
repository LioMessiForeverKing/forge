"use client";

interface IntegrationBadgeProps {
  name: string;
}

export default function IntegrationBadge({ name }: IntegrationBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#151515] text-[#777777] border border-[#222222] cursor-default select-none hover:border-[#333333] hover:text-[#999999] transition-colors duration-200"
      title={`${name} — integration coming soon`}
    >
      {name}
    </span>
  );
}
