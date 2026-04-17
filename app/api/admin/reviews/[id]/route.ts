import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateWeightedScore, getGrade } from '@/lib/score-engine';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();
    const { data: contractor } = await admin.from('contractors').select('is_admin').eq('auth_user_id', user.id).single();
    if (!contractor?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: review } = await admin
      .from('reviews')
      .select('*, clients!inner(id, first_name, last_initial, city, state, zip_code, score, grade), contractors!inner(id, first_name, last_name, business_name, trade_type, phone, primary_state, auth_user_id, created_at)')
      .eq('id', params.id)
      .single();

    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

    // Get contractor's email from auth
    const { data: { user: authUser } } = await admin.auth.admin.getUserById(review.contractors.auth_user_id);

    return NextResponse.json({
      review,
      contractorEmail: authUser?.email || null,
    });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();
    const { data: contractor } = await admin.from('contractors').select('is_admin').eq('auth_user_id', user.id).single();
    if (!contractor?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { score_payment, score_post_job, score_scope, score_professionalism, score_access, status } = body;

    // Get the review to find client_id
    const { data: existing } = await admin.from('reviews').select('client_id').eq('id', params.id).single();
    if (!existing) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (score_payment) updates.score_payment = score_payment;
    if (score_post_job) updates.score_post_job = score_post_job;
    if (score_scope) updates.score_scope = score_scope;
    if (score_professionalism) updates.score_professionalism = score_professionalism;
    if (score_access) updates.score_access = score_access;

    // Recalculate weighted score if any scores changed
    if (score_payment || score_post_job || score_scope || score_professionalism || score_access) {
      const { data: current } = await admin.from('reviews').select('*').eq('id', params.id).single();
      if (current) {
        updates.weighted_score = calculateWeightedScore({
          score_payment: score_payment || current.score_payment,
          score_post_job: score_post_job || current.score_post_job,
          score_scope: score_scope || current.score_scope,
          score_professionalism: score_professionalism || current.score_professionalism,
          score_access: score_access || current.score_access,
        });
      }
    }

    await admin.from('reviews').update(updates).eq('id', params.id);

    // Recalculate client score
    const { data: allReviews } = await admin
      .from('reviews')
      .select('weighted_score, would_work_again')
      .eq('client_id', existing.client_id)
      .eq('status', 'active');

    if (allReviews && allReviews.length > 0) {
      const avgScore = Math.round((allReviews.reduce((s, r) => s + r.weighted_score, 0) / allReviews.length) * 10) / 10;
      const workAgain = allReviews.filter(r => r.would_work_again !== null);
      const pct = workAgain.length > 0 ? Math.round((workAgain.filter(r => r.would_work_again).length / workAgain.length) * 100) : null;

      await admin.from('clients').update({
        score: avgScore, grade: getGrade(avgScore), review_count: allReviews.length,
        would_work_again_pct: pct, last_reviewed_at: new Date().toISOString(),
      }).eq('id', existing.client_id);
    } else {
      await admin.from('clients').update({
        score: null, grade: null, review_count: 0, would_work_again_pct: null, last_reviewed_at: null,
      }).eq('id', existing.client_id);
    }

    return NextResponse.json({ message: 'Review updated' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
