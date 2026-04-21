'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Area {
  zip_code: string;
  city: string;
  state: string;
  avgScore: number;
  grade: string;
  clientCount: number;
  reviewCount: number;
  wouldWorkAgainPct: number | null;
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

function getScoreBarColor(score: number) {
  if (score >= 4.5) return 'bg-grade-a';
  if (score >= 3.5) return 'bg-grade-b';
  if (score >= 2.5) return 'bg-grade-c';
  if (score >= 1.5) return 'bg-grade-d';
  return 'bg-grade-f';
}

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score-desc' | 'score-asc' | 'reviews'>('score-desc');

  useEffect(() => {
    fetch('/api/areas')
      .then(r => r.json())
      .then(d => setAreas(d.areas || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...areas].sort((a, b) => {
    if (sortBy === 'score-desc') return b.avgScore - a.avgScore;
    if (sortBy === 'score-asc') return a.avgScore - b.avgScore;
    return b.reviewCount - a.reviewCount;
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Area Scores</h1>
        <p className="text-navy-400 mt-1">Average client ratings by zip code</p>
      </div>

      {/* Sort controls */}
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

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : areas.length === 0 ? (
        <div className="glass-card p-12 lg:p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-brand-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No area insights yet</h3>
          <p className="text-navy-400 text-sm mb-6 max-w-sm mx-auto">As contractors submit reviews, area scores reveal which neighborhoods have the best clients. Start reviewing to build the map.</p>
          <Link href="/review/new" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-black font-semibold rounded-xl hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Submit a Review
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(area => (
            <Link key={area.zip_code} href={`/areas/${area.zip_code}`} className="glass-card p-4 lg:p-5 block hover:bg-white/[0.08] transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`${getGradeClass(area.grade)} shrink-0`}>
                  {area.grade}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm lg:text-base font-semibold text-white group-hover:text-brand-400 transition-colors">{area.city}, {area.state}</h3>
                    <span className="text-xs text-navy-500">{area.zip_code}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden max-w-xs">
                      <div
                        className={`${getScoreBarColor(area.avgScore)} h-1.5 rounded-full transition-all`}
                        style={{ width: `${(area.avgScore / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-brand-400 shrink-0">{area.avgScore.toFixed(1)}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="text-xs text-navy-400">{area.clientCount} clients</div>
                  <div className="text-xs text-navy-500">{area.reviewCount} reviews</div>
                  {area.wouldWorkAgainPct !== null && (
                    <div className={`text-xs font-semibold mt-0.5 ${area.wouldWorkAgainPct >= 70 ? 'text-emerald-400' : area.wouldWorkAgainPct >= 40 ? 'text-brand-400' : 'text-red-400'}`}>
                      {area.wouldWorkAgainPct}% would work again
                    </div>
                  )}
                </div>
              </div>
              {/* Mobile stats */}
              <div className="flex items-center gap-4 mt-2 sm:hidden text-xs text-navy-500">
                <span>{area.clientCount} clients</span>
                <span>{area.reviewCount} reviews</span>
                {area.wouldWorkAgainPct !== null && (
                  <span className={`font-semibold ${area.wouldWorkAgainPct >= 70 ? 'text-emerald-400' : area.wouldWorkAgainPct >= 40 ? 'text-brand-400' : 'text-red-400'}`}>
                    {area.wouldWorkAgainPct}% again
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
