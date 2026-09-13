import type { MarketplaceFilters, Outcome, Order, SubscriptionTier, User } from '../data/types'

/** Demo-only hash. Enough to avoid storing raw passwords in the mock store. */
export function mockHash(password: string): string {
  const checksum = [...password].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return `mock:${password.length}:${checksum}`
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function hoursFromNowIso(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

export function formatSla(hours: number): string {
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'}`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase().includes('admin@')
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function outcomePriceLabel(outcome: Pick<Outcome, 'basePrice' | 'priceNote'>): string {
  return outcome.priceNote ?? formatMoney(outcome.basePrice)
}

export function filterMarketplace(
  outcomes: Outcome[],
  filters: MarketplaceFilters,
): Outcome[] {
  const q = filters.query.trim().toLowerCase()
  return outcomes.filter((outcome) => {
    if (outcome.status !== 'live') return false
    if (filters.vertical !== 'all' && outcome.vertical !== filters.vertical) return false
    if (filters.category !== 'all' && outcome.category !== filters.category) return false
    if (filters.minPrice != null && outcome.basePrice < filters.minPrice) return false
    if (filters.maxPrice != null && outcome.basePrice > filters.maxPrice) return false
    if (filters.maxSlaHours != null && outcome.slaHours > filters.maxSlaHours) return false
    if (!q) return true
    const haystack = [
      outcome.title,
      outcome.description,
      outcome.category,
      outcome.vertical,
      outcome.successCriteria,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function liveOutcomeCount(outcomes: Outcome[], sellerId: string): number {
  return outcomes.filter((o) => o.sellerId === sellerId && o.status === 'live').length
}

export function tierForUser(user: User, tiers: SubscriptionTier[]): SubscriptionTier {
  return tiers.find((t) => t.name === user.subscriptionTier) ?? tiers[0]
}

export function canPublishLive(
  user: User,
  outcomes: Outcome[],
  tiers: SubscriptionTier[],
  editingId?: string,
): { ok: boolean; reason?: string } {
  const tier = tierForUser(user, tiers)
  if (tier.liveOutcomeLimit == null) return { ok: true }
  const live = outcomes.filter(
    (o) => o.sellerId === user.id && o.status === 'live' && o.id !== editingId,
  ).length
  if (live >= tier.liveOutcomeLimit) {
    return {
      ok: false,
      reason: `${tier.name} allows ${tier.liveOutcomeLimit} live outcomes. Upgrade or pause one first.`,
    }
  }
  return { ok: true }
}

export interface SellerMetrics {
  gmv: number
  completions: number
  disputeRate: number
  totalOrders: number
}

export function computeSellerMetrics(sellerId: string, outcomes: Outcome[], orders: Order[]): SellerMetrics {
  const outcomeIds = new Set(outcomes.filter((o) => o.sellerId === sellerId).map((o) => o.id))
  const sellerOrders = orders.filter((o) => outcomeIds.has(o.outcomeId))
  const gmv = sellerOrders.reduce((sum, o) => sum + o.basePrice + (o.bonusPrice ?? 0), 0)
  const completions = sellerOrders.filter((o) => o.status === 'completed').length
  const disputes = sellerOrders.filter((o) => o.status === 'disputed').length
  return {
    gmv,
    completions,
    disputeRate: sellerOrders.length === 0 ? 0 : disputes / sellerOrders.length,
    totalOrders: sellerOrders.length,
  }
}

export function platformTake(amount: number, takeRate: number): number {
  return Math.round(amount * takeRate * 100) / 100
}

export function defaultMarketplaceFilters(): MarketplaceFilters {
  return {
    query: '',
    vertical: 'all',
    category: 'all',
    minPrice: null,
    maxPrice: null,
    maxSlaHours: null,
  }
}

export function clsx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
