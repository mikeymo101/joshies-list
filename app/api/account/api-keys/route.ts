import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateApiKey } from '@/lib/api-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();
    const { data: contractor } = await admin.from('contractors').select('id').eq('auth_user_id', user.id).single();
    if (!contractor) return NextResponse.json({ keys: [] });

    const { data: keys } = await admin
      .from('api_keys')
      .select('id, key_prefix, name, is_active, last_used_at, created_at')
      .eq('contractor_id', contractor.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ keys: keys || [] });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name } = await request.json();
    const admin = createAdminClient();

    let { data: contractor } = await admin.from('contractors').select('id').eq('auth_user_id', user.id).single();
    if (!contractor) {
      const { data: newC } = await admin.from('contractors').insert({
        auth_user_id: user.id, first_name: '', last_name: '', business_name: '', trade_type: '', phone: '', primary_state: '', years_in_business: '',
      }).select('id').single();
      contractor = newC;
    }
    if (!contractor) return NextResponse.json({ error: 'Failed' }, { status: 500 });

    const { key, hash, prefix } = generateApiKey();

    await admin.from('api_keys').insert({
      contractor_id: contractor.id,
      key_hash: hash,
      key_prefix: prefix,
      name: name || 'Default',
    });

    // Return the full key only once — it can never be retrieved again
    return NextResponse.json({ key, prefix, name: name || 'Default' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();
    const admin = createAdminClient();

    const { data: contractor } = await admin.from('contractors').select('id').eq('auth_user_id', user.id).single();
    if (!contractor) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await admin.from('api_keys').delete().eq('id', id).eq('contractor_id', contractor.id);

    return NextResponse.json({ message: 'Key deleted' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
