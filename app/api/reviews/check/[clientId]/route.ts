import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { clientId: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: contractor } = await admin
      .from('contractors')
      .select('id')
      .eq('auth_user_id', user.id)
      .single();

    if (!contractor) {
      return NextResponse.json({ hasReviewed: false });
    }

    const { data: reviews } = await admin
      .from('reviews')
      .select('id, created_at')
      .eq('contractor_id', contractor.id)
      .eq('client_id', params.clientId)
      .eq('status', 'active');

    return NextResponse.json({
      hasReviewed: (reviews && reviews.length > 0) || false,
      reviewCount: reviews?.length || 0,
    });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
