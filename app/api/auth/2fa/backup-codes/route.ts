import { auth } from '@/lib/auth';
import { SecurityService } from '@/services/security.service';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { backupCodes } = await SecurityService.regenerateBackupCodes(session.user.id);
    return NextResponse.json({ backupCodes });
  } catch (error: any) {
    console.error('2FA Backup Codes Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
