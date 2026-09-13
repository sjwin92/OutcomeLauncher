import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OutcomeStatusBadge } from '../components/StatusBadge'
import { Alert, Button, EmptyState, PageHeader } from '../components/ui'
import { useStore } from '../data/store'
import type { OutcomeTemplate } from '../data/types'
import { formatMoney, formatSla, outcomePriceLabel } from '../lib/utils'
import { BuyerDashboard } from './BuyerDashboard'

export function Dashboard() {
  const { currentUser } = useStore()
  if (currentUser?.role === 'buyer') return <BuyerDashboard />
  return <SellerDashboard />
}

function SellerDashboard() {
  const navigate = useNavigate()
  const { currentUser, outcomes, templates, orders, duplicateOutcome, toggleOutcomeStatus, cloneTemplate } =
    useStore()
  const [notice, setNotice] = useState('')
  const mine = outcomes.filter((o) => o.sellerId === currentUser?.id)
  const incoming = orders.filter((order) => mine.some((o) => o.id === order.outcomeId))

  const grouped = useMemo(() => {
    const creator = templates.filter((t) => t.vertical === 'Creator/Brand')
    const saas = templates.filter((t) => t.vertical === 'SaaS Builder')
    return { creator, saas }
  }, [templates])

  function onToggle(id: string) {
    const result = toggleOutcomeStatus(id)
    setNotice(result.ok ? '' : result.error ?? 'Could not update status.')
  }

  function onDuplicate(id: string) {
    const copy = duplicateOutcome(id)
    if (copy) navigate(`/dashboard/outcomes/${copy.id}/edit`)
  }

  function onClone(templateId: string) {
    const result = cloneTemplate(templateId)
    if (!result.ok || !result.outcome) {
      setNotice(result.error ?? 'Could not clone template.')
      return
    }
    setNotice('Cloned as a draft. Review and go live when ready — these are standardized outcome offers.')
    navigate(`/dashboard/outcomes/${result.outcome.id}/edit`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="Seller dashboard"
        title={`Welcome, ${currentUser?.name ?? 'seller'}`}
        description="Create fixed-scope outcomes, clone standardized templates, and track SLA-bound orders."
        actions={
          <>
            <Link to="/dashboard/outcomes/new" className="btn-primary">
              Create outcome
            </Link>
            <Link to="/orders" className="btn-secondary">
              View orders ({incoming.length})
            </Link>
          </>
        }
      />

      {notice ? (
        <div className="mb-6">
          <Alert tone="info">{notice}</Alert>
        </div>
      ) : null}

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Your outcomes</h2>
        {mine.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No outcomes yet"
              body="Clone a standardized template or create one from scratch."
              action={
                <Link to="/dashboard/outcomes/new" className="btn-primary">
                  Create outcome
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto card">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Price / SLA</th>
                  <th className="px-4 py-3">Stats</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mine.map((outcome) => (
                  <tr key={outcome.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{outcome.title}</p>
                      <p className="text-xs text-slate-500">
                        {outcome.vertical} · {outcome.category}
                        {outcome.templateId ? ' · from template' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <OutcomeStatusBadge status={outcome.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {outcomePriceLabel(outcome)} · {formatSla(outcome.slaHours)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {outcome.stats.totalOrders} orders · {Math.round(outcome.stats.completionRate * 100)}% ·{' '}
                      {outcome.stats.avgTimeToOutcomeHours || '—'}h
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/dashboard/outcomes/${outcome.id}/edit`} className="btn-secondary px-2 py-1 text-xs">
                          Edit
                        </Link>
                        <button className="btn-secondary px-2 py-1 text-xs" onClick={() => onDuplicate(outcome.id)}>
                          Duplicate
                        </button>
                        <Link to={`/outcome/${outcome.id}`} className="btn-secondary px-2 py-1 text-xs">
                          Client page
                        </Link>
                        <button className="btn-ghost px-2 py-1 text-xs" onClick={() => onToggle(outcome.id)}>
                          {outcome.status === 'live' ? 'Pause' : 'Go live'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">Clone a standardized outcome offer</h2>
        <p className="mt-1 text-sm text-slate-600">
          These are the platform’s preloaded templates — not custom gigs. Cloning creates a draft you can edit and publish.
        </p>
        <TemplateGrid title="Creator / Brand" templates={grouped.creator} onClone={onClone} />
        <TemplateGrid title="SaaS Builder" templates={grouped.saas} onClone={onClone} />
      </section>
    </div>
  )
}

function TemplateGrid({
  title,
  templates,
  onClone,
}: {
  title: string
  templates: OutcomeTemplate[]
  onClone: (id: string) => void
}) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <article key={template.id} className="card p-5">
            <p className="badge bg-slate-100 text-slate-700">{template.category}</p>
            <h4 className="mt-2 font-semibold text-slate-900">{template.title}</h4>
            <p className="mt-2 line-clamp-3 text-sm text-slate-600">{template.description}</p>
            <p className="mt-3 text-sm font-medium text-slate-800">
              {template.priceNote ?? formatMoney(template.basePrice)} · {formatSla(template.slaHours)}
            </p>
            {template.bonusFormula ? <p className="mt-1 text-xs text-emerald-700">{template.bonusFormula}</p> : null}
            <Button className="mt-4" variant="secondary" onClick={() => onClone(template.id)}>
              Clone as draft
            </Button>
          </article>
        ))}
      </div>
    </div>
  )
}
