import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { toggleUserDisabled } from '@/services/admin.service';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId } = await params;
    const user = await toggleUserDisabled(userId);

    return NextResponse.json({ success: true, isDisabled: user.isDisabled });
  } catch (error: any) {
    console.error('Failed to toggle user status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to toggle user status' },
      { status: 500 }
    );
  }
}
