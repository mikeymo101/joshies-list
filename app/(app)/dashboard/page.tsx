'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface DashStats {
  totalReviews: number;
  totalClients: number;
  avgClientScore: number | null;
  wouldWorkAgainPct: number | null;
  recentReviews: Array<{
    id: string;
    client: { first_name: string; last_initial: string; city: string; state: string };
    weighted_score: number;
    job_type: string;
    created_at: string;
  }>;
  topClients: Array<{ client: { id: string; first_name: string; last_initial: string }; avgScore: number }>;
  bottomClients: Array<{ client: { id: string; first_name: string; last_initial: string }; avgScore: number }>;
  jobValueBreakdown: Array<{ range: string; count: number; avgScore: number; wouldWorkAgainPct: number | null }>;
  seasonalTrends: Array<{ quarter: string; count: number; avgScore: number }>;
  platformAvg: number | null;
}

const VALUE_LABELS: Record<string, string> = {
  'under-5k': '< $5K',
  '5k-15k': '$5-15K',
  '15k-50k': '$15-50K',
  '50k-100k': '$50-100K',
  'over-100k': '$100K+',
  'Not specified': 'N/A',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-navy-400 mt-1">Your contractor overview</p>
        </div>
        <Link href="/review/new">
          <Button>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Submit Review
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : stats?.totalReviews === 0 ? (
        /* Empty state onboarding */
        <div className="glass-card p-8 lg:p-12 gradient-border">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Joshie&apos;s List</h2>
            <p className="text-navy-400 mb-8">Get started by reviewing your first client. Your insights help every contractor in the network.</p>

            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-brand-500 text-navy-950 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <div className="text-sm font-semibold text-white">Submit your first review</div>
                  <div className="text-xs text-navy-500 mt-0.5">Rate a client on things like payment, scope, and how easy they are to work with</div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-navy-300 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <div className="text-sm font-semibold text-white">Look up future clients</div>
                  <div className="text-xs text-navy-500 mt-0.5">Search by name or zip before you bid on a job</div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-navy-300 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <div className="text-sm font-semibold text-white">Explore area scores</div>
                  <div className="text-xs text-navy-500 mt-0.5">See which neighborhoods have the best (and worst) clients</div>
                </div>
              </div>
            </div>

            <Link href="/review/new">
              <Button size="lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Your First Review
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="glass-card p-4 lg:p-6">
              <span className="text-xs lg:text-sm text-navy-400">Reviews</span>
              <div className="text-2xl lg:text-3xl font-bold text-white mt-1">{stats?.totalReviews ?? 0}</div>
            </div>
            <div className="glass-card p-4 lg:p-6">
              <span className="text-xs lg:text-sm text-navy-400">Clients</span>
              <div className="text-2xl lg:text-3xl font-bold text-white mt-1">{stats?.totalClients ?? 0}</div>
            </div>
            <div className="glass-card p-4 lg:p-6">
              <span className="text-xs lg:text-sm text-navy-400">Avg Score</span>
              <div className="text-2xl lg:text-3xl font-bold gradient-text mt-1">
                {stats?.avgClientScore?.toFixed(1) ?? '--'}
              </div>
            </div>
            <div className="glass-card p-4 lg:p-6">
              <span className="text-xs lg:text-sm text-navy-400">Would Work Again</span>
              <div className="text-2xl lg:text-3xl font-bold mt-1">
                {stats?.wouldWorkAgainPct !== null && stats?.wouldWorkAgainPct !== undefined ? (
                  <span className={stats.wouldWorkAgainPct >= 70 ? 'text-emerald-400' : stats.wouldWorkAgainPct >= 40 ? 'text-amber-400' : 'text-red-400'}>
                    {stats.wouldWorkAgainPct}%
                  </span>
                ) : (
                  <span className="text-navy-500">--</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/search" className="glass-card p-4 flex items-center gap-4 hover:bg-white/[0.08] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">Look Up a Client</div>
                <div className="text-xs text-navy-500">Search by name or zip</div>
              </div>
            </Link>
            <Link href="/areas" className="glass-card p-4 flex items-center gap-4 hover:bg-white/[0.08] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">Area Scores</div>
                <div className="text-xs text-navy-500">See zip code ratings</div>
              </div>
            </Link>
          </div>

          {/* Job value insights */}
          {stats?.jobValueBreakdown && stats.jobValueBreakdown.length > 0 && stats.jobValueBreakdown[0].range !== 'Not specified' && (
            <div className="glass-card p-4 lg:p-6">
              <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-4">
                Score by Job Value
              </h2>
              <div className="space-y-3">
                {stats.jobValueBreakdown
                  .filter(j => j.range !== 'Not specified')
                  .sort((a, b) => {
                    const order = ['under-5k', '5k-15k', '15k-50k', '50k-100k', 'over-100k'];
                    return order.indexOf(a.range) - order.indexOf(b.range);
                  })
                  .map(j => (
                    <div key={j.range} className="flex items-center gap-3">
                      <span className="text-sm text-navy-300 w-20 shrink-0">{VALUE_LABELS[j.range] || j.range}</span>
                      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all"
                          style={{ width: `${(j.avgScore / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-brand-400 w-10 text-right">{j.avgScore}</span>
                      <span className="text-xs text-navy-500 w-16 text-right">{j.count} jobs</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Best & worst clients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats?.topClients && stats.topClients.length > 0 && (
              <div className="glass-card p-4 lg:p-6">
                <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-3">
                  Best Clients
                </h2>
                <div className="space-y-2">
                  {stats.topClients.map((c, i) => (
                    <Link key={i} href={`/clients/${(c.client as Record<string, string>).id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                      <span className="text-sm text-white">{(c.client as Record<string, string>).first_name} {(c.client as Record<string, string>).last_initial}.</span>
                      <span className="text-sm font-semibold text-emerald-400">{c.avgScore.toFixed(1)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {stats?.bottomClients && stats.bottomClients.length > 0 && (
              <div className="glass-card p-4 lg:p-6">
                <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-3">
                  Toughest Clients
                </h2>
                <div className="space-y-2">
                  {stats.bottomClients.map((c, i) => (
                    <Link key={i} href={`/clients/${(c.client as Record<string, string>).id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all">
                      <span className="text-sm text-white">{(c.client as Record<string, string>).first_name} {(c.client as Record<string, string>).last_initial}.</span>
                      <span className="text-sm font-semibold text-red-400">{c.avgScore.toFixed(1)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent reviews */}
          <div className="glass-card p-4 lg:p-6">
            <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-3">
              Recent Reviews
            </h2>
            {!stats?.recentReviews || stats.recentReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-navy-500 text-sm">No reviews yet</p>
                <Link href="/review/new" className="text-brand-400 text-sm mt-2 inline-block">Submit your first review</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentReviews.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2 lg:p-3 rounded-lg bg-white/[0.02]">
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-white">{r.client.first_name} {r.client.last_initial}.</span>
                      <span className="text-xs text-navy-500 ml-2 hidden sm:inline">{r.job_type}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold text-brand-400">{r.weighted_score.toFixed(1)}</span>
                      <span className="text-xs text-navy-500">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insights section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Platform comparison */}
            {stats?.platformAvg !== null && stats?.platformAvg !== undefined && stats?.avgClientScore !== null && stats?.avgClientScore !== undefined && (
              <div className="glass-card p-4 lg:p-6">
                <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-4">
                  How You Compare
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-navy-400">Your avg client score</span>
                      <span className="font-semibold text-brand-400">{stats.avgClientScore.toFixed(1)}</span>
                    </div>
                    <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${(stats.avgClientScore / 5) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-navy-400">Platform average</span>
                      <span className="font-semibold text-navy-300">{stats.platformAvg.toFixed(1)}</span>
                    </div>
                    <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                      <div className="bg-navy-500 h-2 rounded-full" style={{ width: `${(stats.platformAvg / 5) * 100}%` }} />
                    </div>
                  </div>
                  <p className="text-xs text-navy-500">
                    {stats.avgClientScore > stats.platformAvg
                      ? `Your clients score ${(stats.avgClientScore - stats.platformAvg).toFixed(1)} points above average — nice picks.`
                      : stats.avgClientScore < stats.platformAvg
                      ? `Your clients score ${(stats.platformAvg - stats.avgClientScore).toFixed(1)} points below average — be more selective.`
                      : 'Your client scores match the platform average.'}
                  </p>
                </div>
              </div>
            )}

            {/* Seasonal trends */}
            {stats?.seasonalTrends && stats.seasonalTrends.length > 1 && (
              <div className="glass-card p-4 lg:p-6">
                <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-4">
                  Seasonal Trends
                </h2>
                <div className="space-y-2">
                  {stats.seasonalTrends.map(t => (
                    <div key={t.quarter} className="flex items-center gap-3">
                      <span className="text-xs text-navy-400 w-16 shrink-0">{t.quarter}</span>
                      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-brand-500 h-2 rounded-full transition-all"
                          style={{ width: `${(t.avgScore / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-brand-400 w-8 text-right">{t.avgScore}</span>
                      <span className="text-xs text-navy-600 w-12 text-right">{t.count} jobs</span>
                    </div>
                  ))}
                </div>
                {stats.seasonalTrends.length >= 2 && (() => {
                  const sorted = [...stats.seasonalTrends].sort((a, b) => a.avgScore - b.avgScore);
                  const worst = sorted[0];
                  const best = sorted[sorted.length - 1];
                  return (
                    <p className="text-xs text-navy-500 mt-3">
                      Best scores in {best.quarter} ({best.avgScore}), toughest in {worst.quarter} ({worst.avgScore})
                    </p>
                  );
                })()}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
