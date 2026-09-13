import { hoursFromNowIso, mockHash } from '../lib/utils'
import { TEMPLATES } from './templates'
import type { Order, Outcome, PlatformSettings, User } from './types'

export const DEMO_PASSWORD = 'demo1234'
const hash = mockHash(DEMO_PASSWORD)

export const SELLER_ID = 'usr_seller'
export const BUYER_ID = 'usr_buyer'
export const ADMIN_ID = 'usr_admin'
export const SELLER_B_ID = 'usr_seller_b'

/** Default platform economics. Admin can edit these in-session. */
export const DEFAULT_SETTINGS: PlatformSettings = {
  takeRate: 0.07,
  subscriptionTiers: [
    {
      name: 'Starter',
      price: 49,
      liveOutcomeLimit: 3,
      monthlyOrderLimit: 10,
      features: ['3 live outcomes', '10 orders / month', 'Standard templates', 'Email support'],
    },
    {
      name: 'Pro',
      price: 99,
      liveOutcomeLimit: 10,
      monthlyOrderLimit: 50,
      features: ['10 live outcomes', '50 orders / month', 'Priority placement', 'Proof-of-work branding'],
    },
    {
      name: 'Agency',
      price: 199,
      liveOutcomeLimit: null,
      monthlyOrderLimit: null,
      features: ['Unlimited live outcomes', 'Unlimited orders', 'Team seats (demo)', 'Custom take-rate review'],
    },
  ],
}

export const SEED_USERS: User[] = [
  {
    id: BUYER_ID,
    email: 'buyer@demo.com',
    passwordHash: hash,
    role: 'buyer',
    name: 'Jordan Hale',
    company: 'Harbor & Co.',
    vertical: 'Creator/Brand',
    subscriptionTier: 'Starter',
    verified: false,
  },
  {
    id: SELLER_ID,
    email: 'seller@demo.com',
    passwordHash: hash,
    role: 'seller',
    name: 'Alex Rivera',
    company: 'Northline Outcomes',
    vertical: 'Creator/Brand',
    subscriptionTier: 'Pro',
    verified: true,
  },
  {
    id: ADMIN_ID,
    email: 'admin@outcomelauncher.com',
    passwordHash: hash,
    role: 'seller',
    name: 'Sam Okonkwo',
    company: 'OutcomeLauncher',
    vertical: 'SaaS Builder',
    subscriptionTier: 'Agency',
    verified: true,
  },
  {
    id: SELLER_B_ID,
    email: 'maya@northstar.demo',
    passwordHash: hash,
    role: 'seller',
    name: 'Maya Chen',
    company: 'Northstar Studio',
    vertical: 'SaaS Builder',
    subscriptionTier: 'Agency',
    verified: true,
  },
]

function cloneTemplateToOutcome(
  templateId: string,
  outcomeId: string,
  sellerId: string,
  status: Outcome['status'],
  stats: Outcome['stats'],
): Outcome {
  const template = TEMPLATES.find((t) => t.id === templateId)
  if (!template) throw new Error(`Unknown template ${templateId}`)
  return {
    id: outcomeId,
    sellerId,
    templateId: template.id,
    title: template.title,
    description: template.description,
    vertical: template.vertical,
    category: template.category,
    inputs: template.inputs.map((field) => ({ ...field })),
    deliverables: [...template.deliverables],
    notIncluded: [...template.notIncluded],
    successCriteria: template.successCriteria,
    slaHours: template.slaHours,
    basePrice: template.basePrice,
    priceNote: template.priceNote,
    bonusDescription: template.bonusDescription,
    bonusFormula: template.bonusFormula,
    capacity: template.capacity,
    status,
    stats,
    faqs: template.faqs.map((faq) => ({ ...faq })),
  }
}

/** Several live outcomes cloned from standardized templates under the demo sellers. */
export const SEED_OUTCOMES: Outcome[] = [
  cloneTemplateToOutcome('tpl_abandoned_cart', 'out_cart', SELLER_ID, 'live', {
    totalOrders: 14,
    completionRate: 0.93,
    avgTimeToOutcomeHours: 86,
  }),
  cloneTemplateToOutcome('tpl_seo_rewrite', 'out_seo', SELLER_ID, 'live', {
    totalOrders: 21,
    completionRate: 0.95,
    avgTimeToOutcomeHours: 74,
  }),
  cloneTemplateToOutcome('tpl_missed_call', 'out_calls', SELLER_ID, 'live', {
    totalOrders: 9,
    completionRate: 0.89,
    avgTimeToOutcomeHours: 140,
  }),
  cloneTemplateToOutcome('tpl_content_sprint', 'out_content', SELLER_ID, 'paused', {
    totalOrders: 4,
    completionRate: 1,
    avgTimeToOutcomeHours: 210,
  }),
  cloneTemplateToOutcome('tpl_zero_touch', 'out_onboard', SELLER_B_ID, 'live', {
    totalOrders: 6,
    completionRate: 0.83,
    avgTimeToOutcomeHours: 390,
  }),
  cloneTemplateToOutcome('tpl_integration_pack', 'out_integrations', SELLER_B_ID, 'live', {
    totalOrders: 5,
    completionRate: 0.8,
    avgTimeToOutcomeHours: 420,
  }),
  cloneTemplateToOutcome('tpl_analytics', 'out_analytics', SELLER_B_ID, 'live', {
    totalOrders: 8,
    completionRate: 0.88,
    avgTimeToOutcomeHours: 250,
  }),
  cloneTemplateToOutcome('tpl_billing', 'out_billing', ADMIN_ID, 'live', {
    totalOrders: 3,
    completionRate: 1,
    avgTimeToOutcomeHours: 280,
  }),
  cloneTemplateToOutcome('tpl_docs', 'out_docs', ADMIN_ID, 'draft', {
    totalOrders: 0,
    completionRate: 0,
    avgTimeToOutcomeHours: 0,
  }),
]

const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString()

export const SEED_ORDERS: Order[] = [
  {
    id: 'ord_paid_cart',
    outcomeId: 'out_cart',
    buyerId: BUYER_ID,
    intakeData: {
      store_url: 'https://harborandco.shop',
      email_platform: 'Klaviyo',
      baseline: '4.2% recovery, $68 AOV, ~180 abandoned carts / week',
    },
    basePrice: 499,
    status: 'paid',
    createdAt: daysAgo(0.3),
    deadlineAt: hoursFromNowIso(110),
    workflowLogs: [],
  },
  {
    id: 'ord_progress_seo',
    outcomeId: 'out_seo',
    buyerId: BUYER_ID,
    intakeData: {
      urls: 'https://harborandco.shop/products/oak-desk\nhttps://harborandco.shop/products/linen-shade',
      voice: 'Warm, specific, no hype. Avoid “luxury”.',
      keywords: 'solid oak writing desk, linen drum shade, small-space office',
    },
    basePrice: 299,
    status: 'in_progress',
    createdAt: daysAgo(1),
    deadlineAt: hoursFromNowIso(90),
    workflowLogs: [
      {
        id: 'log_seo_1',
        timestamp: daysAgo(0.8),
        step: 'Intake parse',
        message: 'Mapped 10 URL slots; 2 provided, 8 to be confirmed from sitemap.',
        status: 'done',
      },
      {
        id: 'log_seo_2',
        timestamp: daysAgo(0.6),
        step: 'Agent research',
        message: 'Pulled SERP titles and gathered on-page baselines.',
        status: 'done',
      },
      {
        id: 'log_seo_3',
        timestamp: daysAgo(0.2),
        step: 'Draft generation',
        message: 'Agents drafting titles/metas (estimated 70% of copy).',
        status: 'running',
      },
    ],
  },
  {
    id: 'ord_done_calls',
    outcomeId: 'out_calls',
    buyerId: BUYER_ID,
    intakeData: {
      call_logs: '~35 missed calls / week, HVAC + install, 8a–6p local',
      calendar: 'Housecall Pro',
      service_area: 'Austin metro, 25-mile radius, after-hours callback next morning',
    },
    basePrice: 399,
    bonusPrice: 75,
    status: 'completed',
    createdAt: daysAgo(18),
    deadlineAt: daysAgo(11),
    workflowLogs: [
      {
        id: 'log_call_1',
        timestamp: daysAgo(17),
        step: 'Intake parse',
        message: 'Service catalog and after-hours rules extracted.',
        status: 'done',
      },
      {
        id: 'log_call_2',
        timestamp: daysAgo(16.5),
        step: 'Agent research',
        message: 'Mapped Housecall Pro booking fields and CRM columns.',
        status: 'done',
      },
      {
        id: 'log_call_3',
        timestamp: daysAgo(16),
        step: 'Draft generation',
        message: 'SMS/email copy and booking link produced.',
        status: 'done',
      },
      {
        id: 'log_call_4',
        timestamp: daysAgo(15.5),
        step: 'Human QA',
        message: 'Specialist checked tone, TCPA-safe language, and calendar conflicts.',
        status: 'done',
      },
      {
        id: 'log_call_5',
        timestamp: daysAgo(15),
        step: 'Proof compile',
        message: 'Proof of work report generated.',
        status: 'done',
      },
    ],
    proofReport: {
      summary:
        'Missed-call SMS + email flow is live. First 10 bookings logged in the CRM sheet; 5 additional bookings in the bonus window.',
      whatWasDone: [
        'Triggered SMS within 2 minutes of a missed call',
        'Fallback email at +20 minutes if no reply',
        'Housecall Pro booking link with service-area guardrails',
        'CRM sheet with source = missed-call and status columns',
      ],
      beforeAfter: [
        {
          label: 'Missed-call follow-up',
          before: 'Voicemail only; no logged next step',
          after: 'SMS + email + booking link; every miss creates a CRM row',
        },
        {
          label: 'Bookings attributed',
          before: '0 tracked from missed calls',
          after: '15 logged in 12 days (10 SLA + 5 bonus)',
        },
      ],
      metrics: [
        { label: 'Time to first SMS', value: '1.4 min median' },
        { label: 'Bookings logged', value: '15' },
        { label: 'Bonus due', value: '$75 ($15 × 5)' },
      ],
      logs: [
        '2026-08-26T15:02:11Z flow published',
        '2026-08-27T09:11:04Z first booking logged (install — North Austin)',
        '2026-09-04T18:40:22Z tenth booking logged — SLA met',
      ],
    },
    rating: {
      stars: 5,
      review: 'First weekend we actually booked jobs from missed calls. Proof report matched what we saw in Housecall.',
    },
  },
  {
    id: 'ord_dispute_onboard',
    outcomeId: 'out_onboard',
    buyerId: BUYER_ID,
    intakeData: {
      product_url: 'https://app.harborops.io',
      activation: 'Created first project + invited a teammate. Current activation 18%.',
      current_steps: 'Signup → empty dashboard → “watch video” modal. High drop after signup.',
      tool_access: 'Customer.io + Mixpanel (read)',
    },
    basePrice: 2500,
    status: 'disputed',
    createdAt: daysAgo(40),
    deadlineAt: daysAgo(19),
    workflowLogs: [
      {
        id: 'log_on_1',
        timestamp: daysAgo(38),
        step: 'Intake parse',
        message: 'Activation definition captured; Mixpanel project mapped.',
        status: 'done',
      },
      {
        id: 'log_on_2',
        timestamp: daysAgo(30),
        step: 'Human QA',
        message: 'Buyer flagged that production write access was never granted.',
        status: 'error',
      },
    ],
    proofReport: {
      summary: 'Journey map delivered; instrumentation blocked on missing write access. Buyer opened a dispute on the activation target.',
      whatWasDone: [
        'Drafted 5 activation paths',
        'Wrote nudge copy for empty states',
        'Could not ship dashboard events without write access',
      ],
      beforeAfter: [
        {
          label: 'Onboarding paths',
          before: 'Single empty-state video',
          after: 'Mapped 5 paths — not fully instrumented',
        },
      ],
      metrics: [{ label: 'Activation change', value: 'Not measured (blocked)' }],
      logs: ['Access reminder sent 3 times', 'Dispute opened by buyer'],
    },
  },
]
