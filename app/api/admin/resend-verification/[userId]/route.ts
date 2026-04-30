import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { triggerManualResendVerification } from '@/services/admin.service';

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
    await triggerManualResendVerification(userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to resend verification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to resend verification' },
      { status: 500 }
    );
  }
}
