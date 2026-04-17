import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();
    const { data: contractor } = await admin.from('contractors').select('is_admin').eq('auth_user_id', user.id).single();
    if (!contractor?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { count } = await request.json();
    const numCodes = Math.min(count || 1, 50);

    const codes = [];
    for (let i = 0; i < numCodes; i++) {
      const code = `JL-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      codes.push({ code });
    }

    const { data: inserted, error } = await admin.from('invite_codes').insert(codes).select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ codes: inserted }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
