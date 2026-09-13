import { Link } from 'react-router-dom'
import { OrderStatusBadge } from '../components/StatusBadge'
import { EmptyState, PageHeader } from '../components/ui'
import { useStore } from '../data/store'
import { formatDate, formatMoney } from '../lib/utils'

export function BuyerDashboard() {
  const { currentUser, orders } = useStore()
  const mine = orders.filter((o) => o.buyerId === currentUser?.id)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="Buyer dashboard"
        title={`Welcome, ${currentUser?.name ?? 'buyer'}`}
        description="Track purchased outcomes, agent logs, and proof of work. Rate completed work."
        actions={
          <Link to="/marketplace" className="btn-primary">
            Browse outcomes
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Open orders" value={mine.filter((o) => o.status === 'paid' || o.status === 'in_progress').length} />
        <Stat label="Completed" value={mine.filter((o) => o.status === 'completed').length} />
        <Stat
          label="Spend (session)"
          value={formatMoney(mine.reduce((sum, o) => sum + o.basePrice + (o.bonusPrice ?? 0), 0))}
        />
      </div>

      {mine.length === 0 ? (
        <EmptyState
          title="No orders yet"
          body="Buy a live outcome from the marketplace. Demo buyer already has a few seeded orders."
          action={
            <Link to="/marketplace" className="btn-primary">
              Go to marketplace
            </Link>
          }
        />
      ) : (
        <OrderTable buyerView />
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

export function OrderTable({ buyerView }: { buyerView?: boolean }) {
  const { currentUser, orders, outcomes, users } = useStore()
  const rows = orders
    .filter((order) => {
      const outcome = outcomes.find((o) => o.id === order.outcomeId)
      if (!outcome || !currentUser) return false
      if (buyerView || currentUser.role === 'buyer') return order.buyerId === currentUser.id
      return outcome.sellerId === currentUser.id
    })
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No orders"
        body={buyerView ? 'Purchase an outcome to see it here.' : 'When a buyer pays, the order appears here.'}
      />
    )
  }

  return (
    <div className="card overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Outcome</th>
            <th className="px-4 py-3">{buyerView || currentUser?.role === 'buyer' ? 'Seller' : 'Buyer'}</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">SLA deadline</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((order) => {
            const outcome = outcomes.find((o) => o.id === order.outcomeId)
            const buyer = users.find((u) => u.id === order.buyerId)
            const seller = outcome ? users.find((u) => u.id === outcome.sellerId) : undefined
            const counterpart =
              buyerView || currentUser?.role === 'buyer' ? seller?.name ?? 'Seller' : buyer?.name ?? 'Buyer'
            return (
              <tr key={order.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{outcome?.title ?? 'Unknown'}</p>
                  <p className="text-xs text-slate-500">{formatMoney(order.basePrice)}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">{counterpart}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(order.deadlineAt)}</td>
                <td className="px-4 py-3">
                  <Link to={`/orders/${order.id}`} className="btn-secondary px-2 py-1 text-xs">
                    Open
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
