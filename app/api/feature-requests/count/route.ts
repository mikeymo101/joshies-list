import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ count: 0 });

    const admin = createAdminClient();

    const { data: contractor } = await admin
      .from('contractors')
      .select('is_admin')
      .eq('auth_user_id', user.id)
      .single();

    if (!contractor?.is_admin) return NextResponse.json({ count: 0 });

    const { count } = await admin
      .from('feature_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    return NextResponse.json({ count: count || 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
