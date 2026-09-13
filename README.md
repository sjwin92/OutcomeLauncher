# OutcomeLauncher

**Fiverr for outcome-priced AI work.**

A production-style demo SPA: sellers list fixed-scope **outcomes** (not vague gigs) with success criteria, SLAs, and outcome-based pricing (base fee + optional performance bonus). AI agents do 60–80% of the work; humans QA. Proof of work is auto-generated.

Two verticals:

1. **Creator / Brand Outcomes** — cart recovery, SEO rewrites, missed-call booking, content sprints
2. **SaaS Builder Outcomes** — onboarding, integrations, analytics, billing, docs

All backend state is **mocked in memory**. Reload the page to reset.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

```bash
npm test          # unit tests for templates, filters, economics
npm run build     # production build
```

## Demo accounts

Password for all seeded users: **`demo1234`**

| Email | Role | Notes |
| --- | --- | --- |
| `buyer@demo.com` | Buyer | Seeded orders (paid, in progress, completed + review, disputed) |
| `seller@demo.com` | Seller (verified) | Live Creator/Brand outcomes cloned from templates |
| `admin@outcomelauncher.com` | Seller + admin | `/admin` is gated by `admin@` in the email |

Sign in from `/signin`. After login you land on a role-aware `/dashboard`.

## What to click through

1. **Homepage** — hero, three-step “how it works”, featured outcomes carousel
2. **Marketplace** — filters (vertical, category, price, max turnaround) and search
3. **Outcome sales page** — “We'll [outcome] in [SLA] for [price]”, intake, mock Stripe (`4242…`)
4. **Buyer** — confirmation tracker → `/orders/:id` → rating after completed
5. **Seller** — create / edit / duplicate / pause outcomes; **clone the 9 preloaded templates**
6. **Seller order** — **Run agent workflow** (1–3s steps + progress + proof) → Mark completed / Manual fix / Dispute
7. **Admin** — subscription tiers (Starter $49, Pro $99, Agency $199), 7% take rate, seller GMV / completions / dispute rate, verify toggle

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS (slate / indigo / emerald)
- React Router
- In-memory store (`src/data/store.tsx`) — no APIs, no persistence

Key modules:

- `src/data/types.ts` — domain model
- `src/data/templates.ts` — nine standardized outcome offers
- `src/data/seed.ts` — demo users, cloned live listings, sample orders
- `src/data/workflow.ts` — mocked agent steps + proof report
- `src/lib/utils.ts` — hash, filters, SLA/money helpers

## Notes

- Passwords use a **demo mock hash**, not a real KDF.
- Stripe checkout is fake. Any 16-digit card works.
- Subscription live-outcome limits are enforced when going live.
- Data is session-only and resets on reload.
