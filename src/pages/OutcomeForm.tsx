import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert, Button, Field, Select, TextArea, TextInput } from '../components/ui'
import { useStore } from '../data/store'
import { CATEGORIES, VERTICALS, type IntakeField, type IntakeFieldType, type OutcomeDraft, type OutcomeKind, type OutcomeStatus, type Vertical } from '../data/types'
import { useToast } from '../motion/ToastProvider'
import { uid } from '../lib/utils'

interface FormState {
  title: string
  description: string
  vertical: Vertical
  category: string
  kind: OutcomeKind
  monthlyMetric: string
  inputs: IntakeField[]
  deliverables: string
  notIncluded: string
  successCriteria: string
  slaHours: string
  basePrice: string
  priceNote: string
  bonusDescription: string
  bonusFormula: string
  capacity: string
  faqs: string
}

const emptyForm = (): FormState => ({
  title: '',
  description: '',
  vertical: 'SaaS Builder',
  category: 'SaaS Onboarding',
  kind: 'one_off',
  monthlyMetric: '',
  inputs: [{ id: uid('fld'), label: '', type: 'text', required: true, placeholder: '' }],
  deliverables: '',
  notIncluded: '',
  successCriteria: '',
  slaHours: '120',
  basePrice: '',
  priceNote: '',
  bonusDescription: '',
  bonusFormula: '',
  capacity: '3',
  faqs: '',
})

function lines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function OutcomeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, outcomes, createOutcome, updateOutcome } = useStore()
  const { pushToast } = useToast()
  const existing = id ? outcomes.find((o) => o.id === id && o.sellerId === currentUser?.id) : undefined

  const [form, setForm] = useState<FormState>(() => {
    if (!existing) return emptyForm()
    return {
      title: existing.title,
      description: existing.description,
      vertical: existing.vertical,
      category: existing.category,
      kind: existing.kind ?? 'one_off',
      monthlyMetric: existing.monthlyMetric ?? '',
      inputs: existing.inputs.map((f) => ({ ...f })),
      deliverables: existing.deliverables.join('\n'),
      notIncluded: existing.notIncluded.join('\n'),
      successCriteria: existing.successCriteria,
      slaHours: String(existing.slaHours),
      basePrice: String(existing.basePrice),
      priceNote: existing.priceNote ?? '',
      bonusDescription: existing.bonusDescription ?? '',
      bonusFormula: existing.bonusFormula ?? '',
      capacity: String(existing.capacity),
      faqs: existing.faqs.map((f) => `${f.q} | ${f.a}`).join('\n'),
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [banner, setBanner] = useState('')

  const categories = CATEGORIES[form.vertical]

  const draft = useMemo((): OutcomeDraft | null => {
    const slaHours = Number(form.slaHours)
    const basePrice = Number(form.basePrice)
    const capacity = Number(form.capacity)
    if (!form.title || !form.description || Number.isNaN(slaHours) || Number.isNaN(basePrice)) return null
    return {
      title: form.title.trim(),
      description: form.description.trim(),
      vertical: form.vertical,
      category: form.category,
      kind: form.kind,
      monthlyMetric: form.kind === 'retainer' ? form.monthlyMetric.trim() || undefined : undefined,
      inputs: form.inputs.filter((f) => f.label.trim()),
      deliverables: lines(form.deliverables),
      notIncluded: lines(form.notIncluded),
      successCriteria: form.successCriteria.trim(),
      slaHours,
      basePrice,
      priceNote: form.priceNote.trim() || undefined,
      bonusDescription: form.bonusDescription.trim() || undefined,
      bonusFormula: form.bonusFormula.trim() || undefined,
      capacity,
      faqs: lines(form.faqs).map((row) => {
        const [q, ...rest] = row.split('|')
        return { q: q.trim(), a: rest.join('|').trim() || 'See the outcome brief.' }
      }),
      templateId: existing?.templateId,
    }
  }, [form, existing?.templateId])

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (form.title.trim().length < 8) next.title = 'Title must be at least 8 characters.'
    if (form.description.trim().length < 20) next.description = 'Add a clearer description (20+ characters).'
    if (!form.category) next.category = 'Pick a category.'
    if (!form.inputs.some((f) => f.label.trim())) next.inputs = 'Add at least one intake field.'
    if (lines(form.deliverables).length === 0) next.deliverables = 'List at least one deliverable.'
    if (form.successCriteria.trim().length < 10) next.successCriteria = 'Define success in measurable terms.'
    const slaHours = Number(form.slaHours)
    const basePrice = Number(form.basePrice)
    const capacity = Number(form.capacity)
    if (!Number.isFinite(slaHours) || slaHours <= 0) next.slaHours = 'SLA hours must be a positive number.'
    if (!Number.isFinite(basePrice) || basePrice <= 0) next.basePrice = 'Base price must be a positive number.'
    if (!Number.isInteger(capacity) || capacity < 1) next.capacity = 'Capacity must be an integer of 1 or more.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function save(status: OutcomeStatus) {
    if (!validate() || !draft) return
    const result = existing
      ? updateOutcome(existing.id, draft, status)
      : createOutcome(draft, status)
    if (!result.ok) {
      setBanner(result.error ?? 'Could not save.')
      return
    }
    pushToast(status === 'live' ? 'Outcome live' : 'Outcome saved')
    navigate('/dashboard')
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    save(existing?.status === 'live' ? 'live' : 'draft')
  }

  if (id && !existing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Alert tone="error">Outcome not found.</Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
        {existing ? 'Edit outcome' : 'Create outcome'}
      </p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">
        {existing ? existing.title : 'New fixed-scope outcome'}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Price a result, not hours. Required fields are validated before publish.
      </p>

      <form className="card mt-6 space-y-5 p-6" onSubmit={onSubmit}>
        {banner ? <Alert tone="error">{banner}</Alert> : null}
        <Field label="Title" error={errors.title}>
          <TextInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </Field>
        <Field label="Description" error={errors.description}>
          <TextArea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kind">
            <Select
              value={form.kind}
              onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as OutcomeKind }))}
            >
              <option value="one_off">One-off outcome</option>
              <option value="retainer">Monthly retainer</option>
            </Select>
          </Field>
          <Field label="Vertical">
            <Select
              value={form.vertical}
              onChange={(e) => {
                const vertical = e.target.value as Vertical
                setForm((f) => ({ ...f, vertical, category: CATEGORIES[vertical][0] }))
              }}
            >
              {VERTICALS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Category" error={errors.category}>
            <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div>
          <p className="label">Intake fields</p>
          {errors.inputs ? <p className="mb-2 text-xs text-rose-600">{errors.inputs}</p> : null}
          <div className="space-y-3">
            {form.inputs.map((field, index) => (
              <div key={field.id} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-12">
                <TextInput
                  className="sm:col-span-5"
                  placeholder="Label"
                  value={field.label}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      inputs: f.inputs.map((item, i) => (i === index ? { ...item, label: e.target.value } : item)),
                    }))
                  }
                />
                <Select
                  className="sm:col-span-3"
                  value={field.type}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      inputs: f.inputs.map((item, i) =>
                        i === index ? { ...item, type: e.target.value as IntakeFieldType } : item,
                      ),
                    }))
                  }
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="url">URL</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                </Select>
                <label className="flex items-center gap-2 text-xs text-slate-600 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        inputs: f.inputs.map((item, i) => (i === index ? { ...item, required: e.target.checked } : item)),
                      }))
                    }
                  />
                  Required
                </label>
                <button
                  type="button"
                  className="btn-ghost sm:col-span-2"
                  onClick={() => setForm((f) => ({ ...f, inputs: f.inputs.filter((_, i) => i !== index) }))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            onClick={() =>
              setForm((f) => ({
                ...f,
                inputs: [...f.inputs, { id: uid('fld'), label: '', type: 'text', required: true }],
              }))
            }
          >
            Add input
          </Button>
        </div>

        <Field label="Deliverables (one per line)" error={errors.deliverables}>
          <TextArea value={form.deliverables} onChange={(e) => setForm((f) => ({ ...f, deliverables: e.target.value }))} />
        </Field>
        <Field label="Not included (one per line)">
          <TextArea value={form.notIncluded} onChange={(e) => setForm((f) => ({ ...f, notIncluded: e.target.value }))} />
        </Field>
        <Field label="Success criteria" error={errors.successCriteria}>
          <TextArea value={form.successCriteria} onChange={(e) => setForm((f) => ({ ...f, successCriteria: e.target.value }))} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="SLA hours" error={errors.slaHours} hint="Use 24 for one day.">
            <TextInput
              type="number"
              min={1}
              value={form.slaHours}
              onChange={(e) => setForm((f) => ({ ...f, slaHours: e.target.value }))}
            />
          </Field>
          <Field label="Base price (USD)" error={errors.basePrice}>
            <TextInput
              type="number"
              min={1}
              step="1"
              value={form.basePrice}
              onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))}
            />
          </Field>
          <Field label="Capacity" error={errors.capacity}>
            <TextInput
              type="number"
              min={1}
              step="1"
              value={form.capacity}
              onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
            />
          </Field>
        </div>
        <Field label="Price note" hint='Optional range label such as "$2,500–$7,000".'>
          <TextInput value={form.priceNote} onChange={(e) => setForm((f) => ({ ...f, priceNote: e.target.value }))} />
        </Field>
        <Field label="Bonus description">
          <TextArea value={form.bonusDescription} onChange={(e) => setForm((f) => ({ ...f, bonusDescription: e.target.value }))} />
        </Field>
        <Field label="Bonus formula">
          <TextInput
            value={form.bonusFormula}
            onChange={(e) => setForm((f) => ({ ...f, bonusFormula: e.target.value }))}
            placeholder="$25 / 100 recovered carts"
          />
        </Field>
        {form.kind === 'retainer' ? (
          <Field label="Monthly success metric" hint="What “done this month” means for the retainer.">
            <TextArea
              value={form.monthlyMetric}
              onChange={(e) => setForm((f) => ({ ...f, monthlyMetric: e.target.value }))}
              placeholder="Core activation funnel stays complete for the month."
            />
          </Field>
        ) : null}
        <Field label="FAQs" hint="One per line: Question | Answer">
          <TextArea value={form.faqs} onChange={(e) => setForm((f) => ({ ...f, faqs: e.target.value }))} />
        </Field>

        <div className="flex flex-wrap gap-2">
          <Button type="submit">Save</Button>
          <Button type="button" variant="emerald" onClick={() => save('live')}>
            Save & go live
          </Button>
          <Button type="button" variant="secondary" onClick={() => save('draft')}>
            Save as draft
          </Button>
          <Link to="/dashboard" className="btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
