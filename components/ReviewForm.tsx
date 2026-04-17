'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';
import Input from './ui/Input';

interface ReviewFormProps {
  clientId: string;
  clientName?: string;
}

const SCORE_LABELS = ['Terrible', 'Poor', 'Fair', 'Good', 'Excellent'];

function StarRating({
  label,
  value,
  onChange,
  weight,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  weight: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-xs text-navy-400">{weight} weight</span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
              star <= value
                ? 'bg-brand-500 text-navy-950'
                : 'bg-white/5 text-navy-500 hover:bg-white/10 hover:text-navy-300'
            }`}
          >
            {star}
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-navy-300">{SCORE_LABELS[value - 1]}</span>
        )}
      </div>
    </div>
  );
}

export default function ReviewForm({ clientId, clientName }: ReviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [scores, setScores] = useState({
    payment: 0,
    post_job: 0,
    scope: 0,
    professionalism: 0,
    access: 0,
  });

  const [jobType, setJobType] = useState('');
  const [jobValue, setJobValue] = useState('');
  const [jobDate, setJobDate] = useState('');
  const [tosAcknowledged, setTosAcknowledged] = useState(false);

  const allScoresSet = Object.values(scores).every((s) => s > 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allScoresSet || !tosAcknowledged) return;

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          score_payment: scores.payment,
          score_post_job: scores.post_job,
          score_scope: scores.scope,
          score_professionalism: scores.professionalism,
          score_access: scores.access,
          job_type: jobType,
          job_value_range: jobValue,
          job_date_approx: jobDate,
          tos_acknowledged: tosAcknowledged,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit review');
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push(`/clients/${clientId}`), 1500);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Review Submitted</h3>
        <p className="text-navy-300 mt-2">Redirecting to client profile...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-1">
          Rate {clientName || 'this client'}
        </h3>
        <p className="text-sm text-navy-400 mb-6">
          Score each category from 1 (terrible) to 5 (excellent)
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <StarRating label="Pays on Time" value={scores.payment} onChange={(v) => setScores({ ...scores, payment: v })} weight="30%" />
          <StarRating label="No Surprises After" value={scores.post_job} onChange={(v) => setScores({ ...scores, post_job: v })} weight="20%" />
          <StarRating label="Sticks to the Plan" value={scores.scope} onChange={(v) => setScores({ ...scores, scope: v })} weight="20%" />
          <StarRating label="Easy to Work With" value={scores.professionalism} onChange={(v) => setScores({ ...scores, professionalism: v })} weight="15%" />
          <StarRating label="Site Ready & On Time" value={scores.access} onChange={(v) => setScores({ ...scores, access: v })} weight="15%" />
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-4">
          Job Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Job Type" value={jobType} onChange={(e) => setJobType(e.target.value)} placeholder="e.g., Kitchen remodel" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-navy-300">Job Value</label>
            <select
              value={jobValue}
              onChange={(e) => setJobValue(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
            >
              <option value="" className="bg-navy-900">Select range</option>
              <option value="under-5k" className="bg-navy-900">Under $5,000</option>
              <option value="5k-15k" className="bg-navy-900">$5,000 - $15,000</option>
              <option value="15k-50k" className="bg-navy-900">$15,000 - $50,000</option>
              <option value="50k-100k" className="bg-navy-900">$50,000 - $100,000</option>
              <option value="over-100k" className="bg-navy-900">Over $100,000</option>
            </select>
          </div>
          <Input label="Approx Job Date" type="month" value={jobDate} onChange={(e) => setJobDate(e.target.value)} />
        </div>
      </div>

      <div className="glass-card p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={tosAcknowledged}
            onChange={(e) => setTosAcknowledged(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-white/20 bg-white/5 text-brand-500 focus:ring-brand-500/50"
          />
          <span className="text-sm text-navy-300">
            I confirm this review is based on a real job experience and that the information provided is truthful and accurate.
          </span>
        </label>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading || !allScoresSet || !tosAcknowledged}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
