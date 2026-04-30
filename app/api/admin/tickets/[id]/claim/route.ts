import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { claimTicket } from '@/services/ticket.service';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const adminId = session.user.id;

  try {
    const ticket = await claimTicket(id, adminId!);
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Failed to claim ticket:', error);
    return NextResponse.json({ error: 'Failed to claim ticket' }, { status: 500 });
  }
}
