'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  contractors: { first_name: string; last_name: string; business_name: string; trade_type: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  reviewed: 'bg-brand-500/15 text-brand-400 border-brand-500/25',
  planned: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  completed: 'bg-green-500/15 text-green-400 border-green-500/25',
  declined: 'bg-red-500/15 text-red-400 border-red-500/25',
};

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  search: 'Search & Lookup',
  reviews: 'Reviews',
  scoring: 'Scoring',
  mobile: 'Mobile',
  other: 'Other',
};

const STATUSES = ['new', 'reviewed', 'planned', 'completed', 'declined'] as const;

export default function AdminFeatureRequestsPage() {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/feature-requests')
      .then(r => {
        if (r.status === 403) { setForbidden(true); return null; }
        return r.json();
      })
      .then(d => { if (d) setRequests(d.requests || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    setUpdating(id);
    try {
      const res = await fetch('/api/feature-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch {} finally { setUpdating(null); }
  }

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><div className="h-64 bg-white/5 rounded-2xl animate-pulse" /></div>;

  if (forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center max-w-md">
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm mb-4">You don&apos;t have admin access.</p>
          <Link href="/dashboard" className="text-brand-400 text-sm">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Feature Requests</h1>
          <p className="text-gray-400 mt-1">{requests.length} total requests from contractors</p>
        </div>
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-300">Back to Admin</Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'new', 'reviewed', 'planned', 'completed', 'declined'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === s
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                : 'bg-white/5 text-gray-500 border border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} {s !== 'all' ? `(${requests.filter(r => r.status === s).length})` : `(${requests.length})`}
          </button>
        ))}
      </div>

      {/* Requests */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-500">No feature requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => (
            <div key={req.id} className="glass-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{req.title}</h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-gray-500 border border-white/5">
                      {CATEGORY_LABELS[req.category] || req.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 whitespace-pre-wrap">{req.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
                    {req.contractors && (
                      <span>{req.contractors.first_name} {req.contractors.last_name} &middot; {req.contractors.trade_type}</span>
                    )}
                    <span>{new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <select
                  value={req.status}
                  onChange={e => updateStatus(req.id, e.target.value)}
                  disabled={updating === req.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all shrink-0 ${STATUS_COLORS[req.status] || STATUS_COLORS.new} bg-transparent disabled:opacity-50`}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s} className="bg-[#0f1419] text-white">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
