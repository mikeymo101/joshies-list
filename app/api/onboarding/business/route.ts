import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { business_name, trade_type, phone, primary_state, years_in_business } = await request.json();

    const admin = createAdminClient();

    const { error } = await admin
      .from('contractors')
      .update({
        business_name: business_name || '',
        trade_type: trade_type || '',
        phone: phone || '',
        primary_state: primary_state || '',
        years_in_business: years_in_business || '',
      })
      .eq('auth_user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Business info updated' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
