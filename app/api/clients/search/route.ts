import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();
    const zip = searchParams.get('zip')?.trim();

    if (!q && !zip) {
      return NextResponse.json({ clients: [] });
    }

    const admin = createAdminClient();

    let query = admin.from('clients').select('*');

    if (q) {
      // Search by first name (case-insensitive)
      query = query.ilike('first_name', `%${q}%`);
    }

    if (zip) {
      query = query.eq('zip_code', zip);
    }

    const { data: clients, error } = await query
      .order('review_count', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Client search error:', error.message, error.code, error.details);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ clients: clients || [] });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
