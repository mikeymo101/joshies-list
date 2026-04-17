import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const admin = createAdminClient();
  const { data: client } = await admin.from('clients').select('first_name, last_initial, city, state, score, grade, review_count').eq('id', params.id).single();

  if (!client) {
    return { title: 'Score Card Not Found — Joshies List' };
  }

  const name = `${client.first_name} ${client.last_initial}.`;
  const location = `${client.city}, ${client.state}`;
  const grade = client.grade ?? 'N/A';
  const score = client.score !== null ? client.score.toFixed(1) : 'N/A';
  const title = `${name} — Grade ${grade} (${score}/5.0) — Joshies List`;
  const description = `${name} in ${location} has a ${grade} grade with ${score}/5.0 from ${client.review_count} contractor ${client.review_count === 1 ? 'review' : 'reviews'} on Joshies List.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: 'Joshies List',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

function getGradeClass(grade: string | null) {
  switch (grade) {
    case 'A': return 'score-grade-a';
    case 'B': return 'score-grade-b';
    case 'C': return 'score-grade-c';
    case 'D': return 'score-grade-d';
    case 'F': return 'score-grade-f';
    default: return 'score-grade bg-white/10 text-navy-400 border border-white/10';
  }
}

function getBarColor(score: number) {
  if (score >= 4.5) return 'bg-emerald-500';
  if (score >= 3.5) return 'bg-blue-500';
  if (score >= 2.5) return 'bg-amber-500';
  if (score >= 1.5) return 'bg-orange-500';
  return 'bg-red-500';
}

export default async function ScoreCardPage({ params }: { params: { id: string } }) {
  const admin = createAdminClient();

  const { data: client } = await admin
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center max-w-md">
          <p className="text-navy-400">Score card not found</p>
          <Link href="/" className="text-brand-400 text-sm mt-2 inline-block">Go to Joshies List</Link>
        </div>
      </div>
    );
  }

  // Get score breakdown
  const { data: reviews } = await admin
    .from('reviews')
    .select('score_payment, score_post_job, score_scope, score_professionalism, score_access, would_work_again')
    .eq('client_id', params.id)
    .eq('status', 'active');

  let breakdown = null;
  let wouldWorkAgainPct: number | null = null;

  if (reviews && reviews.length > 0) {
    const count = reviews.length;
    breakdown = {
      payment: Math.round((reviews.reduce((s, r) => s + r.score_payment, 0) / count) * 10) / 10,
      post_job: Math.round((reviews.reduce((s, r) => s + r.score_post_job, 0) / count) * 10) / 10,
      scope: Math.round((reviews.reduce((s, r) => s + r.score_scope, 0) / count) * 10) / 10,
      professionalism: Math.round((reviews.reduce((s, r) => s + r.score_professionalism, 0) / count) * 10) / 10,
      access: Math.round((reviews.reduce((s, r) => s + r.score_access, 0) / count) * 10) / 10,
    };
    const workAgain = reviews.filter(r => r.would_work_again !== null);
    if (workAgain.length > 0) {
      wouldWorkAgainPct = Math.round((workAgain.filter(r => r.would_work_again === true).length / workAgain.length) * 100);
    }
  }

  const categories = breakdown ? [
    { label: 'Pays on Time', score: breakdown.payment },
    { label: 'No Surprises After', score: breakdown.post_job },
    { label: 'Sticks to the Plan', score: breakdown.scope },
    { label: 'Easy to Work With', score: breakdown.professionalism },
    { label: 'Site Ready & On Time', score: breakdown.access },
  ] : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="text-lg font-bold text-white">
<img src="/logo.svg" alt="Joshies List" className="h-6 inline-block" />
          </Link>
          <p className="text-xs text-navy-500 mt-1">Client Score Card</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 lg:p-8 gradient-border">
          {/* Client header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {client.first_name} {client.last_initial}.
              </h1>
              <p className="text-sm text-navy-400">{client.city}, {client.state} {client.zip_code}</p>
            </div>
            <div className={`${getGradeClass(client.grade)} w-16 h-16 text-2xl`}>
              {client.grade ?? '--'}
            </div>
          </div>

          {/* Overall score */}
          {client.score !== null && (
            <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-3xl font-bold text-brand-400">{client.score.toFixed(1)}</div>
              <div className="flex-1">
                <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-500 h-2 rounded-full"
                    style={{ width: `${(client.score / 5) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-navy-500">out of 5.0</span>
                  <span className="text-xs text-navy-500">{client.review_count} {client.review_count === 1 ? 'review' : 'reviews'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Would work again */}
          {wouldWorkAgainPct !== null && (
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className={`text-2xl font-bold ${wouldWorkAgainPct >= 70 ? 'text-emerald-400' : wouldWorkAgainPct >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                {wouldWorkAgainPct}%
              </span>
              <span className="text-sm text-navy-400">of contractors would work with this client again</span>
            </div>
          )}

          {/* Score breakdown */}
          {categories.length > 0 && (
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.label} className="flex items-center gap-3">
                  <span className="text-xs text-navy-300 w-28 shrink-0">{cat.label}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`${getBarColor(cat.score)} h-1.5 rounded-full`}
                      style={{ width: `${(cat.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-white w-8 text-right">{cat.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-white/20 text-center mt-4 leading-relaxed">
          Scores reflect user-submitted opinions and are not independently verified.{' '}
          <Link href="/legal/dispute" className="underline">Request removal</Link>
        </p>

        {/* CTA */}
        <div className="text-center mt-6">
          <p className="text-xs text-white/30 mb-3">Are you a contractor? Join the network.</p>
          <Link
            href="/signup"
            className="inline-block px-6 py-2.5 text-sm font-semibold bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-all"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </div>
  );
}
