import { auth } from '@/lib/auth';
import { SecurityService } from '@/services/security.service';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { qrDataUrl } = await SecurityService.generateSetup(session.user.id);
    return NextResponse.json({ qrDataUrl });
  } catch (error: any) {
    console.error('2FA Enroll Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
