# Forge

On-demand agent synthesis and semantic registry for the Agentic Web.

Built in collaboration with MIT Media Lab's NANDA project (Networked Agents and Decentralized AI).

---

## What it does

You describe a task in plain English. Forge checks the registry for a semantically similar agent. If one exists, it surfaces it. If not, it synthesizes a new one on the spot, saves it to the registry, and returns it to you. Every agent ever created is visible in a public, read-only registry feed.

No predefined agents. No catalog. No developer required.

---

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (Postgres + pgvector)
- **AI Synthesis**: OpenAI API (GPT-4o)
- **Embeddings**: OpenAI (text-embedding-3-small)
- **Deployment**: Vercel

---

## Getting started

```bash
npx create-next-app forge
cd forge
npm install @supabase/supabase-js openai
```

Create a `.env.local` file:

```
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Database setup

Run this in your Supabase SQL editor:

```sql
create extension if not exists vector;

create table agents (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  use_cases text[] not null default '{}',
  suggested_integrations text[] not null default '{}',
  estimated_monthly_cost integer,
  complexity text default 'moderate',
  original_prompt text not null,
  workflow_steps jsonb,
  embedding vector(1536),
  created_at timestamp with time zone default now(),
  uses integer default 1
);

create index on agents using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function match_agents(
  query_embedding vector(1536),
  match_threshold float default 0.75,
  match_count int default 1
)
returns table (
  id uuid,
  name text,
  description text,
  use_cases text[],
  suggested_integrations text[],
  estimated_monthly_cost integer,
  complexity text,
  original_prompt text,
  workflow_steps jsonb,
  created_at timestamp with time zone,
  uses integer,
  similarity float
)
language sql stable
as $$
  select
    agents.id,
    agents.name,
    agents.description,
    agents.use_cases,
    agents.suggested_integrations,
    agents.estimated_monthly_cost,
    agents.complexity,
    agents.original_prompt,
    agents.workflow_steps,
    agents.created_at,
    agents.uses,
    1 - (agents.embedding <=> query_embedding) as similarity
  from agents
  where 1 - (agents.embedding <=> query_embedding) > match_threshold
  order by agents.embedding <=> query_embedding
  limit match_count;
$$;
```

---

## File structure

```
forge/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Chat/home screen
│   ├── registry/
│   │   └── page.tsx              # Public registry feed
│   └── api/
│       ├── synthesize/
│       │   └── route.ts          # Core synthesis + registry lookup
│       └── agents/
│           └── route.ts          # Fetch all agents
├── components/
│   ├── ChatInterface.tsx         # Main input + result display
│   ├── AgentCard.tsx             # Agent result card
│   ├── RegistryFeed.tsx          # Public feed
│   └── IntegrationBadge.tsx     # Greyed-out integration chip
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── openai.ts                 # OpenAI synthesis client
│   └── embeddings.ts             # OpenAI embeddings helper
└── README.md
```

---

## Claude Code instructions

> This section is for Claude Code. Read this before writing any code.

### What you are building

Forge is an agent synthesis and registry platform. The core loop is:

1. User submits a natural language prompt
2. Generate a vector embedding of the prompt (OpenAI text-embedding-3-small)
3. Run cosine similarity search against the Supabase agent registry using pgvector
4. If similarity score is above 0.75: return the existing agent, increment its `uses` count, set `is_new: false`
5. If below threshold: call OpenAI (GPT-4o) to synthesize a new agent definition, embed it, save it to Supabase, return it with `is_new: true`

That's the entire product. Build everything else around that loop.

---

### API routes

#### POST /api/synthesize

Request:
```typescript
{ prompt: string }
```

Response:
```typescript
{
  agent: {
    id: string
    name: string
    description: string
    use_cases: string[]
    suggested_integrations: string[]
    original_prompt: string
    created_at: string
    uses: number
  },
  is_new: boolean
}
```

Logic order:
1. Generate embedding for prompt
2. Call `match_agents` Supabase function
3. If match: increment uses, return with `is_new: false`
4. If no match: synthesize via OpenAI, embed, insert to Supabase, return with `is_new: true`

OpenAI system prompt for synthesis:
```
You are an agent architect. Given a user's description of what they need, produce a structured agent definition.

Return ONLY valid JSON with this exact shape:
{
  "name": "Short memorable agent name (2-4 words)",
  "description": "One paragraph describing exactly what this agent does, how it helps, and what outcomes it produces.",
  "use_cases": ["use case 1", "use case 2", "use case 3"],
  "suggested_integrations": ["Tool1", "Tool2", "Tool3"]
}

For suggested_integrations: you MUST only pick from the known integrations defined in lib/integrations.ts. Do NOT suggest integrations outside that list. Pick the 2-5 most relevant ones.

Do not include any explanation, preamble, or markdown. Return raw JSON only.
```

#### GET /api/agents

Returns all agents ordered by `created_at` descending. Used by the registry feed.

---

### Pages

#### / (home)

- Centered layout
- Forge wordmark top left, "Registry" link top right
- Large textarea in the center with a submit button
- Result appears inline below the input (no page navigation)
- Input stays visible after result so user can forge another

States:
- Idle: placeholder text "Describe the agent you need..."
- Loading: subtle animation, text "Forging your agent..."
- New agent result: AgentCard with "Just forged" badge
- Existing agent result: AgentCard with "Already in registry — used X times" badge

#### /registry

- Header: "The Registry" with live agent count
- Grid of AgentCards
- No click interaction, purely visual
- Auto-refresh every 30 seconds or use Supabase Realtime

---

### Components

#### AgentCard

Displays:
- Badge (Just forged / Already in registry)
- Agent name
- Description paragraph
- Use cases list (3-5 bullet points)
- IntegrationBadges (greyed out, not clickable)
- Relative timestamp ("Forged 2 minutes ago")

#### IntegrationBadge

- Pill/chip shape
- Grey background, muted text
- Not clickable, cursor: default
- Tooltip on hover: "Integration coming soon"
- Use Simple Icons CDN for logos if available, plain text fallback

---

### Design

Dark, industrial, forge-like aesthetic:

- Background: `#0a0a0a`
- Accent: `#f97316` (amber/orange)
- Text: `#f5f5f0`
- Cards: `#141414` with subtle amber border on hover
- Font: Geist Mono for wordmark and labels, clean sans-serif for body
- Animation: typewriter effect on agent name reveal, loading state should feel like something is being constructed

---

### Build order

Do this in order, do not skip ahead:

1. Supabase setup — run the schema SQL above, confirm pgvector extension is active
2. `lib/supabase.ts` — Supabase client
3. `lib/embeddings.ts` — OpenAI embedding helper (single function: `embedText(text: string): Promise<number[]>`)
4. `api/synthesize/route.ts` — the entire core loop
5. `api/agents/route.ts` — simple fetch all, ordered by created_at desc
6. `AgentCard.tsx` + `IntegrationBadge.tsx`
7. `ChatInterface.tsx`
8. `app/page.tsx` — wire ChatInterface in
9. `RegistryFeed.tsx` + `app/registry/page.tsx`
10. Loading states, error states, mobile responsive polish

---

### Error handling rules

- OpenAI synthesis fails: return error message to user, do not save anything to registry
- Embedding fails: still synthesize the agent but skip dedup, log a warning
- Supabase down: synthesize and return agent without saving, tell the user it wasn't saved
- Always return something useful to the user, never a blank screen

---

### What NOT to build (MVP scope)

Do not build any of the following unless explicitly asked:

- Auth or user accounts
- Live integrations (no OAuth, no Gmail connect, nothing like that)
- Agent execution (agents are structured definitions only, they do not run)
- Agent editing or deletion
- Clickable agent detail pages in the registry
- Payments

---

### Seed data for testing

Use these prompts to test the synthesis pipeline. Expected outputs are below.

**Prompt:** "I need an agent that manages my taxes"
```json
{
  "name": "Tax Manager",
  "description": "Tracks income and expenses throughout the year, categorizes transactions by tax relevance, identifies deductible items, and generates organized summaries ready for filing or handoff to an accountant. Monitors for tax deadlines, estimated quarterly payment dates, and flags any unusual activity that could trigger an audit.",
  "use_cases": [
    "Automatically categorize business vs. personal expenses",
    "Track deductibles like home office, travel, and equipment",
    "Generate quarterly estimated tax summaries",
    "Remind you of IRS deadlines and payment windows",
    "Export a clean expense report for your accountant"
  ],
  "suggested_integrations": ["QuickBooks", "Plaid", "Google Drive", "Stripe", "Mercury"]
}
```

**Prompt:** "I want an agent to manage my social media content"
```json
{
  "name": "Content Scheduler",
  "description": "Plans, drafts, and schedules social media content across platforms based on your brand voice and posting cadence. Analyzes engagement data to recommend optimal posting times, repurposes long-form content into platform-native formats, and maintains a content calendar.",
  "use_cases": [
    "Draft captions and threads from a single content brief",
    "Repurpose blog posts into Instagram carousels and tweets",
    "Schedule posts across platforms at peak engagement times",
    "Track follower growth and flag high-performing content",
    "Maintain a 30-day content calendar automatically"
  ],
  "suggested_integrations": ["Instagram", "Twitter/X", "TikTok", "LinkedIn", "Buffer"]
}
```

**Prompt:** "Help me track my startup's runway"
```json
{
  "name": "Runway Tracker",
  "description": "Monitors your startup's cash position in real time, calculates burn rate by month, and projects runway based on current spend. Alerts you when you hit predefined burn thresholds and models different hiring or spending scenarios to show their impact on runway.",
  "use_cases": [
    "Real-time runway projection based on current burn",
    "Alert when monthly burn exceeds target threshold",
    "Model impact of a new hire on runway",
    "Break down spend by category month-over-month",
    "Exportable financial summary for investor updates"
  ],
  "suggested_integrations": ["Mercury", "Brex", "QuickBooks", "Stripe", "Google Sheets"]
}
```

---

## Research context

Forge is built in collaboration with MIT Media Lab's NANDA project. NANDA is developing foundational infrastructure for the Internet of AI Agents: a decentralized index for agent discovery, verifiable agent identity (AgentFacts schema), and the Registry Quilt (a federated architecture of independently operated registries that remain globally discoverable without central control).

Forge's agent definitions are designed to be compatible with the AgentFacts schema. The registry is intended to function as both a user-facing creation layer and a reference implementation for NANDA's indexing work.

Research questions this project is investigating:
1. At what similarity threshold does routing accuracy maximize without over-collapsing distinct agent types?
2. How do agent definition clusters distribute across intent space as registry size scales?
3. Which integration surfaces appear most frequently, and does frequency predict user willingness to connect them?
4. How much semantic drift exists between original user prompts and synthesized definitions, and does that drift affect future routing accuracy?

---

## The core loop

User describes a need → Forge checks registry → synthesizes if new → saves to registry → user sees their agent.

That's Forge.
