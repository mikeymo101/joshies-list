import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();

    const { data: contractor } = await admin.from('contractors').select('is_admin').eq('auth_user_id', user.id).single();
    if (!contractor?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const [
      { count: contractorCount },
      { count: clientCount },
      { count: reviewCount },
      { data: inviteCodes },
      { data: contractors },
      { data: recentReviews },
    ] = await Promise.all([
      admin.from('contractors').select('*', { count: 'exact', head: true }),
      admin.from('clients').select('*', { count: 'exact', head: true }),
      admin.from('reviews').select('*', { count: 'exact', head: true }),
      admin.from('invite_codes').select('*').order('created_at', { ascending: false }),
      admin.from('contractors').select('id, first_name, last_name, business_name, trade_type, primary_state, created_at').order('created_at', { ascending: false }),
      admin.from('reviews').select('id, weighted_score, job_type, created_at, clients!inner(first_name, last_initial)').order('created_at', { ascending: false }).limit(10),
    ]);

    const usedCodes = (inviteCodes || []).filter(c => c.used).length;
    const totalCodes = (inviteCodes || []).length;

    return NextResponse.json({
      contractors: contractorCount || 0,
      clients: clientCount || 0,
      reviews: reviewCount || 0,
      inviteCodes: { total: totalCodes, used: usedCodes, available: totalCodes - usedCodes },
      codes: inviteCodes || [],
      contractorList: contractors || [],
      recentReviews: recentReviews || [],
    });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
