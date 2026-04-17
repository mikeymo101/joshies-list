import { validateApiKey } from '@/lib/api-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { valid } = await validateApiKey(request);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name')?.trim();
  const zip = searchParams.get('zip')?.trim();
  const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 100);

  if (!name && !zip) {
    return NextResponse.json({ error: 'Provide at least name or zip parameter' }, { status: 400 });
  }

  const admin = createAdminClient();
  let query = admin.from('clients').select('id, first_name, last_initial, city, state, zip_code, score, grade, review_count, would_work_again_pct, last_reviewed_at');

  if (name) query = query.ilike('first_name', `%${name}%`);
  if (zip) query = query.eq('zip_code', zip);

  const { data: clients, error } = await query.order('review_count', { ascending: false }).limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ clients: clients || [], count: clients?.length || 0 });
}
