'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ContractorRow {
  id: string;
  first_name: string;
  last_name: string;
  business_name: string;
  trade_type: string;
  phone: string;
  primary_state: string;
  years_in_business: string;
  verification_status: string;
  review_count: number;
  created_at: string;
}

const VERIFICATION_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/25',
};

export default function AdminContractorsPage() {
  const [contractors, setContractors] = useState<ContractorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all');

  useEffect(() => {
    fetch('/api/admin/contractors')
      .then(r => {
        if (r.status === 403) { setForbidden(true); return null; }
        return r.json();
      })
      .then(d => { if (d) setContractors(d.contractors || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const trades = Array.from(new Set(contractors.map(c => c.trade_type).filter(Boolean))).sort();

  const filtered = contractors.filter(c => {
    const matchesSearch = !search ||
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      c.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.primary_state?.toLowerCase().includes(search.toLowerCase());
    const matchesTrade = tradeFilter === 'all' || c.trade_type === tradeFilter;
    return matchesSearch && matchesTrade;
  });

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
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Contractors</h1>
          <p className="text-gray-400 mt-1">{contractors.length} registered</p>
        </div>
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-300">Back to Admin</Link>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, business, or state..."
            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/30 transition-all"
          />
        </div>
        <select
          value={tradeFilter}
          onChange={e => setTradeFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500/30 transition-all"
        >
          <option value="all" className="bg-[#0f1419]">All Trades</option>
          {trades.map(t => <option key={t} value={t} className="bg-[#0f1419]">{t}</option>)}
        </select>
      </div>

      <p className="text-xs text-gray-600">{filtered.length} {filtered.length === 1 ? 'contractor' : 'contractors'} shown</p>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-500">{contractors.length === 0 ? 'No contractors registered yet.' : 'No contractors match your search.'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => (
            <div key={c.id} className="glass-card p-4 lg:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{c.first_name || 'Unknown'} {c.last_name}</h3>
                    {c.business_name && <span className="text-xs text-gray-500">{c.business_name}</span>}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${VERIFICATION_COLORS[c.verification_status] || VERIFICATION_COLORS.pending}`}>
                      {c.verification_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600 flex-wrap">
                    {c.trade_type && <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">{c.trade_type}</span>}
                    {c.primary_state && <span>{c.primary_state}</span>}
                    {c.years_in_business && <span>{c.years_in_business} yrs</span>}
                    {c.phone && <span className="hidden sm:inline">{c.phone}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-amber-400">{c.review_count}</div>
                  <div className="text-[10px] text-gray-600">reviews</div>
                  <div className="text-[10px] text-gray-600 mt-1">{new Date(c.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
