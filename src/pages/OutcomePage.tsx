import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CompletionRate, KindBadge, OutcomeNotGigBadge, StackBadges, VerifiedBadge } from '../components/StatusBadge'
import { Alert, Button, Field, TextArea, TextInput } from '../components/ui'
import { useStore } from '../data/store'
import type { IntakeField } from '../data/types'
import { formatMoney, formatSla, outcomePriceLabel, sellerStack } from '../lib/utils'
import { Accordion, ModalFrame, ToggleSwitch } from '../motion/MotionBits'
import { useToast } from '../motion/ToastProvider'

export function OutcomePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const { outcomes, users, currentUser, createOrder } = useStore()
  const outcome = outcomes.find((o) => o.id === id)
  const seller = outcome ? users.find((u) => u.id === outcome.sellerId) : undefined

  const [intake, setIntake] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [payOpen, setPayOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [measurement, setMeasurement] = useState(false)
  const [bonusEstimate, setBonusEstimate] = useState(150)

  const hero = useMemo(() => {
    if (!outcome) return ''
    const verb = outcome.kind === 'retainer' ? 'run' : 'deliver'
    return `We'll ${verb} ${outcome.title} in ${formatSla(outcome.slaHours)} for ${outcomePriceLabel(outcome)}.`
  }, [outcome])

  if (!outcome) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Alert tone="error">That outcome does not exist.</Alert>
        <Link to="/marketplace" className="btn-secondary mt-4 inline-flex">
          Back to marketplace
        </Link>
      </div>
    )
  }

  function validateIntake(): boolean {
    if (!outcome) return false
    const next: Record<string, string> = {}
    for (const field of outcome.inputs) {
      const value = (intake[field.id] ?? '').trim()
      if (field.required && !value) next[field.id] = 'Required'
      if (field.type === 'url' && value && !/^https?:\/\//i.test(value)) next[field.id] = 'Enter a URL starting with http'
      if (field.type === 'email' && value && !value.includes('@')) next[field.id] = 'Enter a valid email'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const outcomeId = outcome.id
  const sellerId = outcome.sellerId

  function startPay(event: FormEvent) {
    event.preventDefault()
    setFormError('')
    if (!currentUser) {
      navigate('/signin', { state: { from: `/outcome/${outcomeId}` } })
      return
    }
    if (currentUser.id === sellerId) {
      setFormError('You cannot purchase your own outcome.')
      return
    }
    if (!validateIntake()) return
    setPayOpen(true)
  }

  function completePay() {
    const result = createOrder(outcomeId, intake, {
      measurementConnected: measurement,
      bonusPrice: measurement ? bonusEstimate : undefined,
    })
    if (!result.ok || !result.order) {
      setFormError(result.error ?? 'Payment failed.')
      setPayOpen(false)
      return
    }
    pushToast('Payment escrowed until proof is accepted')
    navigate(`/confirmation/${result.order.id}`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap gap-2">
        <OutcomeNotGigBadge />
        <KindBadge kind={outcome.kind} />
        {seller?.verified ? <VerifiedBadge /> : null}
        <span className="badge bg-slate-100 text-slate-700">
          {outcome.vertical} · {outcome.category}
        </span>
      </div>
      <h1 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{hero}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{outcome.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <p className="text-sm text-slate-500">
          Sold by {seller?.name ?? 'Seller'}
          {seller?.company ? ` · ${seller.company}` : ''}
        </p>
        <CompletionRate rate={outcome.stats.completionRate} orders={outcome.stats.totalOrders} />
      </div>
      <div className="mt-4">
        <StackBadges stack={sellerStack(seller, outcome)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">What is included</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {outcome.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="mt-5 text-sm font-semibold text-slate-900">Not included</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {outcome.notIncluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Success definition & measurement</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{outcome.successCriteria}</p>
            {outcome.monthlyMetric ? (
              <p className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-800">
                Monthly metric: {outcome.monthlyMetric}
              </p>
            ) : null}
            {outcome.bonusDescription ? (
              <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                Performance bonus: {outcome.bonusDescription}
              </p>
            ) : null}
            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <ToggleSwitch
                checked={measurement}
                onChange={setMeasurement}
                label="Connect Stripe / analytics (mocked)"
              />
              <p className="mt-2 text-xs text-slate-500">
                Unlock measured-bonus UI. No real credentials leave this browser.
              </p>
              {measurement ? (
                <div className="mt-4 space-y-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                  <p className="font-semibold">Measured bonus unlocked</p>
                  <p>Mock feed: checkout events + activation funnel attached to this order.</p>
                  <Field label="Bonus estimate if criteria hit (USD)">
                    <TextInput
                      type="number"
                      min={0}
                      value={bonusEstimate}
                      onChange={(e) => setBonusEstimate(Number(e.target.value) || 0)}
                    />
                  </Field>
                </div>
              ) : null}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Intake</h2>
            <p className="mt-1 text-sm text-slate-600">Required inputs are defined by the outcome — not a blank brief.</p>
            <form className="mt-4 space-y-4" onSubmit={startPay}>
              {formError ? <Alert tone="error">{formError}</Alert> : null}
              {outcome.inputs.map((field) => (
                <IntakeControl
                  key={field.id}
                  field={field}
                  value={intake[field.id] ?? ''}
                  error={errors[field.id]}
                  onChange={(value) => setIntake((prev) => ({ ...prev, [field.id]: value }))}
                />
              ))}
              <Button type="submit" className="w-full sm:w-auto" disabled={outcome.status !== 'live'}>
                {outcome.status === 'live' ? `Continue · escrow ${formatMoney(outcome.basePrice)}` : 'Not live'}
              </Button>
            </form>
          </section>

          {outcome.faqs.length > 0 ? (
            <section className="card p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">FAQ</h2>
              <Accordion items={outcome.faqs} />
            </section>
          ) : null}
        </div>

        <aside className="card h-fit p-6">
          <p className="text-sm text-slate-500">{outcome.kind === 'retainer' ? 'Monthly base' : 'Base fee'}</p>
          <p className="text-3xl font-bold text-slate-900">{outcomePriceLabel(outcome)}</p>
          <p className="mt-1 text-sm text-slate-600">SLA {formatSla(outcome.slaHours)}</p>
          {outcome.bonusFormula ? <p className="mt-3 text-sm text-emerald-700">Bonus: {outcome.bonusFormula}</p> : null}
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>Payment held in escrow until success criteria are met and proof is accepted.</li>
            <li>Capacity: {outcome.capacity} concurrent orders</li>
            <li>Avg time to outcome: {outcome.stats.avgTimeToOutcomeHours || '—'}h</li>
            <li>Mock Stripe checkout — no real charge</li>
          </ul>
        </aside>
      </div>

      <PayModal
        open={payOpen}
        amount={outcome.basePrice}
        measurement={measurement}
        bonus={measurement ? bonusEstimate : 0}
        onClose={() => setPayOpen(false)}
        onConfirm={completePay}
      />
    </div>
  )
}

function IntakeControl({
  field,
  value,
  error,
  onChange,
}: {
  field: IntakeField
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  const common = {
    required: field.required,
    value,
    placeholder: field.placeholder,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  }
  return (
    <Field label={`${field.label}${field.required ? '' : ' (optional)'}`} error={error}>
      {field.type === 'textarea' ? (
        <TextArea className={error ? 't-input is-error is-shaking' : 't-input'} {...common} />
      ) : (
        <TextInput className={error ? 't-input is-error is-shaking' : 't-input'} type={field.type === 'number' ? 'number' : field.type} {...common} />
      )}
    </Field>
  )
}

function PayModal({
  open,
  amount,
  measurement,
  bonus,
  onClose,
  onConfirm,
}: {
  open: boolean
  amount: number
  measurement: boolean
  bonus: number
  onClose: () => void
  onConfirm: () => void
}) {
  const [name, setName] = useState('Jordan Hale')
  const [card, setCard] = useState('4242424242424242')
  const [exp, setExp] = useState('12/28')
  const [cvc, setCvc] = useState('123')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function pay(event: FormEvent) {
    event.preventDefault()
    const digits = card.replace(/\s/g, '')
    if (digits.length !== 16 || Number.isNaN(Number(digits))) {
      setError('Enter a 16-digit card number (try 4242 4242 4242 4242).')
      return
    }
    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      setError('Expiry must look like MM/YY.')
      return
    }
    if (cvc.length < 3) {
      setError('Enter a CVC.')
      return
    }
    setBusy(true)
    setError('')
    await new Promise((resolve) => setTimeout(resolve, 900))
    onConfirm()
  }

  return (
    <ModalFrame open={open} onClose={onClose}>
      <div className="card p-6">
        <p className="badge bg-indigo-50 text-indigo-700">Stripe test mode · escrow</p>
        <h2 className="mt-3 text-lg font-semibold text-slate-900">Escrow {formatMoney(amount)}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Funds are held until success criteria are met and proof is accepted. No real charge.
        </p>
        {measurement ? (
          <p className="mt-2 text-xs text-emerald-700">Measured bonus estimate reserved: {formatMoney(bonus)}</p>
        ) : null}
        <form className="mt-4 space-y-3" onSubmit={pay}>
          {error ? <Alert tone="error">{error}</Alert> : null}
          <Field label="Name on card">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Card number">
            <TextInput value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry">
              <TextInput value={exp} onChange={(e) => setExp(e.target.value)} placeholder="MM/YY" required />
            </Field>
            <Field label="CVC">
              <TextInput value={cvc} onChange={(e) => setCvc(e.target.value)} required />
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={busy}>
              {busy ? 'Escrowing…' : `Hold ${formatMoney(amount)}`}
            </Button>
          </div>
        </form>
      </div>
    </ModalFrame>
  )
}
