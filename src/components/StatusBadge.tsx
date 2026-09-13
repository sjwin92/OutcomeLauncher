import type { OrderStatus, OutcomeStatus } from '../data/types'
import { clsx } from '../lib/utils'

const outcomeStyles: Record<OutcomeStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  live: 'bg-emerald-50 text-emerald-700',
  paused: 'bg-amber-50 text-amber-800',
}

const orderStyles: Record<OrderStatus, string> = {
  paid: 'bg-indigo-50 text-indigo-700',
  in_progress: 'bg-sky-50 text-sky-800',
  completed: 'bg-emerald-50 text-emerald-700',
  disputed: 'bg-rose-50 text-rose-700',
}

export function OutcomeStatusBadge({ status }: { status: OutcomeStatus }) {
  return <span className={clsx('badge capitalize', outcomeStyles[status])}>{status}</span>
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const label = status.replace('_', ' ')
  return <span className={clsx('badge capitalize', orderStyles[status])}>{label}</span>
}

export function OutcomeNotGigBadge() {
  return (
    <span className="badge bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100">
      Outcome, not a gig
    </span>
  )
}

export function VerifiedBadge() {
  return <span className="badge bg-emerald-50 text-emerald-700">Verified seller</span>
}
