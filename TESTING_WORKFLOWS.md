# Testing Workflows Without Integrations

Forge agents include `workflow_steps` — an ordered pipeline describing how data flows from trigger to output. Since integrations are not live (no OAuth, no API keys, no real connections), here's how to verify workflows are working correctly at every layer.

---

## 1. Synthesis output validation

The simplest test: forge an agent and check the raw JSON.

```bash
curl -X POST http://localhost:3000/api/synthesize \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Monitor Stripe for failed payments and alert me on Slack"}'
```

Check the response for:

- `workflow_steps` is an array of 3-8 objects
- First step has `"type": "trigger"`
- Last step has `"type": "output"`
- All middle steps have `"type": "action"`
- Each step has `order`, `label`, `description`, and `integration` (string or null)
- `integration` values only reference known integrations from `lib/integrations.ts`

Example valid response shape:

```json
{
  "agent": {
    "workflow_steps": [
      { "order": 1, "type": "trigger", "label": "Monitor Stripe webhooks", "description": "Listen for payment_intent.payment_failed events.", "integration": "Stripe" },
      { "order": 2, "type": "action", "label": "Parse failure details", "description": "Extract amount, customer email, and failure reason.", "integration": null },
      { "order": 3, "type": "action", "label": "Fetch customer history", "description": "Pull payment history from Stripe.", "integration": "Stripe" },
      { "order": 4, "type": "output", "label": "Send Slack alert", "description": "Post formatted alert to #payments channel.", "integration": "Slack" }
    ]
  }
}
```

---

## 2. Database persistence

After forging, confirm the workflow was saved to Supabase:

```sql
select id, name, workflow_steps
from agents
order by created_at desc
limit 1;
```

`workflow_steps` should be a JSONB column containing the same array returned by the API. If this is `null` but the API returned steps, the insert is stripping the field — check `route.ts` insertData.

---

## 3. UI rendering (WorkflowPipeline)

Forge an agent in the browser and visually verify:

| What to check | Expected |
|---|---|
| Trigger step | Orange icon + "TRIGGER" label |
| Action steps | Blue icon + "ACTION" label |
| Output step | Green icon + "OUTPUT" label |
| Connector lines | Vertical lines between steps |
| Integration badges | Grey pills appear next to steps that have an `integration` |
| Collapse/expand | If 4+ steps, middle steps collapse into "+N more steps" button |
| Expand click | Clicking "+N" reveals all steps |

---

## 4. Edge case prompts to test

These prompts stress different workflow shapes:

| Prompt | Expected behavior |
|---|---|
| "Send me a daily weather summary" | Simple 3-step: trigger (schedule) -> action (fetch weather) -> output (send email/message) |
| "Monitor GitHub PRs, run code review, post results to Slack, and log to Notion" | Complex 5-7 steps with multiple integrations |
| "Summarize my emails every morning" | Should use Gmail integration, 3-4 steps |
| "Track competitor pricing across 10 websites and alert me when prices drop" | Complex with null-integration scraping steps in the middle |
| "Remind me to drink water" | Minimal agent — should still produce valid 3-step workflow |

---

## 5. Structural validation script

Run this in the browser console after forging an agent to validate the workflow structure programmatically:

```javascript
// Paste after forging an agent — reads the last synthesis result
async function validateLastAgent() {
  const res = await fetch('/api/agents');
  const { agents } = await res.json();
  const agent = agents[0];

  if (!agent.workflow_steps) {
    console.error('FAIL: No workflow_steps');
    return;
  }

  const steps = agent.workflow_steps;
  const errors = [];

  if (!Array.isArray(steps)) errors.push('workflow_steps is not an array');
  if (steps.length < 3) errors.push(`Too few steps: ${steps.length} (min 3)`);
  if (steps.length > 8) errors.push(`Too many steps: ${steps.length} (max 8)`);
  if (steps[0]?.type !== 'trigger') errors.push(`First step type is "${steps[0]?.type}", expected "trigger"`);
  if (steps[steps.length - 1]?.type !== 'output') errors.push(`Last step type is "${steps[steps.length - 1]?.type}", expected "output"`);

  steps.forEach((s, i) => {
    if (typeof s.order !== 'number') errors.push(`Step ${i}: missing order`);
    if (!s.label) errors.push(`Step ${i}: missing label`);
    if (!s.description) errors.push(`Step ${i}: missing description`);
    if (!['trigger', 'action', 'output'].includes(s.type)) errors.push(`Step ${i}: invalid type "${s.type}"`);
  });

  if (errors.length === 0) {
    console.log('PASS: Workflow is valid', { steps: steps.length, name: agent.name });
  } else {
    console.error('FAIL:', errors);
  }
}

validateLastAgent();
```

---

## 6. Registry feed

Go to `/registry` and confirm:
- Agents with workflows show the WorkflowPipeline component
- Agents without workflows (older entries) render without errors
- The pipeline doesn't break the card layout

---

## What this does NOT test

- Whether integrations actually connect (they don't — by design in MVP)
- Whether the workflow would succeed at runtime (agents are definitions only, they don't execute)
- Latency or rate limits under load

The workflow pipeline is a **spec**, not an execution engine. Testing it means verifying the spec is well-formed and renders correctly.
