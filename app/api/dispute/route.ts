import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, type, description } = await request.json();

    if (!name || !email || !type || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Log the dispute - store in console for now, can be moved to a DB table later
    console.log('DISPUTE REQUEST:', { name, email, type, description, submitted_at: new Date().toISOString() });

    // Try to store in Supabase if the table exists
    try {
      const admin = createAdminClient();
      await admin.from('disputes').insert({ name, email, type, description });
    } catch {
      // Table may not exist yet - that's ok, we logged it
    }

    return NextResponse.json({ message: 'Request received' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
