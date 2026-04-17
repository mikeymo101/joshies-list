import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();

    const { data: contractor } = await admin.from('contractors').select('is_admin').eq('auth_user_id', user.id).single();
    if (!contractor?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { data: contractors, error } = await admin
      .from('contractors')
      .select('id, auth_user_id, first_name, last_name, business_name, trade_type, phone, primary_state, years_in_business, verification_status, access_tier, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get review counts per contractor
    const { data: reviewCounts } = await admin
      .from('reviews')
      .select('contractor_id')
      .eq('status', 'active');

    const countMap: Record<string, number> = {};
    (reviewCounts || []).forEach(r => {
      countMap[r.contractor_id] = (countMap[r.contractor_id] || 0) + 1;
    });

    const enriched = (contractors || []).map(c => ({
      ...c,
      review_count: countMap[c.id] || 0,
    }));

    return NextResponse.json({ contractors: enriched });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
