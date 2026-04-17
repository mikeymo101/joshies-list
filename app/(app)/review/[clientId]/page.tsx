'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReviewForm from '@/components/ReviewForm';
import type { Client } from '@/types';

export default function ReviewPage({ params }: { params: { clientId: string } }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/clients/${params.clientId}`);
        if (res.ok) {
          const data = await res.json();
          setClient(data.client || null);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.clientId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-96 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href={client ? `/clients/${client.id}` : '/search'} className="text-sm text-navy-400 hover:text-navy-300 transition-colors inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {client ? `Back to ${client.first_name} ${client.last_initial}.` : 'Back'}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-white">Submit Review</h1>
        {client && (
          <p className="text-navy-400 mt-1">
            for {client.first_name} {client.last_initial}. in {client.city}, {client.state}
          </p>
        )}
      </div>

      <ReviewForm
        clientId={params.clientId}
        clientName={client ? `${client.first_name} ${client.last_initial}.` : undefined}
      />
    </div>
  );
}
