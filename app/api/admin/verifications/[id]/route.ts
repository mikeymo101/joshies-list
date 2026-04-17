import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();

    const { data: contractor } = await admin.from('contractors').select('is_admin').eq('auth_user_id', user.id).single();
    if (!contractor?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { status, admin_notes } = body;

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (status) {
      updates.status = status;
      updates.reviewed_at = new Date().toISOString();
    }
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    const { error } = await admin.from('verification_submissions').update(updates).eq('id', params.id);
    if (error) throw error;

    // If approved, update the contractor's verification status
    if (status === 'approved') {
      const { data: submission } = await admin.from('verification_submissions').select('contractor_id').eq('id', params.id).single();
      if (submission) {
        await admin.from('contractors').update({
          verification_status: 'approved',
          access_tier: 'verified',
          verified_at: new Date().toISOString(),
        }).eq('id', submission.contractor_id);
      }
    } else if (status === 'rejected') {
      const { data: submission } = await admin.from('verification_submissions').select('contractor_id').eq('id', params.id).single();
      if (submission) {
        await admin.from('contractors').update({ verification_status: 'rejected' }).eq('id', submission.contractor_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
