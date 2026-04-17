'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Verification {
  id: string;
  contractor_id: string;
  license_number: string;
  license_state: string;
  document_url: string | null;
  status: string;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  contractors: { first_name: string; last_name: string; business_name: string; trade_type: string; primary_state: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/25',
};

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/verifications')
      .then(r => {
        if (r.status === 403) { setForbidden(true); return null; }
        return r.json();
      })
      .then(d => { if (d) setVerifications(d.verifications || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleAction(id: string, status: 'approved' | 'rejected') {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/verifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setVerifications(prev => prev.map(v => v.id === id ? { ...v, status, reviewed_at: new Date().toISOString() } : v));
      }
    } catch {} finally { setUpdating(null); }
  }

  const filtered = filter === 'all' ? verifications : verifications.filter(v => v.status === filter);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><div className="h-64 bg-white/5 rounded-2xl animate-pulse" /></div>;

  if (forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center max-w-md">
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm mb-4">You don&apos;t have admin access.</p>
          <Link href="/dashboard" className="text-amber-400 text-sm">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Verifications</h1>
          <p className="text-gray-400 mt-1">{verifications.length} submissions &middot; {verifications.filter(v => v.status === 'pending').length} pending</p>
        </div>
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-300">Back to Admin</Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'approved', 'rejected'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === s
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                : 'bg-white/5 text-gray-500 border border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} ({s === 'all' ? verifications.length : verifications.filter(v => v.status === s).length})
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-500">{verifications.length === 0 ? 'No verification submissions yet.' : 'No submissions match this filter.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(v => (
            <div key={v.id} className="glass-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {v.contractors && (
                      <h3 className="text-sm font-semibold text-white">{v.contractors.first_name} {v.contractors.last_name}</h3>
                    )}
                    {v.contractors?.business_name && (
                      <span className="text-xs text-gray-500">{v.contractors.business_name}</span>
                    )}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${STATUS_COLORS[v.status] || STATUS_COLORS.pending}`}>
                      {v.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                    <span>License: <span className="text-white font-mono">{v.license_number}</span></span>
                    <span>State: {v.license_state}</span>
                    {v.contractors?.trade_type && <span>{v.contractors.trade_type}</span>}
                    <span>Submitted {new Date(v.created_at).toLocaleDateString()}</span>
                    {v.reviewed_at && <span>Reviewed {new Date(v.reviewed_at).toLocaleDateString()}</span>}
                  </div>
                  {v.document_url && (
                    <a href={v.document_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-amber-400 hover:text-amber-300">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      View Document
                    </a>
                  )}
                </div>
                {v.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(v.id, 'approved')}
                      disabled={updating === v.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(v.id, 'rejected')}
                      disabled={updating === v.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 transition-all disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
