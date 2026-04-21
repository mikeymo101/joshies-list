'use client';

import { useState } from 'react';

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'search', label: 'Search & Lookup' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'scoring', label: 'Scoring System' },
  { value: 'mobile', label: 'Mobile Experience' },
  { value: 'other', label: 'Other' },
];

export default function FeatureRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function reset() {
    setTitle('');
    setDescription('');
    setCategory('general');
    setSubmitted(false);
    setError('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/feature-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0f1419] border border-brand-500/15 rounded-2xl shadow-2xl shadow-black/50 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Request a Feature</h2>
              <p className="text-xs text-gray-500">Help us build what you need</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {submitted ? (
          <div className="px-6 pb-6 text-center py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Thanks for the feedback!</h3>
            <p className="text-sm text-gray-500 mb-6">We review every request and prioritize based on demand.</p>
            <button onClick={handleClose} className="px-6 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-all">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      category === c.value
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                        : 'bg-white/5 text-gray-500 border border-white/5 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Feature title <span className="text-gray-600">({100 - title.length} chars left)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={100}
                required
                placeholder="e.g. Add photos to reviews"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500/30 focus:ring-1 focus:ring-brand-500/20 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Describe what you need <span className="text-gray-600">({1000 - description.length} chars left)</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={1000}
                required
                rows={4}
                placeholder="What problem does this solve? How would it help your workflow?"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-500/30 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !title.trim() || !description.trim()}
              className="w-full px-5 py-3 rounded-xl bg-brand-500 text-black text-sm font-semibold hover:bg-brand-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
