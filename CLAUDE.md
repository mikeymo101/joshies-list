# Joshie's List — Project Guide

## 🎯 What this is

**Joshie's List is a reverse Angie's List:** contractors rate their clients (not the other way around), and other contractors see those ratings before taking a job. The goal is to help pros avoid bad clients — late payers, scope-creepers, site-not-ready, etc.

Live at **joshieslist.com**. Deployed on Vercel.

---

## 💻 Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Framework** | Next.js 14.2.35 (App Router) | Route groups for layout scoping |
| **Language** | TypeScript 5 | Strict mode expected |
| **Styling** | Tailwind CSS 3.4 | |
| **Database + Auth** | Supabase (Postgres + Auth) | SSR via `@supabase/ssr` |
| **Payments** | Stripe | Checkout + webhooks |
| **Email** | Resend | Transactional only |
| **Icons** | lucide-react | |
| **Hosting** | Vercel | Project: `joshies-list` |

**Package manager:** npm (see `package-lock.json`)

---

## 🚀 Running Locally

**Prereqs:**
- Node 20+
- Supabase project (URL, anon key, service role key)
- Stripe account (test mode keys fine for local)
- Resend account (for transactional emails)

**Setup:**

```bash
cd ~/Projects/joshies-list
cp .env.local.example .env.local
# Fill in .env.local with real values (see Environment Variables below)
npm install
npm run dev
# Open http://localhost:3000
```

**Supabase setup:** Run `supabase/schema.sql` then `supabase/rls-policies.sql` in the Supabase SQL editor.

**Scripts:**

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at :3000 |
| `npm run build` | Production build |
| `npm start` | Run prod build locally |
| `npm run lint` | ESLint check |

---

## 🗺️ Architecture

### Route groups (Next.js App Router)

Next.js route groups use `(parentheses)` to organize routes under shared layouts **without adding to the URL**. This project has three:

| Group | Purpose | Pages |
|---|---|---|
| **`(app)`** | Authenticated app | dashboard, clients, search, review, compare, watchlist, areas, account |
| **`(auth)`** | Public auth flows | login, signup, reset-password |
| **`(onboarding)`** | 5-step contractor onboarding | account → business → verification → license → seed jobs |

### Other top-level routes

- **`admin/`** — Admin panel (contractor management, review moderation, verification review, feature requests). Gated by `ADMIN_PASSWORD`.
- **`legal/`** — Terms, privacy, guidelines, dispute process. Public.
- **`score/[id]/`** — **Public** score pages. Used for sharing.

### API structure

Two API surfaces, each with different auth:

| Path | Who can call | Purpose |
|---|---|---|
| **`/api/*`** | Authenticated users via middleware | App uses these |
| **`/api/v1/*`** | **Public** (no auth) | External API for integrations — read-only client data, areas, reviews |

### Auth middleware

**`middleware.ts`** handles auth for every request:

1. If Supabase env vars missing → pass through (local dev fallback)
2. Check Supabase session
3. **Public pages** (no auth needed): `/`, `/login`, `/signup`, `/reset-password`, `/score/*`, `/legal/*`, `/api/v1/*`
4. API routes always pass through (they handle their own auth)
5. Everything else → redirect to `/login` if not authenticated

### Data model (key tables)

- **`contractors`** — pros who sign up. Has `verification_status` and `access_tier`.
- **`clients`** — the people being rated (first name + last initial only, PII-minimal).
- **`reviews`** — 5-category ratings tied to contractor+client+job. **Constraint: one review per contractor/client/job_date_approx** (stops rating someone twice for the same job).
- **`verification_submissions`** — license + docs uploaded for verification.
- **`invite_codes`** — early-access gating.

### Scoring engine (`lib/score-engine.ts`)

Reviews score clients on 5 dimensions (1-5 each). Weights:

| Category | Weight | What it measures |
|---|---|---|
| **Payment** | **30%** | Pays on time |
| **Post-job** | **20%** | No surprises after |
| **Scope** | **20%** | Sticks to the plan |
| **Professionalism** | **15%** | Easy to work with |
| **Access** | **15%** | Site ready & on time |

**Grade scale (A–F):** A ≥ 4.5 · B ≥ 3.5 · C ≥ 2.5 · D ≥ 1.5 · F < 1.5

Client score = average of all their reviews' weighted scores.

---

## 🔐 Environment Variables

All required vars are in `.env.local.example`. Key ones:

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-safe)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only — admin actions)

**Stripe:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Resend:**
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (default: `noreply@joshieslist.com`)

**Admin:**
- `ADMIN_PASSWORD` (protects `/admin/*`)

**App:**
- `NEXT_PUBLIC_APP_URL` (for redirects, emails, webhooks)

---

## 📐 Conventions

**File naming:**
- Pages: `page.tsx` (Next.js App Router convention)
- Layouts: `layout.tsx`
- API routes: `route.ts`
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`

**UI components:** shared primitives live in `components/ui/` (Badge, Button, Input, ScoreBar, Toast). Higher-level domain components (ClientCard, ReviewForm, ScoreBreakdown, etc.) live in `components/` directly.

**Supabase clients:**
- `lib/supabase/client.ts` — browser (anon key)
- `lib/supabase/server.ts` — RSC / server actions (cookies)
- `lib/supabase/admin.ts` — service role (server only, never expose)

**Types:** `types/index.ts` for shared types.

---

## ⚠️ Known context

- **Reviews are append-only.** Once submitted, contractors can dispute but not edit.
- **Clients are NOT users.** They don't log in. They're just entities being rated.
- **One review per contractor-client-year** (schema constraint on `job_date_approx`).
- **Middleware has a dev fallback:** if Supabase env isn't set, auth is bypassed. Useful locally, dangerous in prod — don't deploy without env configured.
- **`/api/v1/` is public** — be mindful what you expose there. Currently read-only client data.

---

## 📚 Original reference docs

Preserved from the initial planning phase — read if you need context for why something exists:

- `docs/Joshies-List-Product-Spec.docx` — full product spec
- `docs/first-claude-code-prompt.txt` — the prompt that kicked off the build
- `docs/schema-ORIGINAL.sql` — original schema draft (the real schema is now `supabase/schema.sql`)
- `docs/score-engine-ORIGINAL.ts` — original scoring logic (the live version is `lib/score-engine.ts`)
- `docs/Joshies_Logo.svg` — brand asset

---

## 🚧 Open questions for future sessions

- No tests yet. Critical paths worth covering: score calculation, review submission flow, auth middleware edges.
- `.env.vercel-check` — unclear purpose; inspect and decide if it should be in `.gitignore`.
- `/api/v1/` is documented-by-existence only. Worth a proper README if external integrations are planned.
- No CI/CD defined in repo (Vercel handles deploy on push, but no lint/type-check gate).

---

## 🎯 Next session — start here

### 🔴 First: scrub expired Vercel token from git history

An expired Vercel OIDC token is sitting in commit `b606feb` (the big "3 weeks of dev work" commit). Token expired March 29, 2026 — already useless — but it's hygiene-level bad to leave credentials in public git history.

**Scrub it with `git filter-repo`:**

1. Install: `brew install git-filter-repo`
2. From this project: `git filter-repo --path .env.vercel-check --invert-paths`
3. Re-add remote (filter-repo removes it): `git remote add origin https://github.com/mikeymo101/joshies-list.git`
4. Force-push: `git push origin main --force`

**Caveats:**
- Rewrites history — if you have collaborators, coordinate first (you don't currently)
- Old commit hashes change — any external references to specific commits break
- Can't undo easily — consider a `git clone` backup first: `cp -r ~/Projects/joshies-list ~/Desktop/joshies-list-BACKUP-before-scrub`

### 🟡 Then: production readiness work (in priority order)

1. **Add tests for critical paths** (biggest risk)
   - `lib/score-engine.ts` — weighted score calc
   - Review submission flow (API + client)
   - Auth middleware edges (public pages, API bypass)
   - Suggested stack: Vitest + @testing-library/react + Supabase local for integration

2. **Set up CI/CD gates** (prevent regressions)
   - GitHub Action on PR: `npm run lint` + `tsc --noEmit` + `npm test`
   - Vercel already handles deploy on push to main
   - Gate merges on the Action passing

3. **Future enhancements**
   - No README specific to this project yet (the generic Next.js one is still at root)
   - `/api/v1/` is public but undocumented — worth a proper API doc if external integrations are planned
