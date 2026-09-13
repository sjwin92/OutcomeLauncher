import { beforeEach, describe, expect, it } from 'vitest'
import {
  createSeedSnapshot,
  hasPersistedSnapshot,
  loadSnapshot,
  resetSnapshot,
  saveSnapshot,
  STORAGE_KEY,
  STORAGE_VERSION,
} from '../data/repository'
import { SEED_ORDERS, SEED_OUTCOMES, SEED_USERS, SELLER_ID } from '../data/seed'
import { TEMPLATES } from '../data/templates'
import {
  computeSellerMetrics,
  defaultMarketplaceFilters,
  featuredOutcomes,
  filterMarketplace,
  isAdminEmail,
  mockHash,
  platformTake,
} from '../lib/utils'

const ORIGINAL_NINE = [
  'Abandoned-Cart Recovery Sprint',
  'Product Page SEO Rewrite Pack',
  'Missed-Call-to-Booking System',
  'Content Sprint (Calls → Assets)',
  'Zero-Touch Onboarding Flow',
  'Integration Pack (Top 3)',
  'Analytics & Activation Instrumentation',
  'Billing & Plans Cleanup',
  'Docs + In-App Help Overhaul',
]

const NEW_SAAS_ONE_OFF = [
  'Auth / SSO Lite Setup',
  'Waitlist → Paid Conversion Sprint',
  'Churn Save Flow (cancel / retention)',
  'Data Migration Pack (CSV / Stripe customers)',
  'Compliance Lite (privacy / DPA / terms pages)',
]

function mockStorage() {
  const map = new Map<string, string>()
  const storage: Storage = {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => {
      map.delete(key)
    },
    setItem: (key, value) => {
      map.set(key, value)
    },
  }
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
  return storage
}

describe('mockHash', () => {
  it('is deterministic and not the raw password', () => {
    expect(mockHash('demo1234')).toBe(mockHash('demo1234'))
    expect(mockHash('demo1234')).not.toBe('demo1234')
    expect(mockHash('demo1234')).not.toBe(mockHash('other'))
  })
})

describe('templates', () => {
  it('keeps the original nine offers and adds SaaS + retainer templates', () => {
    expect(TEMPLATES.map((t) => t.title)).toEqual(expect.arrayContaining(ORIGINAL_NINE))
    expect(TEMPLATES.map((t) => t.title)).toEqual(expect.arrayContaining(NEW_SAAS_ONE_OFF))
    expect(TEMPLATES.filter((t) => t.vertical === 'Creator/Brand')).toHaveLength(4)
    expect(TEMPLATES.filter((t) => t.kind === 'one_off')).toHaveLength(14)
    expect(TEMPLATES.filter((t) => t.kind === 'retainer')).toHaveLength(3)
    expect(TEMPLATES).toHaveLength(17)
  })
})

describe('marketplace filters', () => {
  it('defaults to the SaaS Builder vertical', () => {
    expect(defaultMarketplaceFilters().vertical).toBe('SaaS Builder')
    const saas = filterMarketplace(SEED_OUTCOMES, defaultMarketplaceFilters())
    expect(saas.length).toBeGreaterThan(0)
    expect(saas.every((o) => o.vertical === 'SaaS Builder' && o.status === 'live')).toBe(true)
  })

  it('hides non-live outcomes and honors vertical, kind, price, and SLA', () => {
    const liveOnly = filterMarketplace(SEED_OUTCOMES, { ...defaultMarketplaceFilters(), vertical: 'all' })
    expect(liveOnly.every((o) => o.status === 'live')).toBe(true)
    expect(liveOnly.some((o) => o.status === 'draft')).toBe(false)

    const saas = filterMarketplace(SEED_OUTCOMES, {
      ...defaultMarketplaceFilters(),
      vertical: 'SaaS Builder',
    })
    expect(saas.every((o) => o.vertical === 'SaaS Builder')).toBe(true)

    const retainers = filterMarketplace(SEED_OUTCOMES, {
      ...defaultMarketplaceFilters(),
      kind: 'retainer',
    })
    expect(retainers.length).toBeGreaterThan(0)
    expect(retainers.every((o) => o.kind === 'retainer')).toBe(true)

    const cheap = filterMarketplace(SEED_OUTCOMES, {
      ...defaultMarketplaceFilters(),
      vertical: 'all',
      maxPrice: 400,
    })
    expect(cheap.every((o) => o.basePrice <= 400)).toBe(true)

    const fast = filterMarketplace(SEED_OUTCOMES, {
      ...defaultMarketplaceFilters(),
      vertical: 'all',
      maxSlaHours: 168,
    })
    expect(fast.every((o) => o.slaHours <= 168)).toBe(true)

    const search = filterMarketplace(SEED_OUTCOMES, {
      ...defaultMarketplaceFilters(),
      vertical: 'all',
      query: 'abandoned',
    })
    expect(search).toHaveLength(1)
    expect(search[0].title).toMatch(/Abandoned-Cart/)
  })

  it('biases the featured rail toward SaaS Builder', () => {
    const featured = featuredOutcomes(SEED_OUTCOMES)
    expect(featured[0]?.vertical).toBe('SaaS Builder')
    expect(featured.every((o) => o.status === 'live')).toBe(true)
  })
})

describe('admin + economics + escrow', () => {
  it('treats admin@ emails as admin', () => {
    expect(isAdminEmail('admin@outcomelauncher.com')).toBe(true)
    expect(isAdminEmail('buyer@demo.com')).toBe(false)
  })

  it('computes GMV, completions, dispute rate, and 7% take', () => {
    const metrics = computeSellerMetrics(SELLER_ID, SEED_OUTCOMES, SEED_ORDERS)
    expect(metrics.totalOrders).toBeGreaterThan(0)
    expect(metrics.gmv).toBeGreaterThan(0)
    expect(platformTake(1000, 0.07)).toBe(70)
    const demoSeller = SEED_USERS.find((u) => u.id === SELLER_ID)
    expect(demoSeller?.verified).toBe(true)
    expect(demoSeller?.stack?.includes('Stripe')).toBe(true)
  })

  it('seeds escrow and measurement states', () => {
    expect(SEED_ORDERS.find((o) => o.id === 'ord_paid_cart')?.escrowStatus).toBe('escrowed')
    expect(SEED_ORDERS.find((o) => o.id === 'ord_done_calls')?.escrowStatus).toBe('released')
    expect(SEED_ORDERS.find((o) => o.id === 'ord_progress_seo')?.measurementConnected).toBe(true)
    expect(SEED_OUTCOMES.every((o) => o.kind === 'one_off' || o.kind === 'retainer')).toBe(true)
  })
})

describe('repository persistence', () => {
  beforeEach(() => {
    mockStorage()
  })

  it('seeds on first visit and hydrates afterwards', () => {
    expect(hasPersistedSnapshot()).toBe(false)
    const first = loadSnapshot()
    expect(first.version).toBe(STORAGE_VERSION)
    expect(first.users).toHaveLength(SEED_USERS.length)
    first.sessionUserId = 'usr_buyer'
    saveSnapshot(first)
    expect(hasPersistedSnapshot()).toBe(true)
    expect(globalThis.localStorage.getItem(STORAGE_KEY)).toContain('usr_buyer')
    const second = loadSnapshot()
    expect(second.sessionUserId).toBe('usr_buyer')
    expect(second.outcomes).toHaveLength(first.outcomes.length)
  })

  it('reseeds when reset', () => {
    const dirty = createSeedSnapshot()
    dirty.sessionUserId = 'usr_buyer'
    dirty.users = dirty.users.slice(0, 1)
    saveSnapshot(dirty)
    const reset = resetSnapshot()
    expect(reset.users).toHaveLength(SEED_USERS.length)
    expect(reset.sessionUserId).toBeNull()
    expect(loadSnapshot().users).toHaveLength(SEED_USERS.length)
  })
})
