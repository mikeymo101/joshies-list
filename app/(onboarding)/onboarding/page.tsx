'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const TRADES = [
  'General Contractor', 'Electrician', 'Plumber', 'HVAC', 'Roofer',
  'Painter', 'Carpenter', 'Landscaper', 'Mason', 'Flooring',
  'Drywall', 'Handyman', 'Other',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [tradeType, setTradeType] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [years, setYears] = useState('');

  async function handleSubmit() {
    setLoading(true);
    try {
      await fetch('/api/onboarding/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName,
          trade_type: tradeType,
          phone,
          primary_state: state,
          years_in_business: years,
        }),
      });
      router.push('/dashboard');
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-xl font-bold text-white">
<img src="/logo.svg" alt="Joshies List" className="h-7 inline-block" />
          </span>
          <h1 className="text-2xl font-bold text-white mt-6">Set up your profile</h1>
          <p className="text-navy-400 mt-1">Tell us about your business</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-brand-500' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="glass-card p-8 space-y-5">
            <Input
              label="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your company name"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-navy-300">Trade</label>
              <select
                value={tradeType}
                onChange={(e) => setTradeType(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              >
                <option value="" className="bg-navy-900">Select your trade</option>
                {TRADES.map((t) => (
                  <option key={t} value={t.toLowerCase()} className="bg-navy-900">{t}</option>
                ))}
              </select>
            </div>

            <Input
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />

            <Button onClick={() => setStep(2)} className="w-full">
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="glass-card p-8 space-y-5">
            <Input
              label="Primary State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g., California"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-navy-300">Years in Business</label>
              <select
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              >
                <option value="" className="bg-navy-900">Select</option>
                <option value="0-2" className="bg-navy-900">0-2 years</option>
                <option value="3-5" className="bg-navy-900">3-5 years</option>
                <option value="5-10" className="bg-navy-900">5-10 years</option>
                <option value="10+" className="bg-navy-900">10+ years</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? 'Finishing...' : 'Complete Setup'}
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-navy-600 mb-1">Your profile helps other contractors trust your reviews.</p>
        </div>
      </div>
    </div>
  );
}
