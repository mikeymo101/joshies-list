'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import FeatureRequestModal from '@/components/FeatureRequestModal';

const navItems = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  },
  {
    label: 'Search',
    href: '/search',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  },
  {
    label: 'Submit Review',
    href: '/review/new',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>,
  },
  {
    label: 'Area Scores',
    href: '/areas',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    label: 'Watchlist',
    href: '/watchlist',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
  },
  {
    label: 'Compare',
    href: '/compare',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  },
  {
    label: 'My Reviews',
    href: '/clients',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
  {
    label: 'Account',
    href: '/account',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    label: 'Admin',
    href: '/admin',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [newRequestCount, setNewRequestCount] = useState(0);

  useEffect(() => {
    fetch('/api/account/profile')
      .then(r => r.json())
      .then(d => {
        if (d.profile?.is_admin) {
          setIsAdmin(true);
          // Fetch new feature request count for admin badge
          fetch('/api/feature-requests/count')
            .then(r => r.json())
            .then(c => { if (c.count > 0) setNewRequestCount(c.count); })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        router.push('/search');
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  // Filter out duplicate Home/Dashboard (show Dashboard only for desktop)
  const sidebarItems = navItems.filter(item => item.label !== 'Home' && (item.label !== 'Admin' || isAdmin));

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0a0a0f]">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-amber-500/10 h-14 flex items-center justify-between px-4">
        <Link href="/dashboard" className="text-lg font-bold text-white tracking-tight">
          <img src="/logo.svg" alt="Joshies List" className="h-7" />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-xl pt-14">
          <nav className="px-4 py-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
              return (
                <Link key={item.href + item.label} href={item.href} onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive ? 'text-amber-500 bg-amber-500/5' : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}>
                  {item.icon}
                  {item.label}
                  {item.label === 'Admin' && newRequestCount > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none min-w-[18px] text-center">{newRequestCount}</span>
                  )}
                </Link>
              );
            })}
            <button onClick={() => { setMobileMenuOpen(false); setFeatureModalOpen(true); }}
              className="relative flex items-center gap-3 px-4 py-4 rounded-xl text-base font-semibold text-amber-400 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 hover:border-amber-500/40 transition-all w-full mt-4 shadow-lg shadow-amber-500/5">
              <div className="absolute top-0 right-0 w-2 h-2 m-3 rounded-full bg-amber-400 animate-pulse" />
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/25 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <div className="text-left">
                <div>Request a Feature</div>
                <div className="text-xs font-normal text-gray-500">Tell us what you need</div>
              </div>
            </button>
            <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all w-full mt-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[272px] border-r border-amber-500/10 bg-[#0a0a0f] flex-col shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 pt-7 pb-5">
          <Link href="/dashboard" className="text-2xl font-bold text-white tracking-tight">
            <img src="/logo.svg" alt="Joshies List" className="h-7" />
          </Link>
          <p className="text-xs text-gray-600 mt-0.5">Know which jobs to walk away from</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
            return (
              <Link key={item.href + item.label} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  isActive
                    ? 'text-amber-500 bg-amber-500/5'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-amber-500 rounded-r-full" />}
                {item.icon}
                {item.label}
                {item.label === 'Admin' && newRequestCount > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none min-w-[18px] text-center">{newRequestCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 space-y-2">
          {/* Feature request */}
          <button
            onClick={() => setFeatureModalOpen(true)}
            className="w-full relative overflow-hidden flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 hover:border-amber-500/40 hover:from-amber-500/15 hover:to-orange-500/15 transition-all text-left group shadow-lg shadow-amber-500/5 hover:shadow-amber-500/10"
          >
            <div className="absolute top-0 right-0 w-2 h-2 m-2 rounded-full bg-amber-400 animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/25 flex items-center justify-center shrink-0 group-hover:bg-amber-500/30 transition-colors">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors">Request a Feature</p>
              <p className="text-[11px] text-gray-500">Tell us what you need</p>
            </div>
          </button>

          {/* Legal links */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 px-3 text-[10px] text-gray-700">
            <Link href="/legal/terms" className="hover:text-gray-500">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-gray-500">Privacy</Link>
            <Link href="/legal/guidelines" className="hover:text-gray-500">Guidelines</Link>
            <Link href="/legal/dispute" className="hover:text-gray-500">Dispute</Link>
          </div>

          {/* Quick check button */}
          <Link href="/search"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Quick Check
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>

        {/* Floating add button (mobile) */}
        <Link href="/review/new"
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 z-30 hover:bg-amber-400 transition-all">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </Link>
      </main>

      <FeatureRequestModal open={featureModalOpen} onClose={() => setFeatureModalOpen(false)} />
    </div>
  );
}
