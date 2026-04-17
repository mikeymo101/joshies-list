'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DisputeForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, type, description }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      setError('Something went wrong submitting your request. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      <nav className="h-16 flex items-center px-6 border-b border-amber-500/10">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          <img src="/logo.svg" alt="Joshies List" className="h-6" />
        </Link>
      </nav>
      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Dispute & Removal Request</h1>
        <p className="text-white/50 text-sm mb-8">We review all requests within 48 hours.</p>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Request Received</h2>
            <p className="text-white/50 text-sm">We will review your request within 48 hours and respond to the email address provided.</p>
            <Link href="/" className="text-amber-400 text-sm mt-4 inline-block">Return to home</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4">
                {error}
              </div>
            )}
            <div className="rounded-2xl border border-amber-500/20 bg-[#12121a] p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Your Name <span className="text-amber-400">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} required placeholder="Full name" className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Email <span className="text-amber-400">*</span></label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com" className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Request Type <span className="text-amber-400">*</span></label>
                <select value={type} onChange={e => setType(e.target.value)} required className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all">
                  <option value="" className="bg-[#0f1419]">Select type</option>
                  <option value="removal" className="bg-[#0f1419]">Content Removal Request</option>
                  <option value="inaccurate" className="bg-[#0f1419]">Inaccurate Information</option>
                  <option value="privacy" className="bg-[#0f1419]">Privacy Concern</option>
                  <option value="harassment" className="bg-[#0f1419]">Harassment / Threats</option>
                  <option value="copyright" className="bg-[#0f1419]">Copyright / DMCA</option>
                  <option value="other" className="bg-[#0f1419]">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description <span className="text-amber-400">*</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={5} placeholder="Please describe your concern in detail. Include any relevant names, dates, or URLs if applicable." className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none" />
              </div>
            </div>

            <p className="text-xs text-white/30">
              All content on Joshies List represents user-submitted opinions and has not been independently verified. We take all removal requests seriously and respond within 48 hours.
            </p>

            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
