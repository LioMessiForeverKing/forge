/**
 * Known integrations registry.
 *
 * When synthesizing agents, only integrations from this list will be suggested.
 * Add new entries to the appropriate category as support grows.
 */

export const INTEGRATIONS = {
  "Social Media": [
    "Instagram",
    "Twitter/X",
    "TikTok",
    "LinkedIn",
    "Facebook",
    "YouTube",
    "Pinterest",
    "Threads",
    "Buffer",
    "Hootsuite",
  ],
  "Finance & Payments": [
    "Stripe",
    "QuickBooks",
    "Plaid",
    "Mercury",
    "Brex",
    "PayPal",
    "Square",
    "Venmo",
    "Wave",
  ],
  "Productivity & Docs": [
    "Google Drive",
    "Google Sheets",
    "Google Docs",
    "Google Calendar",
    "Notion",
    "Airtable",
    "Trello",
    "Asana",
    "Monday.com",
    "Todoist",
  ],
  Communication: [
    "Gmail",
    "Slack",
    "Discord",
    "Microsoft Teams",
    "Zoom",
    "Twilio",
    "SendGrid",
  ],
  "Dev & Infra": [
    "GitHub",
    "GitLab",
    "Vercel",
    "AWS",
    "Supabase",
    "Firebase",
    "Jira",
    "Linear",
  ],
  "E-Commerce": [
    "Shopify",
    "WooCommerce",
    "Amazon Seller",
    "Etsy",
    "Gumroad",
  ],
  "CRM & Marketing": [
    "HubSpot",
    "Salesforce",
    "Mailchimp",
    "ConvertKit",
    "Intercom",
    "Zendesk",
  ],
  Analytics: [
    "Google Analytics",
    "Mixpanel",
    "Amplitude",
    "Segment",
    "Hotjar",
  ],
  Storage: [
    "Dropbox",
    "OneDrive",
    "Box",
    "S3",
  ],
} as const;

/** Flat list of every known integration name. */
export const ALL_INTEGRATIONS: string[] = Object.values(INTEGRATIONS).flat();

/** Formatted string for use in AI prompts. */
export const INTEGRATIONS_PROMPT_LIST: string = Object.entries(INTEGRATIONS)
  .map(([category, items]) => `${category}: ${items.join(", ")}`)
  .join("\n");
