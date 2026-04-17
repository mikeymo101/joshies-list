import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateWeightedScore, getGrade } from '@/lib/score-engine';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      client_id,
      score_payment,
      score_post_job,
      score_scope,
      score_professionalism,
      score_access,
      job_type,
      job_value_range,
      job_date_approx,
      would_work_again,
      tos_acknowledged,
    } = body;

    // Validate required fields
    if (!client_id || !score_payment || !score_post_job || !score_scope || !score_professionalism || !score_access) {
      return NextResponse.json({ error: 'All score fields are required' }, { status: 400 });
    }

    if (!tos_acknowledged) {
      return NextResponse.json({ error: 'You must acknowledge the terms' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Get or create contractor record
    let { data: contractor } = await admin
      .from('contractors')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!contractor) {
      const { data: newContractor, error: createErr } = await admin
        .from('contractors')
        .insert({
          auth_user_id: user.id,
          first_name: user.email?.split('@')[0] || '',
          last_name: '',
          business_name: '',
          trade_type: '',
          phone: '',
          primary_state: '',
          years_in_business: '',
        })
        .select('id')
        .single();

      if (createErr || !newContractor) {
        return NextResponse.json({ error: 'Failed to create contractor profile' }, { status: 500 });
      }
      contractor = newContractor;
    }

    // Verify client exists
    const { data: client } = await admin
      .from('clients')
      .select('id')
      .eq('id', client_id)
      .single();

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Calculate weighted score
    const weighted_score = calculateWeightedScore({
      score_payment,
      score_post_job,
      score_scope,
      score_professionalism,
      score_access,
    });

    // Insert review
    const { data: review, error: reviewError } = await admin
      .from('reviews')
      .insert({
        contractor_id: contractor.id,
        client_id,
        score_payment,
        score_post_job,
        score_scope,
        score_professionalism,
        score_access,
        weighted_score,
        job_type: job_type || 'Not specified',
        job_value_range: job_value_range || 'Not specified',
        job_date_approx: job_date_approx || 'Not specified',
        would_work_again: would_work_again ?? null,
        tos_acknowledged,
      })
      .select()
      .single();

    if (reviewError) {
      if (reviewError.code === '23505') {
        return NextResponse.json(
          { error: 'You have already reviewed this client for this time period' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: reviewError.message }, { status: 400 });
    }

    // Recalculate client score
    const { data: allReviews } = await admin
      .from('reviews')
      .select('weighted_score, would_work_again')
      .eq('client_id', client_id)
      .eq('status', 'active');

    if (allReviews && allReviews.length > 0) {
      const avgScore = Math.round((allReviews.reduce((sum, r) => sum + r.weighted_score, 0) / allReviews.length) * 10) / 10;
      const grade = getGrade(avgScore);

      // Calculate would_work_again percentage
      const workAgainReviews = allReviews.filter(r => r.would_work_again !== null);
      const wouldWorkAgainPct = workAgainReviews.length > 0
        ? Math.round((workAgainReviews.filter(r => r.would_work_again === true).length / workAgainReviews.length) * 100)
        : null;

      await admin
        .from('clients')
        .update({
          score: avgScore,
          grade,
          review_count: allReviews.length,
          would_work_again_pct: wouldWorkAgainPct,
          last_reviewed_at: new Date().toISOString(),
        })
        .eq('id', client_id);
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
