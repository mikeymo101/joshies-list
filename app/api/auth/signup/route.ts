import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, first_name, last_name } = await request.json();

    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    const admin = createAdminClient();

    await admin.from('contractors').insert({
      auth_user_id: authData.user.id,
      first_name,
      last_name,
      business_name: '',
      trade_type: '',
      phone: '',
      primary_state: '',
      years_in_business: '',
    });

    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
