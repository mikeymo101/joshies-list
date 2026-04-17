import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: `get-contractor-${params.id}` });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: `update-contractor-${params.id}` });
}
