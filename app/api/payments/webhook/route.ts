import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Payment webhooks are not yet configured.' },
    { status: 501 }
  );
}
