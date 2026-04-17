import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-amber-500/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-bold text-white tracking-tight">
            <img src="/logo.svg" alt="Joshies List" className="h-7 inline-block" />
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="px-5 py-2.5 text-sm font-semibold bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05]">
            <img src="/logo.svg" alt="Joshies List" className="h-7 inline-block" />
          </h1>

          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full mt-6">
            <span className="text-base">🔥</span>
            <span className="text-sm text-gray-300">Built by contractors, for contractors</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mt-10 leading-[1.1]">
            Know Which Jobs
            <br />To <span className="text-amber-500">Walk Away From.</span>
          </h2>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            <span className="text-amber-500 font-semibold">Bad clients cost contractors billions every year.</span> Rate homeowners,
            check reviews, and protect your bottom line before you bid.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 text-base font-semibold bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-all inline-flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link
              href="/search"
              className="px-8 py-3.5 text-base font-medium text-white bg-white/5 border border-white/15 rounded-lg hover:bg-white/10 transition-all"
            >
              Search Clients
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-8 mt-10 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              100% Free forever
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Anonymous reviews
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Contractor-first platform
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Simple. Fast. <span className="text-amber-500">Powerful.</span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Join the growing community of contractors taking control of their business relationships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                step: 1,
                title: 'Complete the Job',
                desc: 'Finish your work for a homeowner or business client',
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              },
              {
                step: 2,
                title: 'Submit a Review',
                desc: 'Rate your client on 5 key categories in under 2 minutes',
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
              },
              {
                step: 3,
                title: 'Help Other Contractors',
                desc: 'Your insights help fellow pros avoid problem clients',
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-amber-500/20 bg-[#12121a] p-8 text-center">
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 text-xs font-bold">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock score card */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              See What You&apos;re <span className="text-amber-500">Getting</span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Every client gets a grade, score breakdown, and contractor consensus
            </p>
          </div>

          <div className="max-w-md mx-auto relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-[60px] pointer-events-none" />

            <div className="relative rounded-2xl border border-amber-500/20 bg-[#12121a] p-6 lg:p-8">
              {/* Sample badge */}
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                Sample
              </div>

              {/* Client header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">Sarah M.</h3>
                  <p className="text-sm text-gray-500">Austin, TX 78701</p>
                </div>
                <div className="w-16 h-16 flex items-center justify-center rounded-xl border-2 bg-blue-500/10 border-blue-500/50 text-blue-400 font-bold text-2xl backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  B
                </div>
              </div>

              {/* Overall score */}
              <div className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-3xl font-bold text-amber-500">3.8</div>
                <div className="flex-1">
                  <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-600">out of 5.0</span>
                    <span className="text-xs text-gray-600">6 reviews</span>
                  </div>
                </div>
              </div>

              {/* Would work again */}
              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-2xl font-bold text-emerald-400">83%</span>
                <span className="text-sm text-gray-500">of contractors would work with this client again</span>
              </div>

              {/* Category breakdown */}
              <div className="space-y-3">
                {[
                  { label: 'Pays on Time', score: 4.2, pct: 84, color: 'bg-blue-500' },
                  { label: 'No Surprises After', score: 3.5, pct: 70, color: 'bg-amber-500' },
                  { label: 'Sticks to the Plan', score: 3.8, pct: 76, color: 'bg-blue-500' },
                  { label: 'Easy to Work With', score: 4.0, pct: 80, color: 'bg-blue-500' },
                  { label: 'Site Ready & On Time', score: 3.6, pct: 72, color: 'bg-amber-500' },
                ].map(cat => (
                  <div key={cat.label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-[140px] shrink-0">{cat.label}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div className={`${cat.color} h-1.5 rounded-full`} style={{ width: `${cat.pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-white w-8 text-right">{cat.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA below card */}
            <div className="text-center mt-8">
              <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">
                Start rating your clients
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rating categories */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-amber-500/20 bg-[#12121a] p-10 md:p-14">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Rate Clients on What <span className="text-amber-500">Actually</span> Matters</h2>
              <p className="mt-3 text-gray-500 text-lg">
                Five categories that make or break a job — rated by contractors, for contractors
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Pays on Time', desc: 'Paid what was agreed, when it was agreed', weight: '30%', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                { name: 'No Surprises After', desc: 'No callbacks, complaints, or bad reviews after the job', weight: '20%', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
                { name: 'Sticks to the Plan', desc: "Didn't expand scope or change their mind mid-job", weight: '20%', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
                { name: 'Easy to Work With', desc: 'Respectful, reasonable, and communicates well', weight: '15%', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg> },
                { name: 'Site Ready & On Time', desc: 'Job site was accessible and schedule was respected', weight: '15%', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              ].map((cat) => (
                <div key={cat.name} className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                      {cat.icon}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white">{cat.name}</span>
                      <span className="text-xs text-amber-500/60 ml-2">{cat.weight}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>, title: '100% Anonymous', desc: 'Your reviews are never tied to your name. Clients only see scores, not who submitted them.', color: 'text-amber-500' },
            { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Takes 2 Minutes', desc: 'Rate a client across 5 categories. No essays, no uploads. Just honest scores from real jobs.', color: 'text-cyan-400' },
            { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'Contractor Network', desc: 'Every review strengthens the network. The more contractors participate, the better the data gets.', color: 'text-emerald-400' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-amber-500/20 bg-[#12121a] p-8">
              <div className={`w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center ${item.color} mb-5`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-amber-500/20 bg-[#12121a] p-12 md:p-16 text-center relative overflow-hidden">
            {/* Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stop Losing Money on Bad Jobs.</h2>
              <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
                One contractor lost $250K last year to problem clients. Know which jobs to walk away from before you sign.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
              >
                Start Rating Clients
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-gray-700 text-center mb-4">
            All content on Joshies List represents user-submitted opinions and has not been independently verified. Scores and grades are algorithmic calculations of subjective ratings.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Joshies List. All rights reserved.
            </span>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/legal/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
              <Link href="/legal/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
              <Link href="/legal/guidelines" className="hover:text-gray-400 transition-colors">Guidelines</Link>
              <Link href="/legal/dispute" className="hover:text-gray-400 transition-colors">Dispute</Link>
              <Link href="/login" className="hover:text-gray-400 transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
