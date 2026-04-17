'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { Bookmark, X, ArrowRight, MapPin } from 'lucide-react';

interface WatchlistItem {
  id: string;
  first_name: string;
  last_initial: string;
  city: string;
  state: string;
  grade: string | null;
  addedAt: number;
}

function getWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('jl_watchlist') || '[]');
}

function removeFromWatchlist(id: string) {
  const list = getWatchlist().filter(i => i.id !== id);
  localStorage.setItem('jl_watchlist', JSON.stringify(list));
  return list;
}

function getGradeConfig(grade: string | null) {
  switch (grade) {
    case 'A': return 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400';
    case 'B': return 'bg-blue-500/10 border-blue-500/50 text-blue-400';
    case 'C': return 'bg-amber-500/10 border-amber-500/50 text-amber-400';
    case 'D': return 'bg-orange-500/10 border-orange-500/50 text-orange-400';
    case 'F': return 'bg-red-500/10 border-red-500/50 text-red-400';
    default: return 'bg-white/5 border-white/20 text-white/40';
  }
}

export default function WatchlistPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => { setItems(getWatchlist()); }, []);

  function handleRemove(id: string) {
    setItems(removeFromWatchlist(id));
    toast('Removed from watchlist', 'success');
  }

  function handleClear() {
    localStorage.setItem('jl_watchlist', '[]');
    setItems([]);
    toast('Watchlist cleared', 'success');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Watchlist</h1>
            <p className="text-white/50">Clients you&apos;re tracking - {items.length} total</p>
          </div>
        </div>
        {items.length > 0 && (
          <button onClick={handleClear} className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-all">Clear All</button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="glass-card p-5 flex items-center gap-4 glass-card-hover">
              <div className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 font-bold text-xl ${getGradeConfig(item.grade)}`}>
                {item.grade ?? '--'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-white">{item.first_name} {item.last_initial}.</h3>
                <div className="flex items-center gap-1.5 text-sm text-white/50">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.city}, {item.state}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/clients/${item.id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm">
                  View <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={() => handleRemove(item.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all">
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-10 h-10 text-amber-400/50" />
          </div>
          <h3 className="text-xl font-semibold text-white/60 mb-2">Your watchlist is empty</h3>
          <p className="text-white/40 mb-6 max-w-sm mx-auto">Save clients you&apos;re bidding on or keeping an eye on. Bookmark them from any client profile.</p>
          <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 transition-all">
            Search Clients
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="glass-card p-6 border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Bookmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Stay Updated</h4>
              <p className="text-sm text-white/50">Track clients you&apos;re interested in. Soon you&apos;ll receive alerts when new reviews are posted.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
