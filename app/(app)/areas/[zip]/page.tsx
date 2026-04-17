'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ClientCard from '@/components/ClientCard';
import type { Client } from '@/types';

interface AreaStats {
  avgScore: number;
  grade: string;
  clientCount: number;
  reviewCount: number;
  wouldWorkAgainPct: number | null;
  city: string;
  state: string;
}

function getGradeClass(grade: string) {
  switch (grade) {
    case 'A': return 'score-grade-a';
    case 'B': return 'score-grade-b';
    case 'C': return 'score-grade-c';
    case 'D': return 'score-grade-d';
    case 'F': return 'score-grade-f';
    default: return 'score-grade bg-white/10 text-navy-400 border border-white/10';
  }
}

export default function AreaDetailPage({ params }: { params: { zip: string } }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<AreaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score-desc' | 'score-asc' | 'reviews'>('score-desc');

  useEffect(() => {
    async function load() {
      try {
        // Fetch clients in this zip
        const res = await fetch(`/api/clients/search?zip=${params.zip}`);
        if (res.ok) {
          const data = await res.json();
          setClients(data.clients || []);
        }
        // Fetch area stats
        const areaRes = await fetch('/api/areas');
        if (areaRes.ok) {
          const areaData = await areaRes.json();
          const match = (areaData.areas || []).find((a: AreaStats & { zip_code: string }) => a.zip_code === params.zip);
          if (match) setStats(match);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.zip]);

  const sorted = [...clients].sort((a, b) => {
    if (sortBy === 'score-desc') return (b.score ?? 0) - (a.score ?? 0);
    if (sortBy === 'score-asc') return (a.score ?? 0) - (b.score ?? 0);
    return b.review_count - a.review_count;
  });

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/areas" className="text-sm text-navy-400 hover:text-navy-300 transition-colors inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Areas
      </Link>

      {loading ? (
        <div className="space-y-4">
          <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-24 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* Area header */}
          <div className="glass-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {stats?.city || 'Zip'} {params.zip}
                </h1>
                {stats && (
                  <p className="text-navy-400 mt-1">
                    {stats.city}, {stats.state}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <span className="text-sm text-navy-300">{clients.length} clients</span>
                  {stats && <span className="text-sm text-navy-300">{stats.reviewCount} total reviews</span>}
                  {stats?.wouldWorkAgainPct !== null && stats?.wouldWorkAgainPct !== undefined && (
                    <span className={`text-sm font-semibold ${stats.wouldWorkAgainPct >= 70 ? 'text-emerald-400' : stats.wouldWorkAgainPct >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                      {stats.wouldWorkAgainPct}% would work again
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {stats && (
                  <>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-brand-400">{stats.avgScore.toFixed(1)}</div>
                      <div className="text-xs text-navy-500">avg score</div>
                    </div>
                    <div className={`${getGradeClass(stats.grade)} w-14 h-14 text-xl`}>
                      {stats.grade}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            {[
              { key: 'score-desc' as const, label: 'Best First' },
              { key: 'score-asc' as const, label: 'Worst First' },
              { key: 'reviews' as const, label: 'Most Reviews' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  sortBy === opt.key
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'bg-white/5 text-navy-400 border border-white/10 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Client list */}
          {clients.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-navy-400 text-sm">No clients found in this zip code</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {sorted.map(client => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
