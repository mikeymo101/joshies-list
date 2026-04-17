import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Payments are not yet enabled. Joshies List is currently free during the beta period.' },
    { status: 501 }
  );
}
