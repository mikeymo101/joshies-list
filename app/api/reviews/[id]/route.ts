import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getGrade } from '@/lib/score-engine';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();

    const { data: contractor } = await admin.from('contractors').select('id, is_admin').eq('auth_user_id', user.id).single();
    if (!contractor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Admins can delete any review; contractors can only delete their own
    let review;
    if (contractor.is_admin) {
      const { data } = await admin.from('reviews').select('id, client_id').eq('id', params.id).single();
      review = data;
    } else {
      const { data } = await admin.from('reviews').select('id, client_id').eq('id', params.id).eq('contractor_id', contractor.id).single();
      review = data;
    }
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

    const clientId = review.client_id;

    // Delete the review
    await admin.from('reviews').delete().eq('id', params.id);

    // Recalculate client score
    const { data: remaining } = await admin.from('reviews').select('weighted_score, would_work_again').eq('client_id', clientId).eq('status', 'active');

    if (remaining && remaining.length > 0) {
      const avgScore = Math.round((remaining.reduce((s, r) => s + r.weighted_score, 0) / remaining.length) * 10) / 10;
      const workAgain = remaining.filter(r => r.would_work_again !== null);
      const wouldWorkAgainPct = workAgain.length > 0 ? Math.round((workAgain.filter(r => r.would_work_again).length / workAgain.length) * 100) : null;

      await admin.from('clients').update({
        score: avgScore, grade: getGrade(avgScore), review_count: remaining.length,
        would_work_again_pct: wouldWorkAgainPct, last_reviewed_at: new Date().toISOString(),
      }).eq('id', clientId);
    } else {
      await admin.from('clients').update({
        score: null, grade: null, review_count: 0, would_work_again_pct: null, last_reviewed_at: null,
      }).eq('id', clientId);
    }

    return NextResponse.json({ message: 'Review deleted' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
