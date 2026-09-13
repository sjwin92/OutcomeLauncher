import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { OutcomeCard } from '../components/OutcomeCard'
import { useStore } from '../data/store'

const STEPS = [
  {
    n: '01',
    title: 'List or buy a fixed-scope outcome',
    body: 'Sellers publish a result with inputs, deliverables, success criteria, and an SLA — not a vague gig. Buyers pick the outcome and fill a structured intake.',
  },
  {
    n: '02',
    title: 'AI agents execute; humans QA',
    body: 'Agents do 60–80% of the work: research, drafts, and instrumentation. A human specialist checks brand, measurement, and the published success definition.',
  },
  {
    n: '03',
    title: 'Proof of work + success-based pricing',
    body: 'A proof report is auto-generated (before/after, metrics, logs). You pay the base fee; optional bonuses only land if the outcome does.',
  },
]

export function Home() {
  const { outcomes, users } = useStore()
  const featured = useMemo(() => outcomes.filter((o) => o.status === 'live'), [outcomes])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (featured.length === 0) return
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % featured.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [featured.length])

  const visible = featured.length
    ? [0, 1, 2].map((offset) => featured[(index + offset) % featured.length]).filter(Boolean)
    : []

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.35),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.2),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="flex flex-wrap gap-2">
            <span className="badge bg-white/10 text-indigo-100 ring-1 ring-inset ring-white/15">Outcomes, not gigs</span>
            <span className="badge bg-white/10 text-emerald-100 ring-1 ring-inset ring-white/15">Success-based pricing</span>
            <span className="badge bg-white/10 text-slate-100 ring-1 ring-inset ring-white/15">
              AI agents do the work, humans ensure quality
            </span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Fiverr for outcome-priced AI work
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Sell and buy fixed-scope AI services with clear results, SLAs, and success-based pricing.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/marketplace" className="btn-primary px-5 py-3">
              Browse outcomes
            </Link>
            <Link to="/signup?role=seller" className="btn bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15">
              Start selling
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-400">
            Two verticals: Creator/Brand Outcomes and SaaS Builder Outcomes. Proof of work is auto-generated.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">How it works</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">From intake to proof in three steps</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="card p-6">
              <p className="text-sm font-bold text-indigo-600">{step.n}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Featured outcomes</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Standardized offers, not open-ended gigs</h2>
            </div>
            <div className="flex gap-2">
              <button
                className="btn-secondary"
                onClick={() => setIndex((i) => (i - 1 + featured.length) % featured.length)}
                aria-label="Previous featured outcomes"
              >
                Prev
              </button>
              <button
                className="btn-secondary"
                onClick={() => setIndex((i) => (i + 1) % featured.length)}
                aria-label="Next featured outcomes"
              >
                Next
              </button>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((outcome) => (
              <OutcomeCard
                key={`${outcome.id}-${index}`}
                outcome={outcome}
                seller={users.find((u) => u.id === outcome.sellerId)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="card grid gap-8 p-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Creator / Brand Outcomes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Abandoned-cart recovery, SEO rewrites, missed-call booking, and content sprints priced to a result.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">SaaS Builder Outcomes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Zero-touch onboarding, integration packs, analytics instrumentation, billing cleanup, and docs overhauls.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
