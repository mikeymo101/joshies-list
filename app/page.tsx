import Link from 'next/link';
import ScoreCard from '@/components/ui/ScoreCard';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-canvas">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-surface-canvas/80 backdrop-blur-xl border-b border-brand-500/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Joshie's List home" className="inline-flex items-center">
            <img src="/logo.svg" alt="Joshie's List" className="h-7" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/search" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
              Search
            </Link>
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="px-5 py-2.5 text-sm font-semibold bg-brand-500 text-black rounded-lg hover:bg-brand-400 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          {/* Eyebrow (replaces the chip that used to sit awkwardly above a logo-h1) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="text-xs font-medium text-white/65 tracking-wide">Built by contractors, for contractors</span>
          </div>

          {/* Real H1 — no more logo-as-headline */}
          <h1 className="mt-5 text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.03] text-balance">
            Know which jobs to{' '}
            <span className="text-brand-500">walk away from.</span>
          </h1>

          <p className="mt-6 text-lg text-white/55 max-w-xl mx-auto leading-relaxed text-pretty">
            Check a homeowner&apos;s track record before you bid. Anonymous reviews from contractors who&apos;ve already done the job.
          </p>

          {/* ============ SEARCH-FIRST HERO ACTION ============ */}
          <form
            action="/search"
            method="get"
            className="mt-10 mx-auto max-w-xl text-left"
            role="search"
            aria-label="Look up a client"
          >
            <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg shadow-black/40 focus-within:border-brand-500/40 focus-within:bg-white/[0.06] transition-colors">
              <label className="flex-1 min-w-0">
                <span className="sr-only">Client name</span>
                <input
                  type="text"
                  name="q"
                  placeholder="Client name (e.g. Sarah M.)"
                  className="w-full px-4 py-3 bg-transparent text-white placeholder:text-white/35 focus:outline-none text-[15px]"
                  autoComplete="off"
                />
              </label>
              <div className="hidden sm:block w-px bg-white/10 my-2" />
              <label className="sm:w-36">
                <span className="sr-only">ZIP code</span>
                <input
                  type="text"
                  name="zip"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  placeholder="ZIP"
                  className="w-full px-4 py-3 bg-transparent text-white placeholder:text-white/35 focus:outline-none text-[15px]"
                />
              </label>
              <button
                type="submit"
                className="px-5 py-3 text-[15px] font-semibold bg-brand-500 text-black rounded-xl hover:bg-brand-400 transition-colors inline-flex items-center justify-center gap-2 shrink-0"
              >
                Check client
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-white/40">
              No account needed to search. <Link href="/signup" className="text-white/65 hover:text-white underline underline-offset-2">Create an account</Link> to leave a review.
            </p>
          </form>

          {/* Trust strip — tightened */}
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 mt-10 text-xs text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Anonymous reviews
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Contractor-first
            </span>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Simple. Fast. <span className="text-brand-500">Powerful.</span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-xl mx-auto">
              Join the growing community of contractors taking control of their business relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { step: 1, title: 'Complete the Job', desc: 'Finish your work for a homeowner or business client.', icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { step: 2, title: 'Submit a Review', desc: 'Rate your client across 5 categories in under 2 minutes.', icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
              { step: 3, title: 'Help Other Contractors', desc: 'Your insights help fellow pros avoid problem clients.', icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-brand-500/20 bg-surface-raised p-8 text-center">
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-500 text-xs font-bold">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 mx-auto mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SAMPLE SCORE CARD ============ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              See what you&apos;re <span className="text-brand-500">getting.</span>
            </h2>
            <p className="mt-4 text-white/50 text-lg max-w-xl mx-auto">
              Every client gets a grade, a score breakdown, and contractor consensus.
            </p>
          </div>

          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-0 bg-brand-500/5 rounded-3xl blur-[60px] pointer-events-none" />
            <div className="relative">
              <ScoreCard
                sample
                name="Sarah M."
                location="Austin, TX 78701"
                grade="B"
                score={3.8}
                reviewCount={6}
                wouldWorkAgainPct={83}
                rubric={{
                  payment: 4.2,
                  postJob: 3.5,
                  scope: 3.8,
                  professionalism: 4.0,
                  access: 3.6,
                }}
              />
            </div>

            <div className="text-center mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold bg-brand-500 text-black rounded-lg hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/20"
              >
                Start rating your clients
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RATING CATEGORIES ============ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-brand-500/20 bg-surface-raised p-10 md:p-14">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Rate clients on what <span className="text-brand-500">actually</span> matters.
              </h2>
              <p className="mt-3 text-white/50 text-lg">
                Five categories that make or break a job — rated by contractors, for contractors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Pays on Time',        desc: 'Paid what was agreed, when it was agreed.',              weight: '30%' },
                { name: 'No Surprises After',  desc: 'No callbacks, complaints, or bad reviews after the job.', weight: '20%' },
                { name: 'Sticks to the Plan',  desc: "Didn't expand scope or change their mind mid-job.",       weight: '20%' },
                { name: 'Easy to Work With',   desc: 'Respectful, reasonable, and communicates well.',          weight: '15%' },
                { name: 'Site Ready & On Time',desc: 'Job site was accessible and schedule was respected.',     weight: '15%' },
              ].map((cat) => (
                <div key={cat.name} className="p-5 rounded-xl bg-brand-500/5 border border-brand-500/15">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{cat.name}</span>
                    <span className="text-xs text-brand-500/70 tabular-nums">{cat.weight}</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY IT WORKS ============ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            { title: '100% Anonymous',    desc: 'Your reviews are never tied to your name. Clients only see scores, not who submitted them.' },
            { title: 'Takes 2 Minutes',   desc: 'Rate a client across 5 categories. No essays, no uploads. Just honest scores from real jobs.' },
            { title: 'Contractor Network', desc: 'Every review strengthens the network. The more contractors participate, the better the data gets.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-brand-500/20 bg-surface-raised p-8">
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-brand-500/20 bg-surface-raised p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-500/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stop losing money on bad jobs.</h2>
              <p className="text-white/55 text-lg mb-8 max-w-lg mx-auto">
                Know which jobs to walk away from before you sign.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold bg-brand-500 text-black rounded-lg hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/20"
              >
                Start rating clients
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-white/35 text-center mb-4">
            All content on Joshie&apos;s List represents user-submitted opinions and has not been independently verified. Scores and grades are algorithmic calculations of subjective ratings.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-white/40">
              &copy; {new Date().getFullYear()} Joshie&apos;s List. All rights reserved.
            </span>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href="/legal/terms"      className="hover:text-white/65 transition-colors">Terms</Link>
              <Link href="/legal/privacy"    className="hover:text-white/65 transition-colors">Privacy</Link>
              <Link href="/legal/guidelines" className="hover:text-white/65 transition-colors">Guidelines</Link>
              <Link href="/legal/dispute"    className="hover:text-white/65 transition-colors">Dispute</Link>
              <Link href="/login"            className="hover:text-white/65 transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
