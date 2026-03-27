import RegistryFeed from "@/components/RegistryFeed";

export const metadata = {
  title: "Registry — Forge",
  description: "Browse every agent ever forged. Public, searchable, with cost estimates.",
};

export default function RegistryPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-geist-mono)] text-[#f5f5f0] tracking-tight">
            Registry
          </h1>
          <span className="px-2 py-0.5 rounded-md bg-[#f97316]/10 text-[#f97316] text-xs font-medium border border-[#f97316]/20">
            Public
          </span>
        </div>
        <p className="text-[#666666] text-sm">
          Every agent ever forged — searchable, with cost estimates and integration specs.
        </p>
      </div>
      <RegistryFeed />
    </div>
  );
}
