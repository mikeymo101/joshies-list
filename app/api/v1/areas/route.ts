import { validateApiKey } from '@/lib/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { valid } = await validateApiKey(request);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: clients } = await admin
    .from('clients')
    .select('zip_code, city, state, score, review_count, would_work_again_pct')
    .not('score', 'is', null)
    .gt('review_count', 0);

  if (!clients || clients.length === 0) {
    return NextResponse.json({ areas: [] });
  }

  const zipMap = new Map<string, { zip_code: string; city: string; state: string; totalScore: number; count: number; totalReviews: number }>();

  for (const c of clients) {
    const existing = zipMap.get(c.zip_code);
    if (existing) {
      existing.totalScore += c.score!;
      existing.count += 1;
      existing.totalReviews += c.review_count;
    } else {
      zipMap.set(c.zip_code, { zip_code: c.zip_code, city: c.city, state: c.state, totalScore: c.score!, count: 1, totalReviews: c.review_count });
    }
  }

  const areas = Array.from(zipMap.values())
    .map(a => ({
      zip_code: a.zip_code,
      city: a.city,
      state: a.state,
      avg_score: Math.round((a.totalScore / a.count) * 10) / 10,
      client_count: a.count,
      review_count: a.totalReviews,
    }))
    .sort((a, b) => b.avg_score - a.avg_score);

  return NextResponse.json({ areas });
}
