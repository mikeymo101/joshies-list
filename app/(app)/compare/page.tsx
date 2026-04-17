'use client';

import { useState } from 'react';
import ScoreBar from '@/components/ui/ScoreBar';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeftRight, X, Search, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import type { Client } from '@/types';

interface CompareClient extends Client {
  scoreBreakdown?: {
    payment: number; post_job: number; scope: number; professionalism: number; access: number;
  };
}

function getGradeConfig(grade: string | null) {
  switch (grade) {
    case 'A': return 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
    case 'B': return 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]';
    case 'C': return 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
    case 'D': return 'bg-orange-500/10 border-orange-500/50 text-orange-400';
    case 'F': return 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
    default: return 'bg-white/5 border-white/20 text-white/40';
  }
}

export default function ComparePage() {
  const { toast } = useToast();
  const [clients, setClients] = useState<CompareClient[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/clients/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      setSearchResults((data.clients || []).filter((c: Client) => !clients.find(cc => cc.id === c.id)));
    } catch {} finally { setSearching(false); }
  }

  async function addClient(client: Client) {
    if (clients.length >= 3) return;
    // Fetch full details
    try {
      const res = await fetch(`/api/clients/${client.id}`);
      const data = await res.json();
      setClients(prev => [...prev, { ...data.client, scoreBreakdown: data.scoreBreakdown }]);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch {
      toast('Failed to load client', 'error');
    }
  }

  function removeClient(id: string) {
    setClients(prev => prev.filter(c => c.id !== id));
  }

  const categories = [
    { key: 'payment', label: 'Pays on Time' },
    { key: 'post_job', label: 'No Surprises After' },
    { key: 'scope', label: 'Sticks to the Plan' },
    { key: 'professionalism', label: 'Easy to Work With' },
    { key: 'access', label: 'Site Ready & On Time' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
          <ArrowLeftRight className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Compare Clients</h1>
          <p className="text-white/50">Side-by-side comparison of client ratings</p>
        </div>
      </div>

      {/* Add button */}
      {clients.length < 3 && (
        <div className="glass-card p-6">
          <button onClick={() => setShowSearch(!showSearch)} className="w-full py-4 rounded-xl border-2 border-dashed border-[rgba(251,146,60,0.3)] hover:border-amber-500/50 text-white/50 hover:text-amber-400 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add Client to Compare (Max 3)
          </button>

          {showSearch && (
            <div className="mt-4 space-y-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search for a client..." className="w-full pl-11 pr-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 transition-all" autoFocus />
                </div>
                <button type="submit" disabled={searching} className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all">
                  {searching ? '...' : 'Search'}
                </button>
              </form>
              {searchResults.map(c => (
                <button key={c.id} onClick={() => addClient(c)} className="w-full flex items-center gap-4 p-4 bg-orange-500/5 hover:bg-orange-500/10 rounded-xl border border-transparent hover:border-orange-500/20 transition-all text-left">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 font-bold text-sm ${getGradeConfig(c.grade)}`}>{c.grade ?? '--'}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{c.first_name} {c.last_initial}.</div>
                    <div className="text-sm text-white/40">{c.city}, {c.state}</div>
                  </div>
                  <span className="text-sm text-white/40">{c.review_count} reviews</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comparison cards */}
      {clients.length > 0 && (
        <div className={`grid gap-6 ${clients.length === 1 ? 'grid-cols-1 max-w-md' : clients.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
          {clients.map(client => {
            const wouldWorkAgain = (client as unknown as Record<string, unknown>).would_work_again_pct as number | null;
            return (
              <div key={client.id} className="glass-card relative">
                <button onClick={() => removeClient(client.id)} className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all z-10">
                  <X className="w-4 h-4 text-red-400" />
                </button>

                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="text-center pb-6 border-b border-[rgba(251,146,60,0.15)]">
                    <div className={`w-28 h-28 mx-auto mb-4 flex items-center justify-center rounded-xl border-2 font-bold text-5xl backdrop-blur-sm ${getGradeConfig(client.grade)}`}>
                      {client.grade ?? '--'}
                    </div>
                    <h3 className="font-bold text-xl text-white">{client.first_name} {client.last_initial}.</h3>
                    <p className="text-sm text-white/50 mt-1">{client.city}, {client.state}</p>
                    {client.score !== null && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg mt-3">
                        <span className="text-2xl font-bold text-white">{client.score.toFixed(1)}</span>
                        <span className="text-sm text-white/40">/5.0</span>
                      </div>
                    )}
                    <p className="text-xs text-white/40 mt-2">{client.review_count} reviews</p>
                  </div>

                  {/* Scores */}
                  {client.scoreBreakdown && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-white/50 uppercase tracking-wide">Category Scores</h4>
                      {categories.map(cat => (
                        <ScoreBar key={cat.key} label={cat.label} score={client.scoreBreakdown![cat.key as keyof typeof client.scoreBreakdown]} />
                      ))}
                    </div>
                  )}

                  {/* Would work again */}
                  {wouldWorkAgain !== null && (
                    <div className="pt-4 border-t border-[rgba(251,146,60,0.15)] flex items-center justify-between">
                      <span className="text-sm text-white/50">Would Work Again</span>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-semibold ${wouldWorkAgain >= 70 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {wouldWorkAgain >= 70 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {wouldWorkAgain}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {clients.length === 0 && !showSearch && (
        <div className="glass-card p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ArrowLeftRight className="w-10 h-10 text-amber-400/50" />
          </div>
          <h3 className="text-xl font-semibold text-white/60 mb-2">Compare clients side-by-side</h3>
          <p className="text-white/40 mb-6 max-w-sm mx-auto">Pick 2-3 clients to see how they stack up across every category. Great for choosing between jobs.</p>
          <button onClick={() => setShowSearch(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 transition-all">
            <Plus className="w-5 h-5" /> Add Clients
          </button>
        </div>
      )}
    </div>
  );
}
