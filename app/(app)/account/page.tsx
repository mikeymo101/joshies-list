'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

const TRADES = [
  'General Contractor', 'Electrician', 'Plumber', 'HVAC', 'Roofer',
  'Painter', 'Carpenter', 'Landscaper', 'Mason', 'Flooring',
  'Drywall', 'Handyman', 'Other',
];

interface ApiKey {
  id: string;
  key_prefix: string;
  name: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [tradeType, setTradeType] = useState('');
  const [phone, setPhone] = useState('');
  const [primaryState, setPrimaryState] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/account/profile').then(r => r.json()),
      fetch('/api/account/api-keys').then(r => r.json()),
    ]).then(([profileData, keysData]) => {
      if (profileData.profile) {
        setFirstName(profileData.profile.first_name || '');
        setLastName(profileData.profile.last_name || '');
        setBusinessName(profileData.profile.business_name || '');
        setTradeType(profileData.profile.trade_type || '');
        setPhone(profileData.profile.phone || '');
        setPrimaryState(profileData.profile.primary_state || '');
        setYearsInBusiness(profileData.profile.years_in_business || '');
      }
      setEmail(profileData.email || '');
      setApiKeys(keysData.keys || []);
    }).finally(() => setLoading(false));
  }, []);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, business_name: businessName, trade_type: tradeType, phone, primary_state: primaryState, years_in_business: yearsInBusiness }),
      });
      if (res.ok) toast('Profile saved', 'success');
      else toast('Failed to save', 'error');
    } catch { toast('Something went wrong', 'error'); }
    finally { setSaving(false); }
  }

  async function handleCreateKey() {
    setCreatingKey(true);
    try {
      const res = await fetch('/api/account/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName || 'Default' }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedKey(data.key);
        setNewKeyName('');
        // Refresh keys list
        const keysRes = await fetch('/api/account/api-keys').then(r => r.json());
        setApiKeys(keysRes.keys || []);
        toast('API key created — copy it now, it won\'t be shown again', 'success');
      }
    } catch { toast('Failed to create key', 'error'); }
    finally { setCreatingKey(false); }
  }

  async function handleDeleteKey(id: string) {
    await fetch('/api/account/api-keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setApiKeys(prev => prev.filter(k => k.id !== id));
    toast('API key deleted', 'success');
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
        <div className="h-48 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Account</h1>
        <p className="text-navy-400 mt-1">{email}</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-4">Profile</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <Input label="Business Name" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your company" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-navy-300">Trade</label>
              <select value={tradeType} onChange={e => setTradeType(e.target.value)} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all">
                <option value="" className="bg-navy-900">Select</option>
                {TRADES.map(t => <option key={t} value={t.toLowerCase()} className="bg-navy-900">{t}</option>)}
              </select>
            </div>
            <Input label="Phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Primary State" value={primaryState} onChange={e => setPrimaryState(e.target.value)} placeholder="TX" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-navy-300">Years in Business</label>
              <select value={yearsInBusiness} onChange={e => setYearsInBusiness(e.target.value)} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all">
                <option value="" className="bg-navy-900">Select</option>
                <option value="0-2" className="bg-navy-900">0-2 years</option>
                <option value="3-5" className="bg-navy-900">3-5 years</option>
                <option value="5-10" className="bg-navy-900">5-10 years</option>
                <option value="10+" className="bg-navy-900">10+ years</option>
              </select>
            </div>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>

      {/* API Keys */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-1">API Keys</h2>
        <p className="text-xs text-navy-500 mb-4">Integrate Joshie&apos;s List with your CRM or tools</p>

        {generatedKey && (
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 mb-4">
            <p className="text-xs text-brand-400 font-semibold mb-2">Copy your API key now — it won&apos;t be shown again:</p>
            <div className="flex gap-2">
              <code className="flex-1 bg-navy-950 text-brand-400 text-xs px-3 py-2 rounded-lg font-mono break-all">{generatedKey}</code>
              <button
                onClick={() => { navigator.clipboard.writeText(generatedKey); toast('Key copied!', 'success'); }}
                className="px-3 py-2 rounded-lg bg-white/5 text-navy-300 hover:text-white text-xs font-medium shrink-0"
              >
                Copy
              </button>
            </div>
            <button onClick={() => setGeneratedKey(null)} className="text-xs text-navy-500 mt-2 hover:text-navy-300">
              Dismiss
            </button>
          </div>
        )}

        {apiKeys.length > 0 && (
          <div className="space-y-2 mb-4">
            {apiKeys.map(key => (
              <div key={key.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div>
                  <span className="text-sm font-medium text-white">{key.name}</span>
                  <span className="text-xs text-navy-500 ml-2 font-mono">{key.key_prefix}...</span>
                  {key.last_used_at && (
                    <span className="text-xs text-navy-600 ml-2">Last used {new Date(key.last_used_at).toLocaleDateString()}</span>
                  )}
                </div>
                <button onClick={() => handleDeleteKey(key.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="Key name (e.g., My CRM)" className="flex-1" />
          <Button variant="secondary" onClick={handleCreateKey} disabled={creatingKey}>
            {creatingKey ? 'Creating...' : 'Generate Key'}
          </Button>
        </div>
      </div>

      {/* API Docs quick ref */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-3">API Reference</h2>
        <div className="space-y-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="text-emerald-400">GET</span> <span className="text-navy-300">/api/v1/clients/search?name=John&amp;zip=80222</span>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="text-emerald-400">GET</span> <span className="text-navy-300">/api/v1/clients/{'{'} id {'}'}</span>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="text-brand-400">POST</span> <span className="text-navy-300">/api/v1/reviews</span>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="text-emerald-400">GET</span> <span className="text-navy-300">/api/v1/areas</span>
          </div>
        </div>
        <p className="text-xs text-navy-500 mt-3">Pass your key as <code className="text-navy-400">Authorization: Bearer jl_...</code></p>
      </div>

      {/* Danger zone */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-300 uppercase tracking-wider mb-4">Session</h2>
        <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
      </div>
    </div>
  );
}
