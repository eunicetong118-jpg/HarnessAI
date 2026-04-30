import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { RebateService } from '@/services/rebate.service';

/**
 * Admin endpoint to manually upload and process trade logs.
 * Restricted to users with the ADMIN role.
 */
export const POST = auth(async (req) => {
  // 1. Session & Role verification
  // NextAuth v5's auth() wrapper populates req.auth
  const session = (req as any).auth;

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded. Please attach a CSV or XLSX file.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Process the file immediately
    const normalizedTrades = await RebateService.ingestTrades(buffer);
    const result = await RebateService.processBatch(normalizedTrades);

    return NextResponse.json({
      success: true,
      message: 'Trade file processed successfully.',
      summary: {
        processed: result.processed,
        skipped: result.skipped,
        totalCents: result.totalCents.toString(),
      }
    });
  } catch (error) {
    console.error('[ADMIN] Error uploading/processing trades:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}) as any; // Cast as any because of NextAuth v5 wrapper type mismatch in some TS versions
