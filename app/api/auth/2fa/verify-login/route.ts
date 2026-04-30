import { auth } from '@/lib/auth';
import { SecurityService } from '@/services/security.service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Code required' }, { status: 400 });
    }

    const isValid = await SecurityService.verifySecurityCode(session.user.id, code);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('2FA Verify Login Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
