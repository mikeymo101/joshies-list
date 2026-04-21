'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

interface ReviewFull {
  id: string;
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
  status: string;
  created_at: string;
  clients: { id: string; first_name: string; last_initial: string; city: string; state: string; zip_code: string };
  contractors: { id: string; first_name: string; last_name: string; business_name: string; trade_type: string; phone: string };
}

interface ReviewDetail extends ReviewFull {
  contractors: ReviewFull['contractors'] & { primary_state: string; auth_user_id: string; created_at: string };
}

const VALUE_LABELS: Record<string, string> = {
  'under-5k': '< $5K', '5k-15k': '$5-15K', '15k-50k': '$15-50K', '50k-100k': '$50-100K', 'over-100k': '$100K+', 'Not specified': '--',
};

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ReviewFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  // Detail modal
  const [selectedReview, setSelectedReview] = useState<ReviewDetail | null>(null);
  const [contractorEmail, setContractorEmail] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Edit state
  const [editScores, setEditScores] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadReviews(); }, []);

  async function loadReviews(q?: string) {
    setSearching(true);
    try {
      const url = q ? `/api/admin/reviews?q=${encodeURIComponent(q)}` : '/api/admin/reviews';
      const res = await fetch(url);
      if (res.status === 403) { setForbidden(true); return; }
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {} finally { setLoading(false); setSearching(false); }
  }

  async function openDetail(id: string) {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`);
      const data = await res.json();
      setSelectedReview(data.review);
      setContractorEmail(data.contractorEmail);
      setEditScores({
        score_payment: data.review.score_payment,
        score_post_job: data.review.score_post_job,
        score_scope: data.review.score_scope,
        score_professionalism: data.review.score_professionalism,
        score_access: data.review.score_access,
      });
    } catch { toast('Failed to load review', 'error'); }
    finally { setDetailLoading(false); }
  }

  async function handleSave() {
    if (!selectedReview) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/reviews/${selectedReview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editScores),
      });
      if (res.ok) {
        toast('Review updated', 'success');
        loadReviews(search || undefined);
        setSelectedReview(null);
      } else toast('Failed to update', 'error');
    } catch { toast('Something went wrong', 'error'); }
    finally { setSaving(false); }
  }

  async function handleRemove() {
    if (!selectedReview) return;
    if (!confirm('Remove this review? It will be flagged and excluded from scores.')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/reviews/${selectedReview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'removed' }),
      });
      if (res.ok) {
        toast('Review removed', 'success');
        loadReviews(search || undefined);
        setSelectedReview(null);
      }
    } catch { toast('Something went wrong', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!selectedReview) return;
    if (!confirm('Permanently delete this review? This cannot be undone.')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/reviews/${selectedReview.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Review permanently deleted', 'success');
        loadReviews(search || undefined);
        setSelectedReview(null);
      } else {
        const data = await res.json();
        toast(data.error || 'Failed to delete', 'error');
      }
    } catch { toast('Something went wrong', 'error'); }
    finally { setSaving(false); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadReviews(search || undefined);
  }

  if (forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center max-w-md">
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <Link href="/dashboard" className="text-brand-400 text-sm">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Review Management</h1>
          <p className="text-navy-400 mt-1">Search, view, and moderate reviews</p>
        </div>
        <Link href="/admin" className="text-sm text-navy-400 hover:text-navy-300">Back to Admin</Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="glass-card p-4 flex gap-3">
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by client name, contractor, or job type..." className="flex-1" />
        <Button type="submit" disabled={searching}>{searching ? 'Searching...' : 'Search'}</Button>
      </form>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-navy-500">{reviews.length} reviews</p>
          {reviews.map(r => (
            <button
              key={r.id}
              onClick={() => openDetail(r.id)}
              className="w-full glass-card p-4 text-left hover:bg-white/[0.08] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">{r.clients.first_name} {r.clients.last_initial}.</span>
                    <span className="text-xs text-navy-500">{r.clients.city}, {r.clients.state}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-navy-400">by {r.contractors.first_name} {r.contractors.last_name}</span>
                    {r.contractors.business_name && <span className="text-xs text-navy-600">({r.contractors.business_name})</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-navy-500">{r.job_type}</span>
                    <span className="text-xs text-navy-600">{VALUE_LABELS[r.job_value_range] || r.job_value_range}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-brand-400">{r.weighted_score.toFixed(1)}</div>
                  <div className="text-xs text-navy-500">{new Date(r.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {(selectedReview || detailLoading) && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !detailLoading && setSelectedReview(null)}>
          <div className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {detailLoading ? (
              <div className="h-64 flex items-center justify-center"><div className="text-navy-400">Loading...</div></div>
            ) : selectedReview && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Review Detail</h2>
                  <button onClick={() => setSelectedReview(null)} className="text-navy-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Client info */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-4">
                  <div className="text-xs text-navy-500 uppercase tracking-wider mb-1">Client</div>
                  <div className="text-sm font-semibold text-white">{selectedReview.clients.first_name} {selectedReview.clients.last_initial}.</div>
                  <div className="text-xs text-navy-400">{selectedReview.clients.city}, {selectedReview.clients.state} {selectedReview.clients.zip_code}</div>
                </div>

                {/* Contractor info - THIS IS THE ACCOUNTABILITY PIECE */}
                <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/10 mb-4">
                  <div className="text-xs text-brand-400 uppercase tracking-wider mb-1">Submitted By</div>
                  <div className="text-sm font-semibold text-white">{selectedReview.contractors.first_name} {selectedReview.contractors.last_name}</div>
                  {selectedReview.contractors.business_name && <div className="text-xs text-navy-400">{selectedReview.contractors.business_name}</div>}
                  <div className="text-xs text-navy-400 mt-1">
                    {selectedReview.contractors.trade_type && <span>{selectedReview.contractors.trade_type} | </span>}
                    {selectedReview.contractors.primary_state && <span>{selectedReview.contractors.primary_state} | </span>}
                    {selectedReview.contractors.phone && <span>{selectedReview.contractors.phone}</span>}
                  </div>
                  {contractorEmail && <div className="text-xs text-brand-400 mt-1">{contractorEmail}</div>}
                  <div className="text-xs text-navy-600 mt-1">Member since {new Date(selectedReview.contractors.created_at).toLocaleDateString()}</div>
                </div>

                {/* Job info */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-4">
                  <div className="text-xs text-navy-500 uppercase tracking-wider mb-1">Job Details</div>
                  <div className="text-sm text-white">{selectedReview.job_type}</div>
                  <div className="text-xs text-navy-400">{VALUE_LABELS[selectedReview.job_value_range] || selectedReview.job_value_range} | {selectedReview.job_date_approx}</div>
                  {selectedReview.would_work_again !== null && (
                    <div className={`text-xs font-semibold mt-1 ${selectedReview.would_work_again ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedReview.would_work_again ? 'Would work again' : 'Would NOT work again'}
                    </div>
                  )}
                  <div className="text-xs text-navy-600 mt-1">Submitted {new Date(selectedReview.created_at).toLocaleString()}</div>
                </div>

                {/* Editable scores */}
                <div className="mb-4">
                  <div className="text-xs text-navy-500 uppercase tracking-wider mb-3">Scores (editable)</div>
                  <div className="space-y-2">
                    {[
                      { key: 'score_payment', label: 'Payment (30%)' },
                      { key: 'score_post_job', label: 'Post-Job (20%)' },
                      { key: 'score_scope', label: 'Scope (20%)' },
                      { key: 'score_professionalism', label: 'Professionalism (15%)' },
                      { key: 'score_access', label: 'Access (15%)' },
                    ].map(s => (
                      <div key={s.key} className="flex items-center gap-3">
                        <span className="text-xs text-navy-300 w-36 shrink-0">{s.label}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(v => (
                            <button
                              key={v}
                              onClick={() => setEditScores(prev => ({ ...prev, [s.key]: v }))}
                              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                                editScores[s.key] === v
                                  ? 'bg-brand-500 text-navy-950'
                                  : 'bg-white/5 text-navy-500 hover:bg-white/10'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="danger" onClick={handleRemove} disabled={saving}>
                    Flag as Removed
                  </Button>
                  <Button variant="danger" onClick={handleDelete} disabled={saving}>
                    Delete Forever
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
