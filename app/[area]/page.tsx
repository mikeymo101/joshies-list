import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Top-level URL segments that must never resolve to a city page.
// Next.js gives static routes precedence over dynamic ones, but listing
// them explicitly protects against accidental future collisions and gives
// a clean 404 instead of a confusing empty city page.
const RESERVED_SLUGS = new Set([
  'admin', 'api', 'legal', 'score', 'fonts', 'favicon', 'logo',
  'dashboard', 'search', 'review', 'reviews', 'areas', 'clients',
  'account', 'onboarding', 'auth', 'login', 'signup', 'reset-password',
  'compare', 'watchlist', 'verify', 'verification',
  'pricing', 'about', 'contact', 'help', 'faq', 'blog', 'docs', 'app',
  'terms', 'privacy',
]);

function unslugify(slug: string): string {
  return slug.replace(/-/g, ' ').trim();
}

function getGrade(score: number): string {
  if (score >= 4.5) return 'A';
  if (score >= 3.5) return 'B';
  if (score >= 2.5) return 'C';
  if (score >= 1.5) return 'D';
  return 'F';
}

function getGradeClass(grade: string | null) {
  switch (grade) {
    case 'A': return 'score-grade-a';
    case 'B': return 'score-grade-b';
    case 'C': return 'score-grade-c';
    case 'D': return 'score-grade-d';
    case 'F': return 'score-grade-f';
    default: return 'score-grade bg-white/10 text-white/40 border border-white/10';
  }
}

function getBarColor(score: number) {
  if (score >= 4.5) return 'bg-grade-a';
  if (score >= 3.5) return 'bg-grade-b';
  if (score >= 2.5) return 'bg-grade-c';
  if (score >= 1.5) return 'bg-grade-d';
  return 'bg-grade-f';
}

interface ResolvedArea {
  city: string;
  state: string;
  clientCount: number;
  ratedCount: number;
  reviewCount: number;
  avgScore: number | null;
  grade: string | null;
  wouldWorkAgainPct: number | null;
}

// Resolve a URL slug like "bozeman" or "colorado-springs" to a city + state.
// We pick the state with the most review activity if a city name appears in
// multiple states (Springfield, etc.). Returns null for unknown cities.
async function resolveCity(slug: string): Promise<ResolvedArea | null> {
  if (RESERVED_SLUGS.has(slug)) return null;
  const cityName = unslugify(slug);
  if (!cityName) return null;

  const admin = createAdminClient();
  const { data: clients } = await admin
    .from('clients')
    .select('city, state, score, review_count, would_work_again_pct')
    .ilike('city', cityName);

  if (!clients || clients.length === 0) return null;

  const byState = new Map<string, typeof clients>();
  for (const c of clients) {
    const arr = byState.get(c.state) ?? [];
    arr.push(c);
    byState.set(c.state, arr);
  }

  let bestState: string | null = null;
  let bestReviews = -1;
  for (const [state, group] of byState) {
    const reviews = group.reduce((s, c) => s + c.review_count, 0);
    if (reviews > bestReviews) {
      bestReviews = reviews;
      bestState = state;
    }
  }

  if (!bestState) return null;
  const matched = byState.get(bestState)!;

  const rated = matched.filter(c => c.score !== null && c.review_count > 0);
  const totalReviews = matched.reduce((s, c) => s + c.review_count, 0);
  const totalScore = rated.reduce((s, c) => s + (c.score ?? 0), 0);
  const avgScore = rated.length > 0 ? totalScore / rated.length : null;
  const wwaSamples = rated.filter(c => c.would_work_again_pct !== null);
  const wwaAvg = wwaSamples.length > 0
    ? Math.round(wwaSamples.reduce((s, c) => s + (c.would_work_again_pct ?? 0), 0) / wwaSamples.length)
    : null;

  return {
    city: matched[0].city,
    state: bestState,
    clientCount: matched.length,
    ratedCount: rated.length,
    reviewCount: totalReviews,
    avgScore: avgScore !== null ? Math.round(avgScore * 10) / 10 : null,
    grade: avgScore !== null ? getGrade(avgScore) : null,
    wouldWorkAgainPct: wwaAvg,
  };
}

export async function generateMetadata({ params }: { params: { area: string } }): Promise<Metadata> {
  const area = await resolveCity(params.area);
  if (!area) {
    return { title: 'Area Not Found — Joshies List', robots: { index: false, follow: false } };
  }

  const cityState = `${area.city}, ${area.state}`;
  const reviewWord = area.reviewCount === 1 ? 'review' : 'reviews';
  const title = `Joshies List ${area.city} — Client ratings from ${area.reviewCount} contractor ${reviewWord}`;
  const description = area.reviewCount > 0
    ? `Contractors in ${cityState} have rated ${area.ratedCount} ${area.ratedCount === 1 ? 'client' : 'clients'} across ${area.reviewCount} ${reviewWord}. Check who pays on time, sticks to scope, and is easy to work with — before you bid.`
    : `Be the first contractor to rate clients in ${cityState}. Anonymous reviews from contractors who've done the job.`;

  // Don't let Google index ghost-town pages until they have meaningful content.
  const thinContent = area.reviewCount < 3;

  return {
    title,
    description,
    robots: thinContent ? { index: false, follow: true } : undefined,
    openGraph: { title, description, siteName: 'Joshies List', type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

interface ReviewRow {
  id: string;
  weighted_score: number;
  job_type: string;
  job_value_range: string;
  job_date_approx: string;
  created_at: string;
  would_work_again: boolean | null;
  clients: {
    id: string;
    first_name: string;
    last_initial: string;
  } | null;
}

interface ClientRow {
  id: string;
  first_name: string;
  last_initial: string;
  score: number | null;
  grade: string | null;
  review_count: number;
  zip_code: string;
}

export default async function CityPage({ params }: { params: { area: string } }) {
  const area = await resolveCity(params.area);
  if (!area) notFound();

  const admin = createAdminClient();

  const [ratedRes, reviewsRes, contractorRes] = await Promise.all([
    admin
      .from('clients')
      .select('id, first_name, last_initial, score, grade, review_count, zip_code')
      .ilike('city', area.city)
      .eq('state', area.state)
      .gt('review_count', 0)
      .order('score', { ascending: false }),
    admin
      .from('reviews')
      .select('id, weighted_score, job_type, job_value_range, job_date_approx, created_at, would_work_again, clients!inner(id, first_name, last_initial, city, state)')
      .eq('status', 'active')
      .ilike('clients.city', area.city)
      .eq('clients.state', area.state)
      .order('created_at', { ascending: false })
      .limit(10),
    admin
      .from('reviews')
      .select('contractor_id, clients!inner(city, state)')
      .eq('status', 'active')
      .ilike('clients.city', area.city)
      .eq('clients.state', area.state),
  ]);

  const allRated: ClientRow[] = (ratedRes.data ?? []) as ClientRow[];
  const recentReviews: ReviewRow[] = ((reviewsRes.data ?? []) as unknown as ReviewRow[]).map(r => ({
    ...r,
    // Supabase returns the joined `clients` as either an object or array depending
    // on the inferred cardinality — normalize to object form.
    clients: Array.isArray(r.clients) ? r.clients[0] ?? null : r.clients,
  }));
  const contractorCount = new Set(
    (contractorRes.data ?? []).map((r: { contractor_id: string }) => r.contractor_id)
  ).size;

  // If there are <=5 rated clients, just show them all sorted high→low.
  // Otherwise split into "Best" and "Worst" lists.
  const showSplit = allRated.length > 5;
  const topClients = showSplit ? allRated.slice(0, 5) : allRated;
  const bottomClients = showSplit ? [...allRated].reverse().slice(0, 5) : [];

  const cityState = `${area.city}, ${area.state}`;
  const hasData = area.reviewCount > 0;

  return (
    <div className="min-h-screen bg-surface-canvas">
      {/* Nav — matches landing page */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-surface-canvas/80 backdrop-blur-xl border-b border-brand-500/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Joshie's List home" className="inline-flex items-center">
            <img src="/logo.svg" alt="Joshie's List" className="h-7" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/search" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
              Search
            </Link>
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="px-5 py-2.5 text-sm font-semibold bg-brand-500 text-black rounded-lg hover:bg-brand-400 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="text-xs font-medium text-white/65 tracking-wide">{cityState}</span>
          </div>

          <h1 className="mt-5 text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.05] text-balance">
            Joshie&apos;s List <span className="text-brand-500">{area.city}</span>
          </h1>

          <p className="mt-5 text-lg text-white/55 max-w-xl mx-auto leading-relaxed text-pretty">
            {hasData
              ? <>Contractors in {cityState} share which clients pay on time, stick to scope, and are easy to work with.</>
              : <>Be the first contractor to rate a client in {cityState} — and help every pro who comes after you.</>}
          </p>

          {/* Stats strip */}
          {hasData && (
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="rounded-xl border border-brand-500/15 bg-brand-500/5 px-4 py-3">
                <div className="text-2xl font-bold text-white tabular-nums">{area.ratedCount}</div>
                <div className="text-[11px] uppercase tracking-wide text-white/45 mt-0.5">{area.ratedCount === 1 ? 'client rated' : 'clients rated'}</div>
              </div>
              <div className="rounded-xl border border-brand-500/15 bg-brand-500/5 px-4 py-3">
                <div className="text-2xl font-bold text-white tabular-nums">{area.reviewCount}</div>
                <div className="text-[11px] uppercase tracking-wide text-white/45 mt-0.5">{area.reviewCount === 1 ? 'review' : 'reviews'}</div>
              </div>
              <div className="rounded-xl border border-brand-500/15 bg-brand-500/5 px-4 py-3">
                <div className="text-2xl font-bold text-white tabular-nums">{contractorCount}</div>
                <div className="text-[11px] uppercase tracking-wide text-white/45 mt-0.5">{contractorCount === 1 ? 'contractor' : 'contractors'}</div>
              </div>
              <div className="rounded-xl border border-brand-500/15 bg-brand-500/5 px-4 py-3">
                <div className="text-2xl font-bold text-brand-400 tabular-nums">
                  {area.avgScore !== null ? area.avgScore.toFixed(1) : '—'}
                </div>
                <div className="text-[11px] uppercase tracking-wide text-white/45 mt-0.5">avg score</div>
              </div>
            </div>
          )}

          {/* Search shortcut */}
          <form action="/search" method="get" className="mt-8 mx-auto max-w-xl text-left" role="search">
            <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg shadow-black/40 focus-within:border-brand-500/40 focus-within:bg-white/[0.06] transition-colors">
              <label className="flex-1 min-w-0">
                <span className="sr-only">Client name</span>
                <input
                  type="text"
                  name="q"
                  placeholder={`Look up a client in ${area.city}…`}
                  className="w-full px-4 py-3 bg-transparent text-white placeholder:text-white/35 focus:outline-none text-[15px]"
                  autoComplete="off"
                />
              </label>
              <button type="submit" className="px-5 py-3 text-[15px] font-semibold bg-brand-500 text-black rounded-xl hover:bg-brand-400 transition-colors inline-flex items-center justify-center gap-2 shrink-0">
                Check client
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Top + bottom clients */}
      {allRated.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className={`grid gap-6 ${showSplit ? 'md:grid-cols-2' : ''}`}>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45 mb-4">
                  {showSplit ? `Best-rated in ${area.city}` : `Rated clients in ${area.city}`}
                </h2>
                <div className="space-y-2">
                  {topClients.map(client => (
                    <ClientRowCard key={client.id} client={client} />
                  ))}
                </div>
              </div>

              {showSplit && bottomClients.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45 mb-4">
                    Worst-rated in {area.city}
                  </h2>
                  <div className="space-y-2">
                    {bottomClients.map(client => (
                      <ClientRowCard key={client.id} client={client} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Recent reviews */}
      {recentReviews.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/45 mb-4">
              Recent activity in {area.city}
            </h2>
            <div className="space-y-2">
              {recentReviews.map(review => (
                <ReviewRowCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hasData && (
        <section className="py-12 px-6">
          <div className="max-w-2xl mx-auto rounded-2xl border border-brand-500/20 bg-surface-raised p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">No reviews yet in {area.city}</h2>
            <p className="text-white/55 text-sm mb-6">
              Joshie&apos;s List grows with every contractor who shares their experience. Be first in {cityState} and help the pros who come after you.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-brand-500 text-black rounded-lg hover:bg-brand-400 transition-colors">
              Join Joshie&apos;s List {area.city}
            </Link>
          </div>
        </section>
      )}

      {/* CTA */}
      {hasData && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-brand-500/20 bg-surface-raised p-10 md:p-14 text-center relative overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-500/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Join Joshie&apos;s List <span className="text-brand-500">{area.city}</span>
                </h2>
                <p className="text-white/55 text-base mb-6 max-w-lg mx-auto">
                  Rate the clients you&apos;ve worked with and see how every other client in {cityState} stacks up before you bid.
                </p>
                <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold bg-brand-500 text-black rounded-lg hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/20">
                  Get Started
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-white/35 text-center mb-4">
            All content on Joshie&apos;s List represents user-submitted opinions and has not been independently verified. Scores and grades are algorithmic calculations of subjective ratings.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-white/40">
              &copy; {new Date().getFullYear()} Joshie&apos;s List. All rights reserved.
            </span>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href="/legal/terms" className="hover:text-white/65 transition-colors">Terms</Link>
              <Link href="/legal/privacy" className="hover:text-white/65 transition-colors">Privacy</Link>
              <Link href="/legal/guidelines" className="hover:text-white/65 transition-colors">Guidelines</Link>
              <Link href="/legal/dispute" className="hover:text-white/65 transition-colors">Dispute</Link>
              <Link href="/login" className="hover:text-white/65 transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ClientRowCard({ client }: { client: ClientRow }) {
  return (
    <Link
      href={`/score/${client.id}`}
      className="glass-card glass-card-hover block p-4 group"
    >
      <div className="flex items-center gap-4">
        <div className={`${getGradeClass(client.grade)} w-12 h-12 text-base shrink-0`}>
          {client.grade ?? '—'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">
              {client.first_name} {client.last_initial}.
            </span>
            <span className="text-xs text-white/35">{client.zip_code}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden max-w-[160px]">
              {client.score !== null && (
                <div
                  className={`${getBarColor(client.score)} h-1.5 rounded-full`}
                  style={{ width: `${(client.score / 5) * 100}%` }}
                />
              )}
            </div>
            <span className="text-xs text-white/55 tabular-nums">
              {client.score !== null ? client.score.toFixed(1) : '—'} · {client.review_count} {client.review_count === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ReviewRowCard({ review }: { review: ReviewRow }) {
  const grade = getGrade(review.weighted_score);
  const clientName = review.clients
    ? `${review.clients.first_name} ${review.clients.last_initial}.`
    : 'Client';
  const clientId = review.clients?.id;

  const date = new Date(review.created_at);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const card = (
    <div className="glass-card glass-card-hover p-4 group">
      <div className="flex items-center gap-4">
        <div className={`${getGradeClass(grade)} w-11 h-11 text-sm shrink-0`}>
          {grade}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">
              {clientName}
            </span>
            <span className="text-xs text-white/35">·</span>
            <span className="text-xs text-white/55">{review.job_type}</span>
            <span className="text-xs text-white/35">·</span>
            <span className="text-xs text-white/55">{review.job_value_range}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
            <span className="tabular-nums">{review.weighted_score.toFixed(1)} / 5.0</span>
            <span>·</span>
            <span>{dateStr}</span>
            {review.would_work_again !== null && (
              <>
                <span>·</span>
                <span className={review.would_work_again ? 'text-emerald-400' : 'text-red-400'}>
                  {review.would_work_again ? 'Would work again' : 'Would not work again'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return clientId ? <Link href={`/score/${clientId}`}>{card}</Link> : card;
}
