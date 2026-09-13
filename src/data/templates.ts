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
    kind: 'one_off',
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
    kind: 'one_off',
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
    kind: 'one_off',
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
    kind: 'one_off',
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
    kind: 'one_off',
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
    kind: 'one_off',
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
    kind: 'one_off',
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
    kind: 'one_off',
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
    kind: 'one_off',
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
  {
    id: 'tpl_auth_sso',
    title: 'Auth / SSO Lite Setup',
    description:
      'Stand up production-grade auth for a micro-SaaS: email magic-link or social login, a single SSO provider, session hardening, and a rollback runbook. Agents wire the stack; a human QA’s the threat model.',
    vertical: 'SaaS Builder',
    category: 'SaaS Auth',
    kind: 'one_off',
    stack: ['Auth.js', 'Supabase', 'Next.js'],
    inputs: [
      { id: 'app_url', label: 'App / staging URL', type: 'url', required: true, placeholder: 'https://app.yourproduct.com' },
      { id: 'auth_stack', label: 'Current auth stack', type: 'text', required: true, placeholder: 'Auth.js, Supabase Auth, Clerk, custom…' },
      { id: 'sso_provider', label: 'SSO provider to support', type: 'text', required: true, placeholder: 'Google, GitHub, or Microsoft Entra' },
      { id: 'constraints', label: 'Constraints', type: 'textarea', required: true, placeholder: 'Existing users, required MFA, cookie domain' },
    ],
    deliverables: [
      'Working email or social login on staging',
      'One SSO provider configured with a test tenant',
      'Session / cookie hardening checklist',
      'Rollback + incident runbook',
    ],
    notIncluded: [
      'SCIM / directory sync',
      'Enterprise IdP procurement',
      'SOC 2 evidence collection',
    ],
    successCriteria:
      'A new user can sign in via the chosen SSO path on staging, an existing password user still can, and the runbook is accepted by the buyer.',
    slaHours: 168,
    basePrice: 1800,
    priceNote: '$1,800–$4,500',
    bonusDescription: '$400 if first 25 production SSO logins complete with zero Sev-1 auth incidents in 14 days.',
    bonusFormula: '$400 if 25 SSO logins + 0 Sev-1 (14 days)',
    capacity: 2,
    faqs: [
      { q: 'Will you migrate every existing session?', a: 'We keep current sessions valid and document a forced-reauth path. Mass invalidation is opt-in.' },
      { q: 'Which providers?', a: 'One of Google, GitHub, or Microsoft Entra in this Lite pack. A second IdP is a follow-on outcome.' },
    ],
  },
  {
    id: 'tpl_waitlist_paid',
    title: 'Waitlist → Paid Conversion Sprint',
    description:
      'Turn a waitlist into paying customers: scoring, drip, checkout, and a conversion dashboard. Success is first paid conversions — not more landing-page copy.',
    vertical: 'SaaS Builder',
    category: 'SaaS Growth',
    kind: 'one_off',
    stack: ['Stripe', 'Resend', 'Next.js'],
    inputs: [
      { id: 'waitlist_url', label: 'Waitlist or landing URL', type: 'url', required: true, placeholder: 'https://yourproduct.com' },
      { id: 'list_size', label: 'List size + source', type: 'textarea', required: true, placeholder: 'Count, signup source, any tags' },
      { id: 'offer', label: 'Paid offer + price', type: 'textarea', required: true, placeholder: 'Plan, price, founding discount' },
      { id: 'esp', label: 'Email / billing tools', type: 'text', required: true, placeholder: 'Resend, Loops, Stripe…' },
    ],
    deliverables: [
      'Waitlist scoring + segment rules',
      '3-email conversion sequence',
      'Checkout path into Stripe (or equivalent)',
      'Conversion dashboard vs. list baseline',
    ],
    notIncluded: [
      'Paid ads to grow the waitlist',
      'Full brand redesign',
      'Ongoing lifecycle retainers',
    ],
    successCriteria:
      'Sequence + checkout are live and ≥3% of the provided list converts to paid in 21 days, or a documented reason the offer failed the test.',
    slaHours: 240,
    basePrice: 1600,
    priceNote: '$1,600–$3,800',
    bonusDescription: '$50 per paid conversion above the 3% bar in the 21-day window.',
    bonusFormula: '$50 / paid conversion above 3% (21 days)',
    capacity: 3,
    faqs: [
      { q: 'What if the list is cold?', a: 'We still ship the sequence and a honest conversion report. Bonus only applies to measured paid conversions.' },
    ],
  },
  {
    id: 'tpl_churn_save',
    title: 'Churn Save Flow (cancel / retention)',
    description:
      'Instrument cancel, offer a save path, and report retained revenue. Agents draft the flow; a human QA’s the offer and the measurement.',
    vertical: 'SaaS Builder',
    category: 'SaaS Billing',
    kind: 'one_off',
    stack: ['Stripe', 'Next.js', 'Postgres'],
    inputs: [
      { id: 'cancel_path', label: 'Current cancel path', type: 'textarea', required: true, placeholder: 'Where users cancel, current save offer if any' },
      { id: 'churn_baseline', label: 'Churn baseline', type: 'textarea', required: true, placeholder: 'Logo / revenue churn, top cancel reasons' },
      { id: 'billing', label: 'Billing access', type: 'text', required: true, placeholder: 'Stripe restricted key or sandbox' },
    ],
    deliverables: [
      'Cancel survey + reason taxonomy',
      'In-app or email save offer (pause / discount / downgrade)',
      'Stripe (or billing) configuration for the save SKU',
      'Retained-revenue report template',
    ],
    notIncluded: [
      'Legal review of discount language',
      'Win-back ads',
      'Rebuilding the entire billing page',
    ],
    successCriteria:
      'Save flow is live on the cancel path and ≥15% of cancel attempts in 30 days take a save offer, measured in billing events.',
    slaHours: 216,
    basePrice: 1400,
    priceNote: '$1,400–$3,200',
    bonusDescription: '5% of retained MRR captured by the save offer in the first 30 days (capped at $1,200).',
    bonusFormula: '5% retained MRR / 30 days (cap $1,200)',
    capacity: 3,
    faqs: [
      { q: 'Do you force a phone save?', a: 'No. This is a self-serve Lite flow. Human CS handoff can be added as a retainer.' },
    ],
  },
  {
    id: 'tpl_data_migration',
    title: 'Data Migration Pack (CSV / Stripe customers)',
    description:
      'Move customers, subscriptions, and a bounded CSV into the new app with a dry-run, a cutover checklist, and a rollback. Outcome is a completed cutover — not a migration essay.',
    vertical: 'SaaS Builder',
    category: 'SaaS Data',
    kind: 'one_off',
    stack: ['Stripe', 'Postgres', 'Supabase'],
    inputs: [
      { id: 'source', label: 'Source systems', type: 'textarea', required: true, placeholder: 'Stripe, CSV columns, current DB' },
      { id: 'target', label: 'Target schema / app', type: 'textarea', required: true, placeholder: 'Tables, unique keys, environment' },
      { id: 'volume', label: 'Record volume', type: 'text', required: true, placeholder: 'Customers, subs, CSV rows' },
    ],
    deliverables: [
      'Field map + sample dry-run report',
      'Idempotent import scripts or recipes',
      'Stripe customer / subscription mapping notes',
      'Cutover + rollback checklist',
    ],
    notIncluded: [
      'Historical invoice line-item archaeology beyond 12 months',
      'Warehouse / dbt modeling',
      'PII redaction legal opinions',
    ],
    successCriteria:
      'Dry-run error rate <1% on the provided sample and production cutover completes with a signed rollback window.',
    slaHours: 336,
    basePrice: 2200,
    priceNote: '$2,200–$6,000',
    bonusDescription: '$600 if production cutover finishes with zero unmatched paid subscribers.',
    bonusFormula: '$600 if 0 unmatched paid subscribers at cutover',
    capacity: 2,
    faqs: [
      { q: 'How big is “Lite”?', a: 'Up to ~25k customer rows and current Stripe subscriptions. Larger estates are scoped as a second pack.' },
    ],
  },
  {
    id: 'tpl_compliance_lite',
    title: 'Compliance Lite (privacy / DPA / terms pages)',
    description:
      'Ship buyer-ready privacy, terms, and DPA pages plus a cookie/consent note for a micro-SaaS. Not a law firm — a specialist-QA’d pack you can put on the marketing site.',
    vertical: 'SaaS Builder',
    category: 'SaaS Compliance',
    kind: 'one_off',
    stack: ['Next.js', 'Cloudflare'],
    inputs: [
      { id: 'site_url', label: 'Marketing + app URLs', type: 'textarea', required: true, placeholder: 'https://yourproduct.com and app URL' },
      { id: 'subprocessors', label: 'Subprocessors / stack', type: 'textarea', required: true, placeholder: 'Stripe, Vercel, Resend, analytics…' },
      { id: 'region', label: 'Primary customer region', type: 'text', required: true, placeholder: 'US, EU, UK, mixed' },
    ],
    deliverables: [
      'Privacy policy page (plain-language + required notices)',
      'Terms of service page',
      'DPA template + subprocessor list',
      'Cookie / consent placement notes',
    ],
    notIncluded: [
      'Formal legal opinion or bar-licensed counsel',
      'SOC 2 / ISO audit',
      'Cookie-banner vendor procurement',
    ],
    successCriteria:
      'Pages are live (or ready-to-publish markdown) covering the listed subprocessors, and the buyer can send the DPA to a first customer without a blank-page rewrite.',
    slaHours: 168,
    basePrice: 900,
    priceNote: '$900–$2,200',
    bonusDescription: '$250 if the first customer DPA is countersigned within 21 days of delivery.',
    bonusFormula: '$250 if first DPA signed (21 days)',
    capacity: 4,
    faqs: [
      { q: 'Is this legal advice?', a: 'No. It is a structured drafting pack QA’d by a specialist. Have counsel review before high-risk jurisdictions.' },
    ],
  },
  {
    id: 'tpl_retainer_instrumentation',
    title: 'Instrumentation Health Retainer',
    description:
      'Monthly scoped outcome: keep activation events, funnels, and stall alerts healthy. Base fee covers a fixed review; bonus ties to unbroken measurement.',
    vertical: 'SaaS Builder',
    category: 'SaaS Retainers',
    kind: 'retainer',
    stack: ['Stripe', 'Next.js', 'Postgres'],
    monthlyMetric: 'Core activation funnel stays complete (no silent event drops) for the month.',
    inputs: [
      { id: 'analytics', label: 'Analytics workspace', type: 'text', required: true, placeholder: 'Mixpanel, Amplitude, PostHog…' },
      { id: 'critical_events', label: 'Critical events', type: 'textarea', required: true, placeholder: 'signup, activate, subscribe, churn' },
    ],
    deliverables: [
      'Monthly event-health report',
      'Broken-event fixes in staging',
      'Updated stall alerts',
    ],
    notIncluded: [
      'New product analytics strategy from scratch',
      'Warehouse modeling',
    ],
    successCriteria:
      'No critical event is silent for >48 hours in the month, or a same-week fix + incident note is filed.',
    slaHours: 720,
    basePrice: 790,
    priceNote: '$790 / month',
    bonusDescription: '$150 if zero silent critical events all month.',
    bonusFormula: '$150 / month if 0 silent critical events',
    capacity: 6,
    faqs: [
      { q: 'Is this hours?', a: 'No. It is a monthly scoped outcome with a published success metric — not a slack retainer.' },
    ],
  },
  {
    id: 'tpl_retainer_docs',
    title: 'Docs Freshness Retainer',
    description:
      'Monthly scoped outcome: keep the highest-traffic docs aligned with the shipped product. Success is freshness, not a word count.',
    vertical: 'SaaS Builder',
    category: 'SaaS Retainers',
    kind: 'retainer',
    stack: ['Next.js'],
    monthlyMetric: 'Priority docs match the current product within 7 days of a breaking change.',
    inputs: [
      { id: 'docs_url', label: 'Docs URL', type: 'url', required: true, placeholder: 'https://docs.yourproduct.com' },
      { id: 'changelog', label: 'Changelog / release notes source', type: 'text', required: true, placeholder: 'GitHub releases, Linear, Notion…' },
    ],
    deliverables: [
      'Monthly freshness audit of priority pages',
      'Rewrites for breaking changes',
      'Docs health snapshot',
    ],
    notIncluded: ['Full localization', 'Video courses'],
    successCriteria:
      'Every breaking change in the month has a matching docs update within 7 days, or an explicit deferral logged.',
    slaHours: 720,
    basePrice: 590,
    priceNote: '$590 / month',
    bonusDescription: '$100 if week-one tickets on covered topics stay ≥20% below the pre-retainer baseline.',
    bonusFormula: '$100 / month if ticket drop holds',
    capacity: 6,
    faqs: [
      { q: 'How many pages?', a: 'The top 15 by traffic or ticket volume. Expanding the set is a scope change.' },
    ],
  },
  {
    id: 'tpl_retainer_triage',
    title: 'Integration Ticket Triage Retainer',
    description:
      'Monthly scoped outcome: triage integration tickets, ship runbook fixes, and keep the top-3 integrations from becoming a support sink.',
    vertical: 'SaaS Builder',
    category: 'SaaS Retainers',
    kind: 'retainer',
    stack: ['Stripe', 'Supabase', 'Cloudflare'],
    monthlyMetric: 'P1 integration tickets acknowledged in 1 business day; monthly ticket volume on covered integrations trends down or is explained.',
    inputs: [
      { id: 'helpdesk', label: 'Helpdesk', type: 'text', required: true, placeholder: 'Intercom, Plain, Zendesk…' },
      { id: 'integrations', label: 'Covered integrations', type: 'textarea', required: true, placeholder: 'Up to 3 systems' },
    ],
    deliverables: [
      'Weekly triage log',
      'Runbook patches for recurring tickets',
      'Monthly volume + theme report',
    ],
    notIncluded: ['Building a fourth native integration', '24/7 on-call'],
    successCriteria:
      'P1 tickets on covered integrations are acknowledged within 1 business day and a monthly theme report is delivered.',
    slaHours: 720,
    basePrice: 890,
    priceNote: '$890 / month',
    bonusDescription: '$200 if related ticket volume drops ≥25% vs. the prior 30 days.',
    bonusFormula: '$200 / month if ≥25% ticket drop',
    capacity: 4,
    faqs: [
      { q: 'What is a P1?', a: 'Auth broken, data not syncing, or payments failing on a covered integration.' },
    ],
  },
]

