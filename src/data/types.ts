/**
 * OutcomeLauncher domain model.
 * Persistence is a repository (localStorage today; swap for Supabase later).
 */

export type Role = 'seller' | 'buyer'
export type Vertical = 'Creator/Brand' | 'SaaS Builder'
export type OutcomeStatus = 'draft' | 'live' | 'paused'
export type OrderStatus = 'paid' | 'in_progress' | 'completed' | 'disputed'
export type OutcomeKind = 'one_off' | 'retainer'
export type EscrowStatus = 'escrowed' | 'released'
export type SubscriptionTierName = 'Starter' | 'Pro' | 'Agency'
export type IntakeFieldType = 'text' | 'textarea' | 'url' | 'email' | 'number'

export const STACK_BADGES = [
  'Stripe',
  'Supabase',
  'Next.js',
  'Cloudflare',
  'Vercel',
  'Postgres',
  'Auth.js',
  'Resend',
  'Shopify',
  'Klaviyo',
] as const

export type StackBadge = (typeof STACK_BADGES)[number]

/** Categories are scoped to a vertical. */
export const CATEGORIES: Record<Vertical, string[]> = {
  'Creator/Brand': ['E-com', 'Local', 'B2B'],
  'SaaS Builder': [
    'SaaS Onboarding',
    'SaaS Integrations',
    'SaaS Analytics',
    'SaaS Billing',
    'SaaS Docs',
    'SaaS Auth',
    'SaaS Growth',
    'SaaS Data',
    'SaaS Compliance',
    'SaaS Retainers',
  ],
}

export const VERTICALS: Vertical[] = ['Creator/Brand', 'SaaS Builder']

export interface IntakeField {
  id: string
  label: string
  type: IntakeFieldType
  required: boolean
  placeholder?: string
}

export interface Faq {
  q: string
  a: string
}

export interface User {
  id: string
  email: string
  /** Demo-only mock hash — not a real password hash. */
  passwordHash: string
  role: Role
  name: string
  company: string
  vertical?: Vertical
  subscriptionTier: SubscriptionTierName
  verified: boolean
  /** Seller stack badges (Stripe, Supabase, Next.js, …). */
  stack?: StackBadge[]
}

export interface OutcomeStats {
  totalOrders: number
  completionRate: number
  avgTimeToOutcomeHours: number
}

export interface Outcome {
  id: string
  sellerId: string
  templateId?: string
  title: string
  description: string
  vertical: Vertical
  category: string
  kind: OutcomeKind
  inputs: IntakeField[]
  deliverables: string[]
  notIncluded: string[]
  successCriteria: string
  slaHours: number
  basePrice: number
  /** Optional display string for ranges, e.g. "$2,500–$7,000". */
  priceNote?: string
  bonusDescription?: string
  bonusFormula?: string
  /** Retainer: monthly success metric the base fee is scoped to. */
  monthlyMetric?: string
  capacity: number
  status: OutcomeStatus
  stats: OutcomeStats
  faqs: Faq[]
  stack?: StackBadge[]
}

export interface WorkflowLog {
  id: string
  timestamp: string
  step: string
  message: string
  status: 'running' | 'done' | 'error'
}

export interface ProofReport {
  summary: string
  whatWasDone: string[]
  beforeAfter: { label: string; before: string; after: string }[]
  metrics: { label: string; value: string }[]
  logs: string[]
}

export interface OrderRating {
  stars: number
  review: string
}

export interface Order {
  id: string
  outcomeId: string
  buyerId: string
  intakeData: Record<string, string>
  basePrice: number
  bonusPrice?: number
  status: OrderStatus
  createdAt: string
  deadlineAt: string
  workflowLogs: WorkflowLog[]
  proofReport?: ProofReport
  rating?: OrderRating
  escrowStatus: EscrowStatus
  /** Mock Stripe / analytics connection that unlocks measured-bonus UI. */
  measurementConnected?: boolean
}

export interface OutcomeTemplate {
  id: string
  title: string
  description: string
  vertical: Vertical
  category: string
  kind: OutcomeKind
  inputs: IntakeField[]
  deliverables: string[]
  notIncluded: string[]
  successCriteria: string
  slaHours: number
  basePrice: number
  priceNote?: string
  bonusDescription?: string
  bonusFormula?: string
  monthlyMetric?: string
  capacity: number
  faqs: Faq[]
  stack?: StackBadge[]
}

export interface SubscriptionTier {
  name: SubscriptionTierName
  price: number
  liveOutcomeLimit: number | null
  monthlyOrderLimit: number | null
  features: string[]
}

export interface PlatformSettings {
  takeRate: number
  subscriptionTiers: SubscriptionTier[]
}

export interface MarketplaceFilters {
  query: string
  vertical: Vertical | 'all'
  category: string
  kind: OutcomeKind | 'all'
  minPrice: number | null
  maxPrice: number | null
  maxSlaHours: number | null
}

export type OutcomeDraft = Omit<Outcome, 'id' | 'sellerId' | 'stats' | 'status'> & {
  status?: OutcomeStatus
}

export interface PersistedSnapshot {
  version: number
  users: User[]
  outcomes: Outcome[]
  orders: Order[]
  settings: PlatformSettings
  sessionUserId: string | null
}
