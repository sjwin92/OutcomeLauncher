import { useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { OrderStatusBadge } from '../components/StatusBadge'
import { Alert, Button, Field, TextArea } from '../components/ui'
import { useStore } from '../data/store'
import { formatDate, formatMoney } from '../lib/utils'

export function OrderDetail() {
  const { id } = useParams()
  const {
    currentUser,
    orders,
    outcomes,
    users,
    runningOrderIds,
    runWorkflow,
    markCompleted,
    requestManualFix,
    flagDispute,
    rateOrder,
  } = useStore()
  const order = orders.find((o) => o.id === id)
  const outcome = order ? outcomes.find((o) => o.id === order.outcomeId) : undefined
  const buyer = order ? users.find((u) => u.id === order.buyerId) : undefined
  const seller = outcome ? users.find((u) => u.id === outcome.sellerId) : undefined
  const isSeller = currentUser?.id === outcome?.sellerId
  const isBuyer = currentUser?.id === order?.buyerId
  const running = order ? runningOrderIds.includes(order.id) : false

  const [stars, setStars] = useState(order?.rating?.stars ?? 5)
  const [review, setReview] = useState(order?.rating?.review ?? '')
  const [message, setMessage] = useState('')

  const progress = useMemo(() => {
    if (!order) return 0
    if (order.proofReport) return 100
    const total = 5
    const done = order.workflowLogs.filter((l) => l.status === 'done').length
    const runningStep = order.workflowLogs.some((l) => l.status === 'running') ? 0.45 : 0
    return Math.min(100, Math.round(((done + runningStep) / total) * 100))
  }, [order])

  if (!order || !outcome) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Alert tone="error">Order not found.</Alert>
      </div>
    )
  }

  if (!isSeller && !isBuyer) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Alert tone="error">You do not have access to this order.</Alert>
      </div>
    )
  }

  const orderId = order.id

  async function onRun() {
    setMessage('')
    const result = await runWorkflow(orderId)
    if (!result.ok) setMessage(result.error ?? 'Workflow failed.')
  }

  function act(fn: (id: string) => { ok: boolean; error?: string }) {
    const result = fn(orderId)
    setMessage(result.ok ? '' : result.error ?? 'Action failed.')
  }

  function onRate(event: FormEvent) {
    event.preventDefault()
    const result = rateOrder(orderId, { stars, review })
    setMessage(result.ok ? 'Thanks — review saved.' : result.error ?? 'Could not save review.')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/orders" className="text-sm font-medium text-indigo-600">
        ← All orders
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-slate-900">{outcome.title}</h1>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Buyer {buyer?.name} · Seller {seller?.name} · {formatMoney(order.basePrice)}
        {order.bonusPrice ? ` + ${formatMoney(order.bonusPrice)} bonus` : ''} · Created {formatDate(order.createdAt)} ·
        Deadline {formatDate(order.deadlineAt)}
      </p>

      {message ? (
        <div className="mt-4">
          <Alert tone={message.startsWith('Thanks') ? 'success' : 'info'}>{message}</Alert>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-1">
          <h2 className="font-semibold text-slate-900">Intake</h2>
          <dl className="mt-4 space-y-3">
            {Object.entries(order.intakeData).map(([key, value]) => {
              const label = outcome.inputs.find((f) => f.id === key)?.label ?? key
              return (
                <div key={key}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{value}</dd>
                </div>
              )
            })}
          </dl>
        </section>

        <section className="card p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-slate-900">Agent workflow</h2>
            {isSeller && order.status !== 'completed' && order.status !== 'disputed' ? (
              <Button onClick={onRun} disabled={running}>
                {running ? 'Running…' : 'Run agent workflow'}
              </Button>
            ) : null}
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">{progress}% · each step simulates 1–3 seconds of agent + QA work</p>
          <ol className="mt-4 space-y-3">
            {order.workflowLogs.map((log) => (
              <li key={log.id} className="rounded-xl border border-slate-100 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{log.step}</p>
                  <span className="text-xs capitalize text-slate-500">{log.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{log.message}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(log.timestamp)}</p>
              </li>
            ))}
            {order.workflowLogs.length === 0 ? (
              <li className="text-sm text-slate-500">
                {isSeller ? 'Click “Run agent workflow” to generate logs and a proof report.' : 'Waiting for the seller to run the agent workflow.'}
              </li>
            ) : null}
          </ol>
        </section>
      </div>

      {order.proofReport ? (
        <section className="card mt-6 p-6">
          <h2 className="font-semibold text-slate-900">Proof of work</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{order.proofReport.summary}</p>
          <h3 className="mt-5 text-sm font-semibold text-slate-900">What was done</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {order.proofReport.whatWasDone.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="mt-5 text-sm font-semibold text-slate-900">Before / after</h3>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            {order.proofReport.beforeAfter.map((row) => (
              <div key={row.label} className="rounded-xl bg-slate-50 p-3 text-sm">
                <p className="font-medium text-slate-900">{row.label}</p>
                <p className="mt-1 text-slate-500">Before: {row.before}</p>
                <p className="text-emerald-800">After: {row.after}</p>
              </div>
            ))}
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {order.proofReport.metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-slate-100 px-3 py-2">
                <dt className="text-xs text-slate-500">{metric.label}</dt>
                <dd className="text-sm font-medium text-slate-900">{metric.value}</dd>
              </div>
            ))}
          </dl>
          <pre className="mt-5 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-emerald-100">
            {order.proofReport.logs.join('\n')}
          </pre>
        </section>
      ) : null}

      {isSeller ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="emerald" onClick={() => act(markCompleted)} disabled={!order.proofReport || order.status === 'completed'}>
            Mark completed
          </Button>
          <Button variant="secondary" onClick={() => act(requestManualFix)} disabled={order.status === 'completed'}>
            Request manual fix
          </Button>
          <Button variant="danger" onClick={() => act(flagDispute)} disabled={order.status === 'disputed'}>
            Flag dispute
          </Button>
        </div>
      ) : null}

      {isBuyer && order.status === 'completed' ? (
        <form className="card mt-6 space-y-3 p-6" onSubmit={onRate}>
          <h2 className="font-semibold text-slate-900">Rating & review</h2>
          <Field label="Stars">
            <select className="input max-w-[120px]" value={stars} onChange={(e) => setStars(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Review">
            <TextArea value={review} onChange={(e) => setReview(e.target.value)} required />
          </Field>
          <Button type="submit">{order.rating ? 'Update review' : 'Submit review'}</Button>
        </form>
      ) : null}

      {order.rating && !(isBuyer && order.status === 'completed') ? (
        <section className="card mt-6 p-6">
          <h2 className="font-semibold text-slate-900">Buyer review</h2>
          <p className="mt-2 text-sm text-slate-800">{'★'.repeat(order.rating.stars)}{'☆'.repeat(5 - order.rating.stars)}</p>
          <p className="mt-2 text-sm text-slate-600">{order.rating.review}</p>
        </section>
      ) : null}
    </div>
  )
}
