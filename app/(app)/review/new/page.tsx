'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StarRating from '@/components/StarRating';
import { useToast } from '@/components/ui/Toast';
import type { Client } from '@/types';
import { Star, ArrowRight, ArrowLeft, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

const categories = CATEGORIES;

export default function NewReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Step 1: Client info
  const [firstName, setFirstName] = useState('');
  const [lastInitial, setLastInitial] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Client matching
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Step 2: Ratings
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [wouldWorkAgain, setWouldWorkAgain] = useState<boolean | null>(null);
  const [jobType, setJobType] = useState('');
  const [jobValue, setJobValue] = useState('');
  const [jobDate, setJobDate] = useState('');
  const [tosAcknowledged, setTosAcknowledged] = useState(false);
  const [suspiciousWarned, setSuspiciousWarned] = useState(false);

  const allRated = categories.every(c => ratings[c.id] > 0);
  const canSubmit = allRated && wouldWorkAgain !== null && tosAcknowledged && jobType.trim() && jobValue;

  async function handleStep1() {
    if (!firstName.trim() || !lastInitial.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      setError('All fields are required');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const params = new URLSearchParams({ q: firstName.trim(), zip: zipCode.trim() });
      const res = await fetch(`/api/clients/search?${params}`);
      const data = await res.json();
      const inputName = firstName.trim().toLowerCase();
      const inputInitial = lastInitial.trim().toLowerCase();

      const matches = (data.clients || []).filter((c: Client) => {
        const cName = c.first_name.toLowerCase();
        const sameInitial = c.last_initial.toLowerCase() === inputInitial;
        const startsWithSame = inputName.length >= 3 && cName.startsWith(inputName.slice(0, 3));
        const nameContains = cName.includes(inputName) || inputName.includes(cName);
        return sameInitial && (cName === inputName || startsWithSame || nameContains);
      });

      if (matches.length > 0) {
        setSearchResults(matches);
        setShowResults(true);
      } else {
        await createClientAndContinue();
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function createClientAndContinue() {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: firstName.trim(), last_initial: lastInitial.trim(), city: city.trim(), state: state.trim(), zip_code: zipCode.trim() }),
    });
    const data = await res.json();
    if (!res.ok && res.status !== 201) {
      setError(data.error || 'Failed to add client');
      return;
    }
    setSelectedClient(data.client);
    setShowResults(false);
    setStep(2);
  }

  function selectExisting(client: Client) {
    setSelectedClient(client);
    setShowResults(false);
    setStep(2);
  }

  async function handleSubmit() {
    if (!selectedClient || !canSubmit) return;

    // Suspicious score check
    const vals = Object.values(ratings);
    if (vals.every(v => v === vals[0]) && !suspiciousWarned) {
      setSuspiciousWarned(true);
      toast('All scores are identical — please confirm this is accurate', 'info');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient.id,
          score_payment: ratings.payment,
          score_post_job: ratings.post_job,
          score_scope: ratings.scope,
          score_professionalism: ratings.professionalism,
          score_access: ratings.access,
          would_work_again: wouldWorkAgain,
          job_type: jobType || 'Not specified',
          job_value_range: jobValue || 'Not specified',
          job_date_approx: jobDate || 'Not specified',
          tos_acknowledged: tosAcknowledged,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to submit'); return; }

      setSuccess(true);
      toast('Review submitted!', 'success');
      setTimeout(() => router.push(`/clients/${selectedClient.id}`), 1500);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <div className="glass-card p-12">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Review Submitted</h2>
          <p className="text-white/50 mt-2">Thanks for helping the contractor community.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
          <Star className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Submit Review</h1>
          <p className="text-white/50">Help fellow contractors know their clients <span className="text-amber-400 font-medium">Takes 2 minutes</span></p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="text-xs font-medium text-white/50 mb-2">Step {step} of 2</div>
        <div className="flex gap-2">
          <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30' : 'bg-white/5'}`} />
          <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30' : 'bg-white/5'}`} />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">{error}</div>
      )}

      {/* STEP 1 */}
      {step === 1 && !showResults && (
        <div className="glass-card p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full" />
              Client Information
            </h2>
            <p className="text-white/50 mt-1">Enter the basic details about your client</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">First Name <span className="text-amber-400">*</span></label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Last Initial <span className="text-amber-400">*</span></label>
                <input value={lastInitial} onChange={e => setLastInitial(e.target.value.charAt(0).toUpperCase())} placeholder="D" maxLength={1} className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">City <span className="text-amber-400">*</span></label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="Austin" className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">State <span className="text-amber-400">*</span></label>
                <input value={state} onChange={e => setState(e.target.value.toUpperCase())} placeholder="TX" maxLength={2} className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">ZIP <span className="text-amber-400">*</span></label>
                <input value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="78701" maxLength={5} className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>
            </div>
            <button onClick={handleStep1} disabled={loading} className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 group">
              {loading ? 'Checking...' : 'Continue to Ratings'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Match results */}
      {step === 1 && showResults && (
        <div className="glass-card p-8 space-y-5">
          <h2 className="text-xl font-bold text-white">Is this the same person?</h2>
          <div className="space-y-2">
            {searchResults.map(c => (
              <button key={c.id} onClick={() => selectExisting(c)} className="w-full flex items-center justify-between p-4 rounded-xl bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/10 hover:border-orange-500/20 transition-all text-left">
                <div>
                  <span className="font-semibold text-white">{c.first_name} {c.last_initial}.</span>
                  <span className="text-white/50 ml-2 text-sm">{c.city}, {c.state}</span>
                </div>
                <span className="text-sm text-white/50">{c.review_count} reviews</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowResults(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all">Back</button>
            <button onClick={createClientAndContinue} disabled={loading} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all">Not the same — add new</button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && selectedClient && (
        <>
          {/* Selected client badge */}
          <div className="glass-card p-4 flex items-center justify-between">
            <span className="text-sm text-white">Reviewing: <strong>{selectedClient.first_name} {selectedClient.last_initial}.</strong> <span className="text-white/40">{selectedClient.city}, {selectedClient.state}</span></span>
            <button onClick={() => { setStep(1); setSelectedClient(null); }} className="text-xs text-white/40 hover:text-white/70">Change</button>
          </div>

          {/* Star ratings */}
          <div className="glass-card p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-full" />
                Rate Your Client
              </h2>
              <p className="text-white/50 mt-1">Rate each category from 1-5 stars</p>
            </div>

            <div className="space-y-8">
              {categories.map((cat, i) => (
                <div key={cat.id} className={`pb-8 ${i !== categories.length - 1 ? 'border-b border-[rgba(251,146,60,0.15)]' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-white">{cat.label}</h3>
                      <p className="text-sm text-white/40">{cat.description}</p>
                    </div>
                    <span className="text-xs text-amber-400/60">{cat.weight}</span>
                  </div>
                  <StarRating rating={ratings[cat.id] || 0} onChange={v => setRatings({ ...ratings, [cat.id]: v })} size="lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Would work again */}
          <div className="glass-card p-8">
            <h3 className="font-semibold text-xl text-white mb-6">Would you work with this client again?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setWouldWorkAgain(true)}
                className={`group p-8 rounded-xl border-2 transition-all duration-300 ${wouldWorkAgain === true ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/20' : 'bg-orange-500/5 border-[rgba(251,146,60,0.15)] hover:border-[rgba(251,146,60,0.3)]'}`}>
                <ThumbsUp className={`w-10 h-10 mx-auto mb-3 transition-transform group-hover:scale-110 ${wouldWorkAgain === true ? 'text-emerald-400' : 'text-white/30'}`} />
                <div className={`font-semibold text-lg text-center ${wouldWorkAgain === true ? 'text-emerald-400' : 'text-white/50'}`}>Yes</div>
              </button>
              <button type="button" onClick={() => setWouldWorkAgain(false)}
                className={`group p-8 rounded-xl border-2 transition-all duration-300 ${wouldWorkAgain === false ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/20' : 'bg-orange-500/5 border-[rgba(251,146,60,0.15)] hover:border-[rgba(251,146,60,0.3)]'}`}>
                <ThumbsDown className={`w-10 h-10 mx-auto mb-3 transition-transform group-hover:scale-110 ${wouldWorkAgain === false ? 'text-red-400' : 'text-white/30'}`} />
                <div className={`font-semibold text-lg text-center ${wouldWorkAgain === false ? 'text-red-400' : 'text-white/50'}`}>No</div>
              </button>
            </div>
          </div>

          {/* Job details */}
          <div className="glass-card p-8 space-y-5">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Job Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Job Type <span className="text-amber-400">*</span></label>
                <input value={jobType} onChange={e => setJobType(e.target.value)} placeholder="Kitchen remodel" className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Job Value <span className="text-amber-400">*</span></label>
                <select value={jobValue} onChange={e => setJobValue(e.target.value)} className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all">
                  <option value="" className="bg-[#0f1419]">Select range</option>
                  <option value="under-5k" className="bg-[#0f1419]">Under $5,000</option>
                  <option value="5k-15k" className="bg-[#0f1419]">$5,000 - $15,000</option>
                  <option value="15k-50k" className="bg-[#0f1419]">$15,000 - $50,000</option>
                  <option value="50k-100k" className="bg-[#0f1419]">$50,000 - $100,000</option>
                  <option value="over-100k" className="bg-[#0f1419]">Over $100,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Approx Date</label>
                <input type="month" value={jobDate} onChange={e => setJobDate(e.target.value)} className="w-full px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all" />
              </div>
            </div>
          </div>

          {/* TOS */}
          <div className="glass-card p-6 border-amber-500/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={tosAcknowledged} onChange={e => setTosAcknowledged(e.target.checked)} className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/50" />
              <span className="text-sm text-white/60 leading-relaxed">
                I certify that this review is based on my own experience and is my genuine opinion. I understand that false or defamatory reviews may have legal consequences.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button onClick={() => setStep(1)} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <button onClick={handleSubmit} disabled={!canSubmit || loading} className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 group">
              <CheckCircle className="w-5 h-5" />
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
