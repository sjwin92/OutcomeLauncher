import { Alert, Button, Field, PageHeader, TextInput } from '../components/ui'
import { VerifiedBadge } from '../components/StatusBadge'
import { useStore } from '../data/store'
import { STORAGE_KEY } from '../data/repository'
import type { SubscriptionTierName } from '../data/types'
import { computeSellerMetrics, formatMoney, platformTake } from '../lib/utils'
import { NumberPop, SpinningStat } from '../motion/MotionBits'
import { useToast } from '../motion/ToastProvider'

export function Admin() {
  const { users, outcomes, orders, settings, updateTakeRate, updateTier, toggleVerified, resetDemoData } = useStore()
  const { pushToast } = useToast()
  const sellers = users.filter((u) => u.role === 'seller')
  const gmv = orders.reduce((sum, o) => sum + o.basePrice + (o.bonusPrice ?? 0), 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="Admin"
        title="Platform settings"
        description="Adjust subscription tiers and take rate. Changes persist in localStorage (versioned). Emails containing admin@ can open this page."
        actions={
          <Button
            variant="danger"
            onClick={() => {
              resetDemoData()
              pushToast('Demo data reset')
            }}
          >
            Reset demo data
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <SpinningStat label="GMV" value={formatMoney(gmv)} />
        <div className="card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Orders</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            <NumberPop value={String(orders.length)} />
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Take on GMV</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatMoney(platformTake(gmv, settings.takeRate))}</p>
        </div>
      </div>

      <section className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Take rate</h2>
        <p className="mt-1 text-sm text-slate-600">
          Default 7%. Applied to GMV in the seller table below. Current example on $1,000:{' '}
          {formatMoney(platformTake(1000, settings.takeRate))}
        </p>
        <div className="mt-4 flex max-w-sm items-end gap-3">
          <Field label="Take rate (%)">
            <TextInput
              type="number"
              min={0}
              max={30}
              step="0.1"
              value={(Math.round(settings.takeRate * 1000) / 10).toString()}
              onChange={(e) => {
                const pct = Number(e.target.value)
                if (Number.isFinite(pct) && pct >= 0 && pct <= 30) updateTakeRate(pct / 100)
              }}
            />
          </Field>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Subscription tiers</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {settings.subscriptionTiers.map((tier) => (
            <article key={tier.name} className="card p-5">
              <h3 className="text-base font-semibold text-slate-900">{tier.name}</h3>
              <Field label="Monthly price (USD)">
                <TextInput
                  type="number"
                  min={0}
                  value={tier.price}
                  onChange={(e) =>
                    updateTier(tier.name as SubscriptionTierName, { price: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <Field label="Live outcome limit" hint="Blank or 0 = unlimited">
                <TextInput
                  type="number"
                  min={0}
                  value={tier.liveOutcomeLimit ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value
                    updateTier(tier.name, {
                      liveOutcomeLimit: raw === '' || Number(raw) === 0 ? null : Number(raw),
                    })
                  }}
                />
              </Field>
              <Field label="Monthly order limit" hint="Blank or 0 = unlimited">
                <TextInput
                  type="number"
                  min={0}
                  value={tier.monthlyOrderLimit ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value
                    updateTier(tier.name, {
                      monthlyOrderLimit: raw === '' || Number(raw) === 0 ? null : Number(raw),
                    })
                  }}
                />
              </Field>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Sellers</h2>
        <div className="card mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">GMV</th>
                <th className="px-4 py-3">Platform take</th>
                <th className="px-4 py-3">Completions</th>
                <th className="px-4 py-3">Dispute rate</th>
                <th className="px-4 py-3">Verified</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => {
                const metrics = computeSellerMetrics(seller.id, outcomes, orders)
                return (
                  <tr key={seller.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{seller.name}</p>
                      <p className="text-xs text-slate-500">{seller.email}</p>
                    </td>
                    <td className="px-4 py-3">{seller.subscriptionTier}</td>
                    <td className="px-4 py-3">{formatMoney(metrics.gmv)}</td>
                    <td className="px-4 py-3">{formatMoney(platformTake(metrics.gmv, settings.takeRate))}</td>
                    <td className="px-4 py-3">{metrics.completions}</td>
                    <td className="px-4 py-3">{Math.round(metrics.disputeRate * 100)}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {seller.verified ? <VerifiedBadge /> : <span className="text-xs text-slate-500">Unverified</span>}
                        <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => toggleVerified(seller.id)}>
                          Toggle
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6">
        <Alert tone="info">
          Users, outcomes, orders, settings, and session persist under <code>{STORAGE_KEY}</code>. Reset demo data
          reseeds the original catalog. Next backend step: swap <code>src/data/repository.ts</code> for Supabase.
        </Alert>
      </div>
    </div>
  )
}
