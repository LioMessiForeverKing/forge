import RegistryFeed from "@/components/RegistryFeed";

export default function RegistryPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-geist-mono)] text-[#f5f5f0] mb-2">
          The Registry
        </h1>
        <p className="text-[#737373] text-sm">
          Every agent ever forged. Read-only. Public.
        </p>
      </div>
      <RegistryFeed />
    </div>
  );
}
