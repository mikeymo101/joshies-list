import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();
    const { data: contractor } = await admin
      .from('contractors')
      .select('*')
      .eq('auth_user_id', user.id)
      .single();

    return NextResponse.json({ profile: contractor, email: user.email });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const updates = await request.json();
    const allowed = ['first_name', 'last_name', 'business_name', 'trade_type', 'phone', 'primary_state', 'years_in_business'];
    const clean: Record<string, string> = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) clean[key] = updates[key];
    }

    const admin = createAdminClient();
    const { error } = await admin.from('contractors').update(clean).eq('auth_user_id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ message: 'Profile updated' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
