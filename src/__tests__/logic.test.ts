import { describe, expect, it } from 'vitest'
import { SEED_ORDERS, SEED_OUTCOMES, SEED_USERS, SELLER_ID } from '../data/seed'
import { TEMPLATES } from '../data/templates'
import {
  computeSellerMetrics,
  defaultMarketplaceFilters,
  filterMarketplace,
  isAdminEmail,
  mockHash,
  platformTake,
} from '../lib/utils'

describe('mockHash', () => {
  it('is deterministic and not the raw password', () => {
    expect(mockHash('demo1234')).toBe(mockHash('demo1234'))
    expect(mockHash('demo1234')).not.toBe('demo1234')
    expect(mockHash('demo1234')).not.toBe(mockHash('other'))
  })
})

describe('templates', () => {
  it('includes all nine standardized outcome offers', () => {
    expect(TEMPLATES).toHaveLength(9)
    expect(TEMPLATES.filter((t) => t.vertical === 'Creator/Brand')).toHaveLength(4)
    expect(TEMPLATES.filter((t) => t.vertical === 'SaaS Builder')).toHaveLength(5)
    expect(TEMPLATES.map((t) => t.title)).toEqual([
      'Abandoned-Cart Recovery Sprint',
      'Product Page SEO Rewrite Pack',
      'Missed-Call-to-Booking System',
      'Content Sprint (Calls → Assets)',
      'Zero-Touch Onboarding Flow',
      'Integration Pack (Top 3)',
      'Analytics & Activation Instrumentation',
      'Billing & Plans Cleanup',
      'Docs + In-App Help Overhaul',
    ])
  })
})

describe('marketplace filters', () => {
  it('hides non-live outcomes and honors vertical, price, and SLA', () => {
    const liveOnly = filterMarketplace(SEED_OUTCOMES, defaultMarketplaceFilters())
    expect(liveOnly.every((o) => o.status === 'live')).toBe(true)
    expect(liveOnly.some((o) => o.status === 'draft')).toBe(false)

    const saas = filterMarketplace(SEED_OUTCOMES, {
      ...defaultMarketplaceFilters(),
      vertical: 'SaaS Builder',
    })
    expect(saas.every((o) => o.vertical === 'SaaS Builder')).toBe(true)

    const cheap = filterMarketplace(SEED_OUTCOMES, {
      ...defaultMarketplaceFilters(),
      maxPrice: 400,
    })
    expect(cheap.every((o) => o.basePrice <= 400)).toBe(true)

    const fast = filterMarketplace(SEED_OUTCOMES, {
      ...defaultMarketplaceFilters(),
      maxSlaHours: 168,
    })
    expect(fast.every((o) => o.slaHours <= 168)).toBe(true)

    const search = filterMarketplace(SEED_OUTCOMES, {
      ...defaultMarketplaceFilters(),
      query: 'abandoned',
    })
    expect(search).toHaveLength(1)
    expect(search[0].title).toMatch(/Abandoned-Cart/)
  })
})

describe('admin + economics', () => {
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
  })
})
