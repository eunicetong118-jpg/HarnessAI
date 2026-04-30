import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { parseCsv, bulkVerify } from '@/services/verification.service';
import { Readable } from 'stream';

export async function POST(req: Request) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const stream = Readable.from(Buffer.from(await file.arrayBuffer()));
    const mt5Numbers = await parseCsv(stream);

    if (mt5Numbers.length === 0) {
      return NextResponse.json({ error: 'No MT5 numbers found in CSV' }, { status: 400 });
    }

    const summary = await bulkVerify(mt5Numbers);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Bulk verification failed:', error);
    return NextResponse.json({ error: 'Bulk verification failed' }, { status: 500 });
  }
}
