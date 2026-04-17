import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, description, category } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    if (title.trim().length > 100) {
      return NextResponse.json({ error: 'Title must be under 100 characters' }, { status: 400 });
    }

    if (description.trim().length > 1000) {
      return NextResponse.json({ error: 'Description must be under 1000 characters' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Get contractor id
    const { data: contractor } = await admin
      .from('contractors')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    const { error } = await admin.from('feature_requests').insert({
      contractor_id: contractor?.id || null,
      title: title.trim(),
      description: description.trim(),
      category: category || 'general',
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();

    // Check if admin
    const { data: contractor } = await admin
      .from('contractors')
      .select('id, is_admin')
      .eq('auth_user_id', user.id)
      .single();

    if (!contractor?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: requests, error } = await admin
      .from('feature_requests')
      .select('*, contractors(first_name, last_name, business_name, trade_type)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ requests });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();

    const { data: contractor } = await admin
      .from('contractors')
      .select('id, is_admin')
      .eq('auth_user_id', user.id)
      .single();

    if (!contractor?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, admin_notes } = body;

    if (!id) return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });

    const validStatuses = ['new', 'reviewed', 'planned', 'completed', 'declined'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updates: Record<string, string> = {};
    if (status) updates.status = status;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    const { error } = await admin.from('feature_requests').update(updates).eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
