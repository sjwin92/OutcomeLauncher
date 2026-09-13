import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { OutcomeCard } from '../components/OutcomeCard'
import { useStore } from '../data/store'
import { featuredOutcomes, formatMoney } from '../lib/utils'
import { Accordion, NumberPop, ShimmerText, TextsReveal } from '../motion/MotionBits'

const STEPS = [
  {
    n: '01',
    title: 'List or buy a fixed-scope outcome',
    body: 'SaaS founders publish a result with inputs, deliverables, success criteria, and an SLA — not a vague gig. Buyers pick the outcome and fill a structured intake.',
  },
  {
    n: '02',
    title: 'AI executes 60–80%; humans QA',
    body: 'Agents research, draft, and instrument. A human specialist checks brand, measurement, and the published success definition before anything is called done.',
  },
  {
    n: '03',
    title: 'Proof unlocks payment',
    body: 'Funds stay in escrow until success criteria are met and proof is accepted. Optional bonuses only land if the measured outcome does.',
  },
]

const FAQ = [
  {
    q: 'Is this Fiverr with extra steps?',
    a: 'No. Listings are standardized outcomes with SLAs and success criteria. Payment is held until proof is accepted — you are buying a result, not hours.',
  },
  {
    q: 'Who is this for?',
    a: 'Indie and SaaS founders who need Auth, billing, onboarding, churn, docs, or instrumentation shipped as a scoped outcome — plus SaaS specialists who sell those outcomes.',
  },
  {
    q: 'What is a retainer here?',
    a: 'A monthly scoped outcome (instrumentation health, docs freshness, integration triage) with a base fee and a published success metric — not an open Slack channel.',
  },
  {
    q: 'Is Stripe really connected?',
    a: 'Checkout and measurement are mocked for this Pages demo. The UI is structured so Supabase auth and Stripe Connect can replace the repository later.',
  },
]

export function Home() {
  const { outcomes, users, orders } = useStore()
  const featured = useMemo(() => featuredOutcomes(outcomes), [outcomes])
  const [index, setIndex] = useState(0)
  const gmv = orders.reduce((sum, o) => sum + o.basePrice + (o.bonusPrice ?? 0), 0)

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
              AI + human QA
            </span>
          </div>
          <TextsReveal
            className="mt-6 max-w-3xl"
            lines={[
              {
                text: 'Outcome-priced work for micro-SaaS',
                as: 'h1',
                className: 'text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl',
              },
              {
                text: 'AI executes 60–80% of the work. Humans QA. Proof unlocks payment held in escrow until success criteria are met.',
                as: 'p',
                className: 'mt-5 text-base leading-7 text-slate-300 sm:text-lg',
              },
            ]}
          />
          <p className="hero-shimmer mt-4 max-w-2xl text-sm text-indigo-200">
            <ShimmerText text="The outcome layer for indie founders and SaaS specialists — not a generic gig board." />
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/marketplace" className="btn-primary px-5 py-3">
              Browse SaaS outcomes
            </Link>
            <Link to="/signup?role=seller" className="btn bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15">
              Sell an outcome
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <HeroStat label="Platform GMV (this browser)" value={formatMoney(gmv)} />
            <HeroStat label="Live outcomes" value={String(outcomes.filter((o) => o.status === 'live').length)} />
            <HeroStat label="Orders tracked" value={String(orders.length)} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">How it works</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">From intake to released escrow</h2>
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
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Featured for SaaS builders</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Standardized offers, not open-ended gigs</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                The rail prefers live SaaS Builder outcomes. Creator/Brand remains available in the marketplace.
              </p>
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
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Primary wedge</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">SaaS Builder Outcomes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Auth/SSO, waitlist-to-paid, churn save, migrations, compliance lite, plus retainers for instrumentation, docs, and integration triage.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Also available</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Creator / Brand Outcomes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Abandoned-cart recovery, SEO rewrites, missed-call booking, and content sprints — still priced to a result.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
          <div className="mt-6">
            <Accordion items={FAQ} />
          </div>
        </div>
      </section>
    </div>
  )
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">
        <NumberPop value={value} />
      </p>
    </div>
  )
}
