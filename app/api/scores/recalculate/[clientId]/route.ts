import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getGrade } from '@/lib/score-engine';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { clientId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: reviews } = await admin
      .from('reviews')
      .select('weighted_score')
      .eq('client_id', params.clientId)
      .eq('status', 'active');

    if (!reviews || reviews.length === 0) {
      await admin
        .from('clients')
        .update({ score: null, grade: null, review_count: 0, last_reviewed_at: null })
        .eq('id', params.clientId);

      return NextResponse.json({ score: null, grade: null, review_count: 0 });
    }

    const avgScore = Math.round(
      (reviews.reduce((sum, r) => sum + r.weighted_score, 0) / reviews.length) * 10
    ) / 10;
    const grade = getGrade(avgScore);

    await admin
      .from('clients')
      .update({
        score: avgScore,
        grade,
        review_count: reviews.length,
        last_reviewed_at: new Date().toISOString(),
      })
      .eq('id', params.clientId);

    return NextResponse.json({ score: avgScore, grade, review_count: reviews.length });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
