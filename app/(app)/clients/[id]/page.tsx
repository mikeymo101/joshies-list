'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScoreBar from '@/components/ui/ScoreBar';
import { useToast } from '@/components/ui/Toast';
import type { Client } from '@/types';
import { MapPin, Share2, Calendar, DollarSign, ThumbsUp, ThumbsDown, ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';

function getGradeConfig(grade: string | null) {
  switch (grade) {
    case 'A': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]' };
    case 'B': return { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.25)]' };
    case 'C': return { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]' };
    case 'D': return { bg: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.25)]' };
    case 'F': return { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.25)]' };
    default: return { bg: 'bg-white/5', border: 'border-white/20', text: 'text-white/40', glow: '' };
  }
}

interface ReviewSummary {
  score_payment: number; score_post_job: number; score_scope: number;
  score_professionalism: number; score_access: number;
  weighted_score: number; would_work_again: boolean | null;
  job_type: string; job_value_range: string; created_at: string;
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<Record<string, number> | null>(null);
  const [reviews, setReviews] = useState<ReviewSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [onWatchlist, setOnWatchlist] = useState(false);

  useEffect(() => {
    fetch(`/api/clients/${params.id}`)
      .then(r => r.json())
      .then(d => { setClient(d.client); setScoreBreakdown(d.scoreBreakdown); setReviews(d.reviews || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
    // Check watchlist
    const wl = JSON.parse(localStorage.getItem('jl_watchlist') || '[]');
    setOnWatchlist(wl.some((i: { id: string }) => i.id === params.id));
  }, [params.id]);

  function toggleWatchlist() {
    if (!client) return;
    const wl = JSON.parse(localStorage.getItem('jl_watchlist') || '[]');
    if (onWatchlist) {
      const updated = wl.filter((i: { id: string }) => i.id !== client.id);
      localStorage.setItem('jl_watchlist', JSON.stringify(updated));
      setOnWatchlist(false);
      toast('Removed from watchlist', 'success');
    } else {
      wl.push({ id: client.id, first_name: client.first_name, last_initial: client.last_initial, city: client.city, state: client.state, grade: client.grade, addedAt: Date.now() });
      localStorage.setItem('jl_watchlist', JSON.stringify(wl));
      setOnWatchlist(true);
      toast('Added to watchlist', 'success');
    }
  }

  if (loading) {
    return <div className="space-y-6">{[1,2,3].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />)}</div>;
  }

  if (!client) {
    return <div className="glass-card p-12 text-center"><p className="text-white/50">Client not found</p><Link href="/search" className="text-amber-400 text-sm mt-2 inline-block">Back to search</Link></div>;
  }

  const gc = getGradeConfig(client.grade);
  const wouldWorkAgainPct = (client as unknown as Record<string, unknown>).would_work_again_pct as number | null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/search" className="text-sm text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to search
      </Link>

      {/* Header card */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className={`w-28 h-28 flex items-center justify-center rounded-xl border-2 font-bold text-5xl backdrop-blur-sm ${gc.bg} ${gc.border} ${gc.text} ${gc.glow}`}>
            {client.grade ?? '--'}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{client.first_name} {client.last_initial}.</h1>
            <div className="flex items-center gap-2 text-white/50 mt-1 mb-3">
              <MapPin className="w-4 h-4" />
              <span>{client.city}, {client.state} {client.zip_code}</span>
            </div>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <span className="text-white/50">{client.review_count} reviews</span>
              {wouldWorkAgainPct !== null && (
                <>
                  <span className="text-white/30">|</span>
                  <span className={wouldWorkAgainPct >= 70 ? 'text-emerald-400' : 'text-red-400'}>
                    {wouldWorkAgainPct}% would work again
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleWatchlist}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
                onWatchlist
                  ? 'bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/15'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
              }`}>
              {onWatchlist ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {onWatchlist ? 'Saved' : 'Watch'}
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/score/${client.id}`);
              toast('Score card link copied!', 'success');
            }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Overall score */}
      {client.score !== null && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Overall Score</h2>
          <ScoreBar label="Overall Rating" score={client.score} />
          {scoreBreakdown && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
              {[
                { name: 'Pays on Time', score: scoreBreakdown.payment },
                { name: 'No Surprises', score: scoreBreakdown.post_job },
                { name: 'Sticks to Plan', score: scoreBreakdown.scope },
                { name: 'Easy to Work With', score: scoreBreakdown.professionalism },
                { name: 'Site & Schedule', score: scoreBreakdown.access },
              ].map(cat => (
                <div key={cat.name} className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="font-mono text-2xl font-bold text-amber-400">{cat.score.toFixed(1)}</div>
                  <div className="text-xs text-white/50 mt-1">{cat.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category breakdown */}
      {scoreBreakdown && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Category Breakdown</h2>
          <div className="space-y-4">
            <ScoreBar label="Pays on Time" score={scoreBreakdown.payment} />
            <ScoreBar label="No Surprises After" score={scoreBreakdown.post_job} />
            <ScoreBar label="Sticks to the Plan" score={scoreBreakdown.scope} />
            <ScoreBar label="Easy to Work With" score={scoreBreakdown.professionalism} />
            <ScoreBar label="Site Ready & On Time" score={scoreBreakdown.access} />
          </div>
        </div>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">Reviews</h2>
          <p className="text-white/50 text-sm mb-4">{reviews.length} contractor reviews</p>
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm text-white/70">{r.job_type}</div>
                  <div className="font-mono text-lg font-bold text-amber-400">{r.weighted_score.toFixed(1)}</div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(r.created_at).toLocaleDateString()}</span>
                  {r.job_value_range !== 'Not specified' && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{r.job_value_range}</span>}
                  {r.would_work_again !== null && (
                    <span className="flex items-center gap-1">
                      {r.would_work_again ? <><ThumbsUp className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400">Would work again</span></> : <><ThumbsDown className="w-4 h-4 text-red-400" /><span className="text-red-400">Would not work again</span></>}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review CTA */}
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Worked with this client?</h3>
          <p className="text-xs text-white/40 mt-0.5">Help other contractors by leaving a review</p>
        </div>
        <Link href={`/review/${client.id}`} className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 transition-all text-sm">
          Leave a Review
        </Link>
      </div>
    </div>
  );
}
