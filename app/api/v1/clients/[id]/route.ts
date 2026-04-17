import { validateApiKey } from '@/lib/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { valid } = await validateApiKey(request);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: client } = await admin
    .from('clients')
    .select('id, first_name, last_initial, city, state, zip_code, score, grade, review_count, would_work_again_pct, last_reviewed_at')
    .eq('id', params.id)
    .single();

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  const { data: reviews } = await admin
    .from('reviews')
    .select('score_payment, score_post_job, score_scope, score_professionalism, score_access, weighted_score, would_work_again, job_type, job_value_range, created_at')
    .eq('client_id', params.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  let scoreBreakdown = null;
  if (reviews && reviews.length > 0) {
    const count = reviews.length;
    scoreBreakdown = {
      payment: Math.round((reviews.reduce((s, r) => s + r.score_payment, 0) / count) * 10) / 10,
      post_job: Math.round((reviews.reduce((s, r) => s + r.score_post_job, 0) / count) * 10) / 10,
      scope: Math.round((reviews.reduce((s, r) => s + r.score_scope, 0) / count) * 10) / 10,
      professionalism: Math.round((reviews.reduce((s, r) => s + r.score_professionalism, 0) / count) * 10) / 10,
      access: Math.round((reviews.reduce((s, r) => s + r.score_access, 0) / count) * 10) / 10,
    };
  }

  return NextResponse.json({ client, scoreBreakdown, reviews: reviews || [] });
}
