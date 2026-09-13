import { useMemo, useState } from 'react'
import { OutcomeCard } from '../components/OutcomeCard'
import { EmptyState, Field, Select, TextInput } from '../components/ui'
import { useStore } from '../data/store'
import { CATEGORIES, VERTICALS, type Vertical } from '../data/types'
import { defaultMarketplaceFilters, filterMarketplace } from '../lib/utils'

export function Marketplace() {
  const { outcomes, users } = useStore()
  const [filters, setFilters] = useState(defaultMarketplaceFilters)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [maxDays, setMaxDays] = useState('')

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
        Live outcomes only. Every card is a fixed-scope result with an SLA — not a gig listing.
      </p>

      <div className="card mt-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <Field label="Search">
          <TextInput
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            placeholder="Cart recovery, onboarding…"
          />
        </Field>
        <Field label="Vertical">
          <Select
            value={filters.vertical}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                vertical: e.target.value as Vertical | 'all',
                category: 'all',
              }))
            }
          >
            <option value="all">All verticals</option>
            {VERTICALS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
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
          <TextInput
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Max price ($)">
          <TextInput
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="8000"
          />
        </Field>
        <Field label="Max turnaround (days)">
          <TextInput
            type="number"
            min={1}
            value={maxDays}
            onChange={(e) => setMaxDays(e.target.value)}
            placeholder="21"
          />
        </Field>
      </div>

      <p className="mt-6 text-sm text-slate-500">{results.length} live outcome{results.length === 1 ? '' : 's'}</p>

      {results.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No outcomes match" body="Relax a filter or clear the search to see live offers." />
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
  )
}
