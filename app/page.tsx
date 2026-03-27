import ChatInterface from "@/components/ChatInterface";

const EXAMPLE_PROMPTS = [
  "A social media scheduler that posts to Instagram and Twitter on a weekly content calendar",
  "An agent that monitors Stripe payments and sends Slack alerts for failed charges",
  "A lead nurturing bot that syncs HubSpot contacts with personalized email sequences",
  "An agent that summarizes GitHub PRs daily and posts a digest to Discord",
];

export default function Home() {
  return (
    <div className="hero-gradient">
      <div className="flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="text-center mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
            Agent synthesis engine
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold font-[family-name:var(--font-geist-mono)] text-[#f5f5f0] mb-4 tracking-tight leading-[1.1]">
            Describe it.<br />
            <span className="gradient-text">We forge it.</span>
          </h1>
          <p className="text-[#737373] text-base max-w-lg mx-auto leading-relaxed">
            Tell us what you need in plain English. If it already exists in the registry,
            we&apos;ll find it. If not, we&apos;ll synthesize it — complete with cost
            estimates and integration specs.
          </p>
        </div>
        <ChatInterface examplePrompts={EXAMPLE_PROMPTS} />
      </div>
    </div>
  );
}
