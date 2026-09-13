# OutcomeLauncher

**Outcome-priced work for micro-SaaS.**

Live site: **[https://sjwin92.github.io/OutcomeLauncher/](https://sjwin92.github.io/OutcomeLauncher/)**

OutcomeLauncher is the outcome layer for indie founders and SaaS specialists — not a generic Fiverr board. Sellers list fixed-scope **outcomes** (and monthly **retainers**) with success criteria, SLAs, and success-based pricing. AI agents execute 60–80% of the work; humans QA. Payment is **held in escrow** until proof is accepted.

## Positioning

- Primary audience: **indie / SaaS founders** and **SaaS specialists**
- Tagline: *Outcome-priced work for micro-SaaS*
- Pillars: Outcomes, not gigs · Success-based pricing · AI + human QA
- Marketplace **defaults to SaaS Builder**; Creator/Brand remains a filter
- Cloneable templates: original 9 + Auth/SSO Lite, Waitlist → Paid, Churn Save, Data Migration, Compliance Lite, plus retainers (instrumentation health, docs freshness, integration triage)

## Demo logins

Password for every seeded account: **`demo1234`**

| Email | Role | Notes |
| --- | --- | --- |
| `buyer@demo.com` | Buyer | Seeded orders (escrowed, in progress, completed + review, disputed) |
| `seller@demo.com` | Seller (verified) | Creator/Brand outcomes |
| `admin@outcomelauncher.com` | Seller + admin | `/admin` is gated by `admin@` in the email |

Sign in from `/signin`. After login you land on a role-aware `/dashboard`.

## Persistence

State no longer resets on reload.

- Versioned key: `outcomelauncher:v2`
- Persists **users, outcomes, orders, platformSettings, session**
- Seeds **only on first visit**; later visits hydrate from storage
- Admin → **Reset demo data** reseeds the catalog
- No external backend is required for GitHub Pages

The store talks to **repository functions** in `src/data/repository.ts` (load / save / reset). That is the swap point for a real API.

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`). Local Vite `base` stays `/`.

```bash
npm test                          # unit tests for templates, filters, economics, persistence
npm run build                     # production build at `/`
GITHUB_PAGES=true npm run build   # production build at `/OutcomeLauncher/` (GitHub Pages)
```

Pushes to `main` run `.github/workflows/deploy-pages.yml`: `npm ci`, `GITHUB_PAGES=true` build, copy `index.html` → `404.html` for SPA fallback, then deploy to GitHub Pages. In the repo, set **Settings → Pages → Source** to **GitHub Actions** if the site is not live yet.

## Motion

UI motion comes from **[transitions.dev](https://transitions.dev)** ([Jakubantalik/transitions.dev](https://github.com/Jakubantalik/transitions.dev)). Universal `:root` tokens live in `src/styles/transitions-root.css`. Production `t-*` snippets and reduced-motion guards are in `src/styles/transitions.css`. Used on the homepage (text reveal, shimmer, card tilt, FAQ accordion, number pop-in), marketplace (skeleton → reveal, sliding tabs, search clear, card tilt), nav (dropdown + mobile panel), auth (error shake), modals, agent workflow (thinking / reasoning / streaming / matrix → success check), and toasts.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS (slate / indigo / emerald)
- React Router (`GITHUB_PAGES` / `BASE_URL` basename)
- Repository + localStorage (no APIs required)

## Roadmap

1. **Supabase Auth** — replace the mock hash + `sessionUserId` in the repository
2. **Stripe Connect** — real escrow holds, payouts on proof accept, measured bonuses from Stripe / analytics webhooks
3. Keep the same domain types (`Outcome`, `Order`, `OutcomeKind`) so the UI does not have to be rewritten

## Notes

- Passwords use a **demo mock hash**, not a real KDF
- Stripe checkout and “connect Stripe/analytics” are mocked
- Subscription live-outcome limits are enforced when going live
- Escrow states: `escrowed` → `released` when the seller marks complete or the buyer accepts proof
