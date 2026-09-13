import type { EscrowStatus, OutcomeKind, OrderStatus, OutcomeStatus, StackBadge } from '../data/types'
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
  return (
    <span className="badge bg-emerald-600 text-white shadow-sm">
      Verified seller
    </span>
  )
}

export function KindBadge({ kind }: { kind: OutcomeKind }) {
  return (
    <span className={clsx('badge', kind === 'retainer' ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-700')}>
      {kind === 'retainer' ? 'Monthly retainer' : 'One-off'}
    </span>
  )
}

export function EscrowBadge({ status }: { status: EscrowStatus }) {
  return (
    <span className={clsx('badge', status === 'released' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800')}>
      {status === 'released' ? 'Escrow released' : 'Held in escrow'}
    </span>
  )
}

export function StackBadges({ stack }: { stack?: StackBadge[] }) {
  if (!stack?.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {stack.map((item) => (
        <span key={item} className="badge bg-slate-900 text-slate-50">
          {item}
        </span>
      ))}
    </div>
  )
}

export function CompletionRate({ rate, orders }: { rate: number; orders: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {Math.round(rate * 100)}% completion · {orders} orders
    </span>
  )
}
