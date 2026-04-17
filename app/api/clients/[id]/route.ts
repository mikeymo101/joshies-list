import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: client, error } = await admin
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Get score breakdown from reviews
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
        payment: Math.round((reviews.reduce((sum, r) => sum + r.score_payment, 0) / count) * 10) / 10,
        post_job: Math.round((reviews.reduce((sum, r) => sum + r.score_post_job, 0) / count) * 10) / 10,
        scope: Math.round((reviews.reduce((sum, r) => sum + r.score_scope, 0) / count) * 10) / 10,
        professionalism: Math.round((reviews.reduce((sum, r) => sum + r.score_professionalism, 0) / count) * 10) / 10,
        access: Math.round((reviews.reduce((sum, r) => sum + r.score_access, 0) / count) * 10) / 10,
      };
    }

    return NextResponse.json({
      client,
      scoreBreakdown,
      reviews: reviews || [],
    });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
