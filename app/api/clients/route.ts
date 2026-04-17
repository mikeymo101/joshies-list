import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Get the contractor record for this user
    const { data: contractor } = await admin
      .from('contractors')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!contractor) {
      return NextResponse.json({ clients: [] });
    }

    // Get clients this contractor has reviewed
    const { data: reviews } = await admin
      .from('reviews')
      .select('client_id')
      .eq('contractor_id', contractor.id)
      .eq('status', 'active');

    const clientIds = Array.from(new Set((reviews || []).map(r => r.client_id)));

    if (clientIds.length === 0) {
      return NextResponse.json({ clients: [] });
    }

    const { data: clients } = await admin
      .from('clients')
      .select('*')
      .in('id', clientIds)
      .order('last_reviewed_at', { ascending: false });

    return NextResponse.json({ clients: clients || [] });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { first_name, last_initial, city, state, zip_code } = await request.json();

    if (!first_name || !last_initial || !city || !state || !zip_code) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Check if this client already exists (same name + zip)
    const { data: existing } = await admin
      .from('clients')
      .select('*')
      .ilike('first_name', first_name.trim())
      .ilike('last_initial', last_initial.trim())
      .eq('zip_code', zip_code.trim())
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ client: existing[0], existing: true });
    }

    // Create new client
    const { data: client, error } = await admin
      .from('clients')
      .insert({
        first_name: first_name.trim(),
        last_initial: last_initial.trim().charAt(0).toUpperCase(),
        city: city.trim(),
        state: state.trim().toUpperCase(),
        zip_code: zip_code.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error('Client insert error:', error.message, error.code, error.details);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ client, existing: false }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
