'use client';

import { useState } from 'react';
import Link from 'next/link';
import ClientCard from '@/components/ClientCard';
import type { Client } from '@/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [results, setResults] = useState<Client[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() && !zipCode.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (zipCode.trim()) params.set('zip', zipCode.trim());
      const res = await fetch(`/api/clients/search?${params}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.clients || []);
      }
    } catch {} finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Search Clients</h1>
          <p className="text-gray-500 text-sm">Check a client before you take the job</p>
        </div>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="rounded-2xl border border-amber-500/20 bg-[#12121a] p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white mb-1.5 block">Client Name</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter client name..."
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white mb-1.5 block">ZIP Code</label>
            <div className="relative">
              <svg className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              <input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="12345"
                maxLength={5}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-all disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          {loading ? 'Searching...' : 'Search Clients'}
        </button>
      </form>

      {/* Results or empty state */}
      {searched ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-600">{results.length} {results.length === 1 ? 'result' : 'results'}</span>
            <Link href="/review/new" className="text-xs text-amber-500 hover:text-amber-400">+ Submit Review</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)}</div>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-amber-500/20 bg-[#12121a] p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-amber-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">No reviews yet for this client</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Be the first to share your experience — it helps every contractor in the network</p>
              <Link href="/review/new" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Submit a Review
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">{results.map(client => <ClientCard key={client.id} client={client} />)}</div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/20 bg-[#12121a] p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-amber-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Look up a client before you bid</h3>
          <p className="text-gray-500 text-sm">Search by name or ZIP to see what other contractors think</p>
        </div>
      )}
    </div>
  );
}
