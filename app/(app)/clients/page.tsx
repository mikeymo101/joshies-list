'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface ReviewWithClient {
  id: string;
  client_id: string;
  score_payment: number;
  score_post_job: number;
  score_scope: number;
  score_professionalism: number;
  score_access: number;
  weighted_score: number;
  would_work_again: boolean | null;
  job_type: string;
  job_value_range: string;
  job_date_approx: string;
  created_at: string;
  clients: {
    id: string;
    first_name: string;
    last_initial: string;
    city: string;
    state: string;
    zip_code: string;
    score: number | null;
    grade: string | null;
  };
}

const VALUE_LABELS: Record<string, string> = {
  'under-5k': '< $5K',
  '5k-15k': '$5-15K',
  '15k-50k': '$15-50K',
  '50k-100k': '$50-100K',
  'over-100k': '$100K+',
  'Not specified': '--',
};

export default function MyReviewsPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/reviews/mine')
      .then(r => r.json())
      .then(d => setReviews(d.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this review? This will recalculate the client\'s score.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
        toast('Review deleted', 'success');
      } else {
        toast('Failed to delete', 'error');
      }
    } catch { toast('Something went wrong', 'error'); }
    finally { setDeleting(null); }
  }

  function handleExportCSV() {
    const headers = ['Client', 'City', 'State', 'Zip', 'Pays on Time', 'No Surprises After', 'Sticks to the Plan', 'Easy to Work With', 'Site Ready & On Time', 'Weighted Score', 'Would Work Again', 'Job Type', 'Job Value', 'Date'];
    const rows = reviews.map(r => [
      `${r.clients.first_name} ${r.clients.last_initial}.`,
      r.clients.city, r.clients.state, r.clients.zip_code,
      r.score_payment, r.score_post_job, r.score_scope, r.score_professionalism, r.score_access,
      r.weighted_score.toFixed(1),
      r.would_work_again === null ? '' : r.would_work_again ? 'Yes' : 'No',
      r.job_type, r.job_value_range,
      new Date(r.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `joshies-list-reviews-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('CSV downloaded', 'success');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">My Reviews</h1>
          <p className="text-navy-400 mt-1">{reviews.length} reviews submitted</p>
        </div>
        <div className="flex gap-2">
          {reviews.length > 0 && (
            <Button variant="secondary" size="sm" onClick={handleExportCSV}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </Button>
          )}
          <Link href="/review/new">
            <Button size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Review
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass-card p-12 lg:p-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-brand-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Your reviews will show up here</h3>
          <p className="text-navy-400 text-sm mb-6 max-w-sm mx-auto">Once you rate a client, you can track all your reviews, export to CSV, and see how scores change over time.</p>
          <Link href="/review/new">
            <Button size="lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Your First Review
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className="glass-card p-4 lg:p-5">
              <div className="flex items-start justify-between gap-4">
                <Link href={`/clients/${review.clients.id}`} className="flex-1 min-w-0 group">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm lg:text-base font-semibold text-white group-hover:text-brand-400 transition-colors">
                      {review.clients.first_name} {review.clients.last_initial}.
                    </h3>
                    <span className="text-xs text-navy-500">{review.clients.city}, {review.clients.state}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-navy-400">{review.job_type}</span>
                    <span className="text-xs text-navy-600">{VALUE_LABELS[review.job_value_range] || review.job_value_range}</span>
                    <span className="text-xs text-navy-600">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-lg font-bold text-brand-400">{review.weighted_score.toFixed(1)}</div>
                    {review.would_work_again !== null && (
                      <div className={`text-xs font-semibold ${review.would_work_again ? 'text-emerald-400' : 'text-red-400'}`}>
                        {review.would_work_again ? 'Would hire again' : 'Would not hire'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deleting === review.id}
                    className="p-2 rounded-lg text-navy-600 hover:text-red-400 hover:bg-red-500/5 transition-all"
                    title="Delete review"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Score pills */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {[
                  { label: 'Pays', score: review.score_payment },
                  { label: 'After', score: review.score_post_job },
                  { label: 'Plan', score: review.score_scope },
                  { label: 'Easy', score: review.score_professionalism },
                  { label: 'Site', score: review.score_access },
                ].map(s => (
                  <span key={s.label} className={`text-xs px-2 py-1 rounded-lg border ${
                    s.score >= 4 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    s.score >= 3 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    s.score >= 2 ? 'bg-brand-500/10 border-brand-500/20 text-brand-400' :
                    'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {s.label}: {s.score}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
