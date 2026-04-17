import { validateApiKey } from '@/lib/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateWeightedScore, getGrade } from '@/lib/score-engine';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { valid, contractorId } = await validateApiKey(request);
  if (!valid || !contractorId) {
    return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }

  const body = await request.json();
  const {
    client_id, first_name, last_initial, city, state, zip_code,
    score_payment, score_post_job, score_scope, score_professionalism, score_access,
    would_work_again, job_type, job_value_range, job_date_approx,
  } = body;

  // Validate scores
  const scores = [score_payment, score_post_job, score_scope, score_professionalism, score_access];
  if (scores.some(s => !s || s < 1 || s > 5)) {
    return NextResponse.json({ error: 'All scores must be between 1 and 5' }, { status: 400 });
  }

  const admin = createAdminClient();
  let targetClientId = client_id;

  // If no client_id, create or find the client
  if (!targetClientId) {
    if (!first_name || !last_initial || !city || !state || !zip_code) {
      return NextResponse.json({ error: 'Provide client_id or client details (first_name, last_initial, city, state, zip_code)' }, { status: 400 });
    }

    // Check for existing
    const { data: existing } = await admin
      .from('clients')
      .select('id')
      .ilike('first_name', first_name.trim())
      .ilike('last_initial', last_initial.trim())
      .eq('zip_code', zip_code.trim())
      .limit(1);

    if (existing && existing.length > 0) {
      targetClientId = existing[0].id;
    } else {
      const { data: newClient, error: createErr } = await admin
        .from('clients')
        .insert({
          first_name: first_name.trim(),
          last_initial: last_initial.trim().charAt(0).toUpperCase(),
          city: city.trim(),
          state: state.trim().toUpperCase(),
          zip_code: zip_code.trim(),
        })
        .select('id')
        .single();

      if (createErr || !newClient) {
        return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
      }
      targetClientId = newClient.id;
    }
  }

  const weighted_score = calculateWeightedScore({ score_payment, score_post_job, score_scope, score_professionalism, score_access });

  const { data: review, error: reviewError } = await admin
    .from('reviews')
    .insert({
      contractor_id: contractorId,
      client_id: targetClientId,
      score_payment, score_post_job, score_scope, score_professionalism, score_access,
      weighted_score,
      would_work_again: would_work_again ?? null,
      job_type: job_type || 'Not specified',
      job_value_range: job_value_range || 'Not specified',
      job_date_approx: job_date_approx || 'Not specified',
      tos_acknowledged: true,
    })
    .select()
    .single();

  if (reviewError) {
    if (reviewError.code === '23505') {
      return NextResponse.json({ error: 'Duplicate review for this client and time period' }, { status: 409 });
    }
    return NextResponse.json({ error: reviewError.message }, { status: 400 });
  }

  // Recalculate
  const { data: allReviews } = await admin
    .from('reviews')
    .select('weighted_score, would_work_again')
    .eq('client_id', targetClientId)
    .eq('status', 'active');

  if (allReviews && allReviews.length > 0) {
    const avgScore = Math.round((allReviews.reduce((s, r) => s + r.weighted_score, 0) / allReviews.length) * 10) / 10;
    const workAgain = allReviews.filter(r => r.would_work_again !== null);
    const wouldWorkAgainPct = workAgain.length > 0 ? Math.round((workAgain.filter(r => r.would_work_again).length / workAgain.length) * 100) : null;

    await admin.from('clients').update({
      score: avgScore,
      grade: getGrade(avgScore),
      review_count: allReviews.length,
      would_work_again_pct: wouldWorkAgainPct,
      last_reviewed_at: new Date().toISOString(),
    }).eq('id', targetClientId);
  }

  return NextResponse.json({ review, client_id: targetClientId }, { status: 201 });
}
