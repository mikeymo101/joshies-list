import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();
    const { data: contractor } = await admin.from('contractors').select('is_admin').eq('auth_user_id', user.id).single();
    if (!contractor?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();

    const query = admin
      .from('reviews')
      .select('*, clients!inner(id, first_name, last_initial, city, state, zip_code, score, grade), contractors!inner(id, first_name, last_name, business_name, trade_type, phone, auth_user_id)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // If searching, we'll filter after fetching since we need to search across joins
    const { data: reviews, error } = await query.limit(200);

    if (error) {
      console.error('Admin reviews error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    let filtered = reviews || [];
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(r => {
        const clientName = `${r.clients.first_name} ${r.clients.last_initial}`.toLowerCase();
        const contractorName = `${r.contractors.first_name} ${r.contractors.last_name}`.toLowerCase();
        const business = (r.contractors.business_name || '').toLowerCase();
        return clientName.includes(lower) || contractorName.includes(lower) || business.includes(lower) || r.job_type.toLowerCase().includes(lower);
      });
    }

    return NextResponse.json({ reviews: filtered });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
