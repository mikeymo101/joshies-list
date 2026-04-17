import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();
    const { data: contractor } = await admin.from('contractors').select('id').eq('auth_user_id', user.id).single();
    if (!contractor) return NextResponse.json({ reviews: [] });

    const { data: reviews } = await admin
      .from('reviews')
      .select('*, clients!inner(id, first_name, last_initial, city, state, zip_code, score, grade)')
      .eq('contractor_id', contractor.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    return NextResponse.json({ reviews: reviews || [] });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
