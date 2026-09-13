import { useEffect, useMemo, useState } from 'react'
import { OutcomeCard } from '../components/OutcomeCard'
import { EmptyState, Field, Select, TextInput } from '../components/ui'
import { useStore } from '../data/store'
import { CATEGORIES, type OutcomeKind, type Vertical } from '../data/types'
import { defaultMarketplaceFilters, filterMarketplace } from '../lib/utils'
import { SearchClear, SlidingTabs } from '../motion/MotionBits'

export function Marketplace() {
  const { outcomes, users } = useStore()
  const [filters, setFilters] = useState(defaultMarketplaceFilters)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [maxDays, setMaxDays] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 480)
    return () => window.clearTimeout(timer)
  }, [])

  const categories =
    filters.vertical === 'all'
      ? [...CATEGORIES['Creator/Brand'], ...CATEGORIES['SaaS Builder']]
      : CATEGORIES[filters.vertical]

  const applied = useMemo(
    () => ({
      ...filters,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      maxSlaHours: maxDays ? Number(maxDays) * 24 : null,
    }),
    [filters, minPrice, maxPrice, maxDays],
  )

  const results = useMemo(() => filterMarketplace(outcomes, applied), [outcomes, applied])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
      <p className="mt-2 text-sm text-slate-600">
        Defaults to SaaS Builder. Every card is a fixed-scope result or monthly retainer with an SLA — not a gig listing.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SlidingTabs
          ariaLabel="Vertical"
          value={filters.vertical}
          options={[
            { id: 'SaaS Builder' as const, label: 'SaaS Builder' },
            { id: 'Creator/Brand' as const, label: 'Creator / Brand' },
            { id: 'all' as const, label: 'All' },
          ]}
          onChange={(vertical) =>
            setFilters((f) => ({ ...f, vertical: vertical as Vertical | 'all', category: 'all' }))
          }
        />
        <SlidingTabs
          ariaLabel="Kind"
          value={filters.kind}
          options={[
            { id: 'all' as const, label: 'All kinds' },
            { id: 'one_off' as const, label: 'One-off' },
            { id: 'retainer' as const, label: 'Retainers' },
          ]}
          onChange={(kind) => setFilters((f) => ({ ...f, kind: kind as OutcomeKind | 'all' }))}
        />
      </div>

      <div className="card mt-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Search">
          <SearchClear
            value={filters.query}
            onChange={(query) => setFilters((f) => ({ ...f, query }))}
            placeholder="Auth, churn, waitlist…"
          />
        </Field>
        <Field label="Category">
          <Select
            value={filters.category}
            onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Min price ($)">
          <TextInput type="number" min={0} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
        </Field>
        <Field label="Max price ($)">
          <TextInput type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="8000" />
        </Field>
        <Field label="Max turnaround (days)">
          <TextInput type="number" min={1} value={maxDays} onChange={(e) => setMaxDays(e.target.value)} placeholder="21" />
        </Field>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {results.length} live outcome{results.length === 1 ? '' : 's'}
      </p>

      <div className={`t-skel t-skel-flow mt-4 ${loading ? '' : 'is-revealed'}`}>
        <div className={`t-skel-skeleton grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${loading ? 'is-pulsing' : ''}`}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="card h-64 bg-slate-100" />
          ))}
        </div>
        <div className="t-skel-content">
          {results.length === 0 ? (
            <EmptyState
              title="No outcomes match"
              body="Relax a filter, switch vertical, or clear search. Creator/Brand listings are one tab away."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((outcome) => (
                <OutcomeCard
                  key={outcome.id}
                  outcome={outcome}
                  seller={users.find((u) => u.id === outcome.sellerId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
