import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-[family-name:var(--font-geist-mono)] text-[#f5f5f0] mb-3">
          Forge an agent
        </h1>
        <p className="text-[#737373] text-sm max-w-md">
          Describe what you need in plain English. If it exists, we&apos;ll find
          it. If not, we&apos;ll forge it.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
