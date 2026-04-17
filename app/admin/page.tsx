'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface InviteCode {
  id: string;
  code: string;
  used: boolean;
  used_at: string | null;
  created_at: string;
}

interface AdminStats {
  contractors: number;
  clients: number;
  reviews: number;
  inviteCodes: { total: number; used: number; available: number };
  codes: InviteCode[];
  contractorList: Array<{ id: string; first_name: string; last_name: string; business_name: string; trade_type: string; primary_state: string; created_at: string }>;
  recentReviews: Array<{ id: string; weighted_score: number; job_type: string; created_at: string; clients: { first_name: string; last_initial: string } }>;
}

export default function AdminPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [codeCount, setCodeCount] = useState(10);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => {
        if (r.status === 403) { setForbidden(true); return null; }
        return r.json();
      })
      .then(d => { if (d) setStats(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerateCodes() {
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/invite-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: codeCount }),
      });
      if (res.ok) {
        toast(`Generated ${codeCount} invite codes`, 'success');
        const refreshed = await fetch('/api/admin/stats').then(r => r.json());
        setStats(refreshed);
      }
    } catch { toast('Failed to generate', 'error'); }
    finally { setGenerating(false); }
  }

  function copyUnusedCodes() {
    const unused = (stats?.codes || []).filter(c => !c.used).map(c => c.code).join('\n');
    navigator.clipboard.writeText(unused);
    toast(`Copied ${(stats?.codes || []).filter(c => !c.used).length} codes`, 'success');
  }

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><div className="h-64 bg-white/5 rounded-2xl animate-pulse" /></div>;

  if (forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-12 text-center max-w-md">
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-navy-400 text-sm mb-4">You don&apos;t have admin access.</p>
          <Link href="/dashboard" className="text-brand-400 text-sm">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-navy-400 mt-1">Platform overview and management</p>
        </div>
        <Link href="/dashboard" className="text-sm text-navy-400 hover:text-navy-300">Back to app</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card p-4 lg:p-6">
          <span className="text-xs text-navy-400">Contractors</span>
          <div className="text-2xl font-bold text-white mt-1">{stats?.contractors ?? 0}</div>
        </div>
        <div className="glass-card p-4 lg:p-6">
          <span className="text-xs text-navy-400">Clients</span>
          <div className="text-2xl font-bold text-white mt-1">{stats?.clients ?? 0}</div>
        </div>
        <div className="glass-card p-4 lg:p-6">
          <span className="text-xs text-navy-400">Reviews</span>
          <div className="text-2xl font-bold text-white mt-1">{stats?.reviews ?? 0}</div>
        </div>
        <div className="glass-card p-4 lg:p-6">
          <span className="text-xs text-navy-400">Codes Available</span>
          <div className="text-2xl font-bold gradient-text mt-1">{stats?.inviteCodes.available ?? 0}</div>
        </div>
      </div>

      {/* Quick links */}
      <div className="glass-card p-4 space-y-1">
        <Link href="/admin/reviews" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">Review Management</div>
            <div className="text-xs text-navy-500">Search, view, edit, and moderate all reviews</div>
          </div>
        </Link>
        <Link href="/admin/contractors" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Contractor Management</div>
            <div className="text-xs text-navy-500">View all contractors, trades, and verification status</div>
          </div>
        </Link>
        <Link href="/admin/verifications" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">Verifications</div>
            <div className="text-xs text-navy-500">Review and approve license verification submissions</div>
          </div>
        </Link>
        <Link href="/admin/feature-requests" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Feature Requests</div>
            <div className="text-xs text-navy-500">View and manage contractor feedback</div>
          </div>
        </Link>
      </div>

      {/* Invite codes */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider">Invite Codes</h2>
          <button onClick={copyUnusedCodes} className="text-xs text-brand-400 hover:text-brand-300">Copy all unused</button>
        </div>

        <div className="flex gap-2 mb-4">
          <select value={codeCount} onChange={e => setCodeCount(Number(e.target.value))} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm">
            <option value={5} className="bg-navy-900">5 codes</option>
            <option value={10} className="bg-navy-900">10 codes</option>
            <option value={25} className="bg-navy-900">25 codes</option>
            <option value={50} className="bg-navy-900">50 codes</option>
          </select>
          <Button onClick={handleGenerateCodes} disabled={generating} size="sm">
            {generating ? 'Generating...' : 'Generate Codes'}
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
          {(stats?.codes || []).map(code => (
            <div key={code.id} className={`px-3 py-2 rounded-lg text-xs font-mono text-center ${code.used ? 'bg-white/[0.02] text-navy-600 line-through' : 'bg-brand-500/5 text-brand-400 border border-brand-500/10 cursor-pointer hover:bg-brand-500/10'}`}
              onClick={() => { if (!code.used) { navigator.clipboard.writeText(code.code); toast('Code copied', 'success'); } }}
            >
              {code.code}
            </div>
          ))}
        </div>
      </div>

      {/* Contractors */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-4">Contractors ({stats?.contractors})</h2>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {(stats?.contractorList || []).map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div>
                <span className="text-sm font-medium text-white">{c.first_name || 'Unknown'} {c.last_name}</span>
                {c.business_name && <span className="text-xs text-navy-500 ml-2">{c.business_name}</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-navy-500">
                {c.trade_type && <span className="hidden sm:inline">{c.trade_type}</span>}
                {c.primary_state && <span>{c.primary_state}</span>}
                <span>{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reviews */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-4">Recent Reviews</h2>
        <div className="space-y-2">
          {(stats?.recentReviews || []).map(r => (
            <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div>
                <span className="text-sm font-medium text-white">{r.clients.first_name} {r.clients.last_initial}.</span>
                <span className="text-xs text-navy-500 ml-2">{r.job_type}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-brand-400">{r.weighted_score.toFixed(1)}</span>
                <span className="text-xs text-navy-500">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
