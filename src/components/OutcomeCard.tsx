import { Link } from 'react-router-dom'
import type { Outcome, User } from '../data/types'
import { formatMoney, formatSla, outcomePriceLabel, sellerStack } from '../lib/utils'
import { TiltCard } from '../motion/MotionBits'
import { CompletionRate, KindBadge, OutcomeNotGigBadge, OutcomeStatusBadge, StackBadges, VerifiedBadge } from './StatusBadge'

export function OutcomeCard({
  outcome,
  seller,
  showStatus = false,
  tilt = true,
}: {
  outcome: Outcome
  seller?: User
  showStatus?: boolean
  tilt?: boolean
}) {
  const body = (
    <article className="card flex h-full flex-col p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <OutcomeNotGigBadge />
        <KindBadge kind={outcome.kind} />
        {showStatus ? <OutcomeStatusBadge status={outcome.status} /> : null}
        {seller?.verified ? <VerifiedBadge /> : null}
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {outcome.vertical} · {outcome.category}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">{outcome.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{outcome.description}</p>
      <div className="mt-3">
        <StackBadges stack={sellerStack(seller, outcome)} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-500">{outcome.kind === 'retainer' ? 'Monthly base' : 'Price'}</dt>
          <dd className="font-semibold text-slate-900">{outcomePriceLabel(outcome)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">{outcome.kind === 'retainer' ? 'Cadence' : 'SLA'}</dt>
          <dd className="font-semibold text-slate-900">{formatSla(outcome.slaHours)}</dd>
        </div>
      </dl>
      {outcome.monthlyMetric ? (
        <p className="mt-3 text-xs text-violet-700">Success metric: {outcome.monthlyMetric}</p>
      ) : null}
      {outcome.bonusFormula ? (
        <p className="mt-2 text-xs text-emerald-700">Bonus: {outcome.bonusFormula}</p>
      ) : null}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <CompletionRate rate={outcome.stats.completionRate} orders={outcome.stats.totalOrders} />
        <span className="text-xs text-slate-500">{formatMoney(outcome.basePrice)} base</span>
      </div>
      <Link to={`/outcome/${outcome.id}`} className="btn-primary mt-4 w-full">
        View details
      </Link>
    </article>
  )

  return tilt ? <TiltCard>{body}</TiltCard> : body
}
