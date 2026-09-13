import type { OutcomeTemplate } from './types'

/**
 * Standardized outcome offers. Sellers clone these rather than inventing
 * vague gigs. Copy matches the OutcomeLauncher MVP spec.
 */
export const TEMPLATES: OutcomeTemplate[] = [
  {
    id: 'tpl_abandoned_cart',
    title: 'Abandoned-Cart Recovery Sprint',
    description:
      'Stand up a production-ready 3-email abandoned-cart sequence with segmentation and a projected-uplift report. Agents draft copy and flows; a human QA’s brand voice and measurement.',
    vertical: 'Creator/Brand',
    category: 'E-com',
    inputs: [
      { id: 'store_url', label: 'Store URL', type: 'url', required: true, placeholder: 'https://yourstore.com' },
      { id: 'email_platform', label: 'Email platform', type: 'text', required: true, placeholder: 'Klaviyo, Mailchimp, Postscript…' },
      { id: 'baseline', label: 'Baseline recovery metrics', type: 'textarea', required: true, placeholder: 'Current recovery rate, AOV, weekly abandoned carts' },
    ],
    deliverables: [
      '3-email abandoned-cart sequence (copy + timing)',
      'Segmentation rules (first-time vs repeat, AOV bands)',
      'Projected uplift report with assumptions',
    ],
    notIncluded: [
      'Paid media or SMS beyond the recovery sequence',
      'Store theme redesign',
      'Ongoing campaign management after the sprint',
    ],
    successCriteria:
      'Sequence is live in the connected ESP and a projected-uplift model is delivered against the provided baseline.',
    slaHours: 120,
    basePrice: 499,
    bonusDescription: '$25 per 100 recovered carts during the first 14 days after go-live.',
    bonusFormula: '$25 / 100 recovered carts (14-day window)',
    capacity: 6,
    faqs: [
      { q: 'What do you need from my store?', a: 'A working store URL, ESP access or screenshots, and a baseline (recovery rate, AOV, weekly abandoned carts).' },
      { q: 'How is the bonus calculated?', a: 'We compare recovered-cart events in the first 14 days after the sequence is live. $25 is due for every 100 recovered carts in that window.' },
    ],
  },
  {
    id: 'tpl_seo_rewrite',
    title: 'Product Page SEO Rewrite Pack',
    description:
      'Rewrite 10 product pages for search intent: titles, metas, H1s, and body, plus a keyword map you can reuse. Outcome is shippable copy, not a generic SEO audit.',
    vertical: 'Creator/Brand',
    category: 'E-com',
    inputs: [
      { id: 'urls', label: '10 product page URLs', type: 'textarea', required: true, placeholder: 'One URL per line' },
      { id: 'voice', label: 'Brand voice guidelines', type: 'textarea', required: true, placeholder: 'Tone, words to avoid, examples' },
      { id: 'keywords', label: 'Priority keywords', type: 'textarea', required: true, placeholder: 'Primary + secondary terms per page if known' },
    ],
    deliverables: [
      'Rewritten titles, meta descriptions, and H1s for 10 URLs',
      'Updated body copy ready to paste',
      'Keyword map (primary / secondary / supporting)',
    ],
    notIncluded: [
      'Technical SEO or site migrations',
      'Link building',
      'More than 10 pages (order a second pack)',
    ],
    successCriteria:
      'All 10 pages have rewritten titles, metas, H1s, and body copy plus a keyword map the buyer can implement in one session.',
    slaHours: 120,
    basePrice: 299,
    priceNote: '$299 / 10 pages',
    capacity: 8,
    faqs: [
      { q: 'Do you implement in my CMS?', a: 'This pack delivers ready-to-paste copy and a map. Implementation can be added as a follow-on outcome.' },
      { q: 'What if I have more than 10 URLs?', a: 'Order additional packs. Each pack is a fixed 10-page outcome with its own SLA.' },
    ],
  },
  {
    id: 'tpl_missed_call',
    title: 'Missed-Call-to-Booking System',
    description:
      'Turn missed calls into booked jobs: SMS/email follow-up, calendar booking, and a CRM sheet. Success is the first 10 bookings logged — not a chatbot demo.',
    vertical: 'Creator/Brand',
    category: 'Local',
    inputs: [
      { id: 'call_logs', label: 'Call logs or missed-call volume', type: 'textarea', required: true, placeholder: 'Weekly missed calls, typical services, hours' },
      { id: 'calendar', label: 'Calendar / booking tool', type: 'text', required: true, placeholder: 'Calendly, Housecall Pro, Google Calendar…' },
      { id: 'service_area', label: 'Service area and offer', type: 'textarea', required: true, placeholder: 'Cities, services, after-hours rules' },
    ],
    deliverables: [
      'SMS + email missed-call flow',
      'Booking handoff into your calendar',
      'CRM sheet with status columns',
    ],
    notIncluded: [
      'New phone system hardware',
      'Paid ads to generate calls',
      '24/7 live receptionist coverage',
    ],
    successCriteria:
      'Flow is live and the first 10 bookings sourced from missed-call follow-up are logged in the CRM sheet.',
    slaHours: 168,
    basePrice: 399,
    bonusDescription: '$15 per additional booking in the first 30 days after the first 10 are logged.',
    bonusFormula: '$15 / booking (first 30 days, after the first 10)',
    capacity: 4,
    faqs: [
      { q: 'Which phone systems work?', a: 'Any system that can forward missed-call events or export a log. We adapt the trigger to what you already use.' },
      { q: 'When does the bonus start?', a: 'After the first 10 bookings are logged. Then $15 per extra booking for 30 days.' },
    ],
  },
  {
    id: 'tpl_content_sprint',
    title: 'Content Sprint (Calls → Assets)',
    description:
      'Turn 5–10 call transcripts into a sprint of sales-ready assets: case studies, LinkedIn posts, and email snippets, written to your guidelines.',
    vertical: 'Creator/Brand',
    category: 'B2B',
    inputs: [
      { id: 'transcripts', label: '5–10 call transcripts or recordings notes', type: 'textarea', required: true, placeholder: 'Paste links or transcript text' },
      { id: 'guidelines', label: 'Brand and messaging guidelines', type: 'textarea', required: true, placeholder: 'ICP, claims you can make, CTA' },
    ],
    deliverables: [
      '3 case studies',
      '10 LinkedIn posts',
      '5 email snippets',
    ],
    notIncluded: [
      'Video editing or podcast production',
      'Paid social placement',
      'Ongoing monthly content retainers',
    ],
    successCriteria:
      'All 18 assets are delivered in the buyer’s voice, sourced from the provided calls, and ready to publish.',
    slaHours: 240,
    basePrice: 1200,
    priceNote: '$1,200 / sprint',
    capacity: 3,
    faqs: [
      { q: 'What if transcripts are messy?', a: 'That is expected. Agents extract claims and proof; humans check quotes and approvals.' },
      { q: 'Can we reuse this monthly?', a: 'Yes — clone the outcome each sprint. It stays a fixed-scope pack, not an open retainer.' },
    ],
  },
  {
    id: 'tpl_zero_touch',
    title: 'Zero-Touch Onboarding Flow',
    description:
      'Design and instrument a zero-touch onboarding journey: 3–7 paths, scripts, nudges, enrichment, and an activation dashboard. Priced to the outcome, not hours.',
    vertical: 'SaaS Builder',
    category: 'SaaS Onboarding',
    inputs: [
      { id: 'product_url', label: 'Product URL', type: 'url', required: true, placeholder: 'https://app.yourproduct.com' },
      { id: 'activation', label: 'Activation definition', type: 'textarea', required: true, placeholder: 'What “activated” means and current rate' },
      { id: 'current_steps', label: 'Current onboarding steps', type: 'textarea', required: true, placeholder: 'List screens, emails, and drop-offs' },
      { id: 'tool_access', label: 'Tool access', type: 'text', required: true, placeholder: 'Customer.io, Segment, Intercom, etc.' },
    ],
    deliverables: [
      'Journey map covering 3–7 activation paths',
      'In-product and email/SMS scripts',
      'Behavioral nudges + enrichment spec',
      'Activation dashboard (events + core views)',
    ],
    notIncluded: [
      'Full product redesign',
      'Custom engineering beyond specified automations',
      'Paid acquisition experiments',
    ],
    successCriteria:
      '≥30% activation uplift OR ≥40% time-to-first-value reduction, measured over 30 days against the provided baseline.',
    slaHours: 504,
    basePrice: 2500,
    priceNote: '$2,500–$7,000',
    bonusDescription: 'Optional $500–$1,500 bonus if the activation or TTFV target is hit in 30 days.',
    bonusFormula: '$500–$1,500 if ≥30% activation uplift OR ≥40% TTFV reduction (30 days)',
    capacity: 2,
    faqs: [
      { q: 'Why a price range?', a: 'Scope depends on number of paths and tools. The listed base is the start; we confirm the band from your intake.' },
      { q: 'How do you measure success?', a: 'Against the activation definition and TTFV you provide. The dashboard is part of the deliverable so both sides see the same numbers.' },
    ],
  },
  {
    id: 'tpl_integration_pack',
    title: 'Integration Pack (Top 3)',
    description:
      'Ship the three integrations your customers actually ask for: specs, no-code bridges, guides, test accounts, and a runbook — with a ticket-drop target.',
    vertical: 'SaaS Builder',
    category: 'SaaS Integrations',
    inputs: [
      { id: 'api_docs', label: 'API docs / auth model', type: 'textarea', required: true, placeholder: 'Links to docs and sandbox' },
      { id: 'desired', label: 'Desired integrations (top 3)', type: 'textarea', required: true, placeholder: 'e.g. Slack, HubSpot, Stripe' },
      { id: 'tickets', label: 'Related support tickets', type: 'textarea', required: true, placeholder: 'Volume and themes for the last 60 days' },
    ],
    deliverables: [
      'Integration specs for 3 systems',
      'No-code or low-code bridges',
      'Customer-facing setup guides',
      'Test accounts + runbook',
    ],
    notIncluded: [
      'Native SDK work beyond the three integrations',
      'Marketplace listing approvals',
      'Enterprise SSO / SCIM (separate outcome)',
    ],
    successCriteria:
      '3 integrations live, ≥5 successful test runs each, and ≥40% drop in related support tickets over the measurement window.',
    slaHours: 504,
    basePrice: 3000,
    priceNote: '$3,000–$8,000',
    capacity: 2,
    faqs: [
      { q: 'What if an integration needs a partner review?', a: 'We deliver a working sandbox path and a listing packet. Partner-store delays are called out, not hidden in the SLA.' },
    ],
  },
  {
    id: 'tpl_analytics',
    title: 'Analytics & Activation Instrumentation',
    description:
      'Install a founder-grade event schema, tracking plan, funnels, and alerts so you can answer “where do users stall?” without a data team.',
    vertical: 'SaaS Builder',
    category: 'SaaS Analytics',
    inputs: [
      { id: 'product', label: 'Product walkthrough / URL', type: 'url', required: true, placeholder: 'https://app.yourproduct.com' },
      { id: 'analytics_access', label: 'Analytics access', type: 'text', required: true, placeholder: 'Segment, Mixpanel, Amplitude, GA4…' },
    ],
    deliverables: [
      'Event schema + tracking plan',
      'Core activation funnels',
      'Stall alerts',
      'Implementation guide for your stack',
    ],
    notIncluded: [
      'Warehouse modeling or dbt projects',
      'Full BI tool procurement',
      'Ongoing weekly analytics retainers',
    ],
    successCriteria:
      'Founders can answer the stall question from the delivered funnels and alerts without exporting CSVs.',
    slaHours: 336,
    basePrice: 1500,
    priceNote: '$1,500–$4,000',
    capacity: 3,
    faqs: [
      { q: 'Do you need production write access?', a: 'Read access plus a staging write path is ideal. We never change production events without a reviewed plan.' },
    ],
  },
  {
    id: 'tpl_billing',
    title: 'Billing & Plans Cleanup',
    description:
      'Clean up plans, Stripe configuration, the pricing page, and revenue dashboards so packaging matches how people actually buy.',
    vertical: 'SaaS Builder',
    category: 'SaaS Billing',
    inputs: [
      { id: 'plans', label: 'Current plans and prices', type: 'textarea', required: true, placeholder: 'Tiers, add-ons, grandfathered SKUs' },
      { id: 'churn', label: 'Churn / expansion notes', type: 'textarea', required: true, placeholder: 'Logo and revenue churn, common cancel reasons' },
      { id: 'stripe', label: 'Stripe (or billing) access', type: 'text', required: true, placeholder: 'Restricted key or sandbox' },
    ],
    deliverables: [
      'Recommended tier structure',
      'Stripe / billing config',
      'Updated pricing page copy + layout notes',
      'Revenue dashboards + change runbook',
    ],
    notIncluded: [
      'Legal review of terms',
      'Sales-tax / VAT registration',
      'Migrating every historical invoice',
    ],
    successCriteria:
      'New tier structure is configured, the pricing page matches live SKUs, and a runbook exists for the next plan change.',
    slaHours: 336,
    basePrice: 1200,
    priceNote: '$1,200–$3,500',
    capacity: 3,
    faqs: [
      { q: 'Will you migrate existing subscribers?', a: 'We document a grandfathering path. Forced migrations are out of scope unless agreed in intake.' },
    ],
  },
  {
    id: 'tpl_docs',
    title: 'Docs + In-App Help Overhaul',
    description:
      'Restructure docs, write Q&A pairs, place in-app help widgets, and define health metrics with a week-one ticket-drop target.',
    vertical: 'SaaS Builder',
    category: 'SaaS Docs',
    inputs: [
      { id: 'docs', label: 'Current docs URL', type: 'url', required: true, placeholder: 'https://docs.yourproduct.com' },
      { id: 'help_tool', label: 'Help tool', type: 'text', required: true, placeholder: 'Intercom, Crisp, Zendesk, custom…' },
    ],
    deliverables: [
      'Restructured docs IA + rewritten priority articles',
      'Q&A pairs for in-app help',
      'Widget placement spec',
      'Docs health metrics',
    ],
    notIncluded: [
      'Full localization',
      'Video course production',
      'Staffing a support team',
    ],
    successCriteria:
      '≥30% drop in week-one support tickets for topics covered by the new docs and widgets, vs. the pre-overhaul baseline.',
    slaHours: 336,
    basePrice: 1000,
    priceNote: '$1,000–$3,000',
    capacity: 3,
    faqs: [
      { q: 'Do you rewrite every article?', a: 'We restructure the IA and rewrite the highest-traffic / highest-ticket pages. The rest gets a template and backlog.' },
    ],
  },
]
