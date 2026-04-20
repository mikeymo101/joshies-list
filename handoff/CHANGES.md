# Joshie's List — P0 Design Changes

Scope: four P0 items from the audit. Small, reviewable diff. Safe to ship as one PR or four commits.

**Repo:** `mikeymo101/joshies-list` · **Branch:** suggest `redesign/p0-landing`
**Base ref:** `main`

---

## Commits (recommended order)

### 1. `fix(brand): stop using logo SVG as H1 on landing`
**File:** `app/page.tsx`

The landing page currently renders the logo SVG twice — once in the nav (correct) and once **inside the `<h1>` of the hero** with `alt="Joshies List"`. That leaves the page with no real headline for SEO or screen readers, and it duplicates the mark.

- Remove the `<img>` from the hero `<h1>`.
- Promote the existing sub-headline ("Know Which Jobs To Walk Away From.") to be the actual h1.
- Delete the redundant `<h2>` below it.
- Move the "Built by contractors, for contractors" chip above the h1 as an eyebrow.

### 2. `feat(landing): search-first hero`
**File:** `app/page.tsx`

The core user job is "check a client before I bid." The current hero buries that action behind a "Search Clients" tertiary button. Promote search into the hero itself.

- Add a `<HeroSearch />` block directly under the h1: name + ZIP inputs + primary "Check client" button that submits to `/search?q=...&zip=...`.
- Keep "Get Started Free" as the secondary CTA; drop the generic "Search Clients" link (the form replaces it).
- Trust strip stays, but tightened.

### 3. `refactor(design-tokens): consolidate amber/orange palettes`
**Files:** `tailwind.config.ts`, `app/globals.css`

Three overlapping warm palettes are live right now: Tailwind's `brand.*` (amber `#f59e0b`), hard-coded `amber-500`/`amber-400` classes across the app, and CSS custom props using `--orange-500: #f97316`. They render as three visibly different oranges depending on component.

- Canonicalize on **one** warm ramp. Use `brand.*` in Tailwind config (amber `#f59e0b` family — it's already the most-used).
- Rewrite `app/globals.css` custom props to reference the same hex values (`--brand-500: #f59e0b`), and delete the `--orange-*` vars.
- Update the `glass-*` borders and scrollbar to use `--brand-*` so we don't have a second orange.
- (Follow-up, not in this PR) replace inline `amber-500` / `orange-500` class usage across components with `brand-500`. Grep: `rg "(amber|orange)-(400|500|600)" app components`.

### 4. `feat(ui): redesigned ScoreCard for landing sample`
**Files:** `components/ui/ScoreCard.tsx` (new), `app/page.tsx`

The current sample card has three competing focal points (big "3.8" number, big "B" grade badge, big "83%" block). Rebuild around a single hero: the grade letter. Supporting data ranks below it in a clean rubric grid.

- Add `components/ui/ScoreCard.tsx` (see file below). Self-contained; uses only Tailwind + brand tokens. Accepts the same shape the existing data model produces.
- In `app/page.tsx`, replace the 80-line inline sample card (the entire "Mock score card" section body) with `<ScoreCard sample={SAMPLE_CLIENT} />`.
- No DB/API changes. Wire the real detail page (`app/clients/[id]/page.tsx`) to use this component in a follow-up.

---

## Apply with Claude Code

```
# in your local clone
git checkout -b redesign/p0-landing

# drop the files from this bundle into the repo at matching paths:
#   app/page.tsx                    (replace)
#   app/globals.css                 (replace)
#   tailwind.config.ts              (replace)
#   components/ui/ScoreCard.tsx     (new)

pnpm dev   # or npm/yarn
# verify: /  (landing) + /clients/[id] still render
```

Then commit each change in the order above so the diff tells the story.

---

## What's intentionally NOT in this PR

- No changes to `app/clients/[id]/page.tsx` or `components/ClientCard.tsx` — those get the new ScoreCard in P1.
- No typography migration (Instrument Serif / Inter swap) — P1.
- No copy overhaul on "Stop Losing Money" / "$250K lost" — P1 voice pass.
- No search-results page redesign — P1.

Ship P0 first, then we'll open the P1 PR.
