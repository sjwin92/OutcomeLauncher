import { Link, useParams } from 'react-router-dom'
import { OrderStatusBadge } from '../components/StatusBadge'
import { Alert } from '../components/ui'
import { useStore } from '../data/store'
import { formatDate, formatMoney, formatSla } from '../lib/utils'

const STEPS = ['paid', 'in_progress', 'completed'] as const

export function Confirmation() {
  const { orderId } = useParams()
  const { orders, outcomes } = useStore()
  const order = orders.find((o) => o.id === orderId)
  const outcome = order ? outcomes.find((o) => o.id === order.outcomeId) : undefined

  if (!order || !outcome) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Alert tone="error">Order not found in this session.</Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Alert tone="success">Payment recorded. Your outcome is queued against the SLA.</Alert>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Order confirmed</h1>
      <p className="mt-2 text-slate-600">
        {outcome.title} · {formatMoney(order.basePrice)} · SLA {formatSla(outcome.slaHours)}
      </p>
      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Status tracker</p>
          <OrderStatusBadge status={order.status} />
        </div>
        <ol className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
          {STEPS.map((step) => {
            const active =
              STEPS.indexOf(step) <= STEPS.indexOf(order.status === 'disputed' ? 'in_progress' : order.status === 'paid' ? 'paid' : order.status)
            return (
              <li key={step} className={`rounded-lg px-2 py-3 ${active ? 'bg-indigo-50 text-indigo-800' : 'bg-slate-50 text-slate-400'}`}>
                <span className="font-semibold capitalize">{step.replace('_', ' ')}</span>
              </li>
            )
          })}
        </ol>
        <p className="mt-4 text-sm text-slate-600">Deadline {formatDate(order.deadlineAt)}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to={`/orders/${order.id}`} className="btn-primary">
            Open order
          </Link>
          <Link to="/orders" className="btn-secondary">
            All orders
          </Link>
        </div>
      </div>
    </div>
  )
}
