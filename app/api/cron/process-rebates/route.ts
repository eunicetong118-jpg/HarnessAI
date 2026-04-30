import { NextRequest, NextResponse } from 'next/server';
import { RebateService } from '@/services/rebate.service';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

/**
 * Cron endpoint to process pending trade logs.
 * Expects Authorization: Bearer {CRON_SECRET}
 */
export async function POST(req: NextRequest) {
  // 1. Authorization check
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pendingDir = path.join(process.cwd(), 'data/pending-trades');
    const archiveDir = path.join(pendingDir, 'archive');

    // Ensure directories exist
    if (!existsSync(pendingDir)) {
      mkdirSync(pendingDir, { recursive: true });
    }
    if (!existsSync(archiveDir)) {
      mkdirSync(archiveDir, { recursive: true });
    }

    const files = await fs.readdir(pendingDir);
    const tradeFiles = files.filter(f => f.endsWith('.csv') || f.endsWith('.xlsx'));

    if (tradeFiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending trade files found',
        summary: { processed: 0, skipped: 0, totalCents: '0' }
      });
    }

    let overallProcessed = 0;
    let overallSkipped = 0;
    let overallCents = BigInt(0);
    const processedFiles: string[] = [];

    for (const file of tradeFiles) {
      const filePath = path.join(pendingDir, file);
      const buffer = await fs.readFile(filePath);

      try {
        const normalizedTrades = await RebateService.ingestTrades(buffer);
        const result = await RebateService.processBatch(normalizedTrades);

        overallProcessed += result.processed;
        overallSkipped += result.skipped;
        overallCents += result.totalCents;

        // Move processed file to archive to avoid re-processing
        const timestamp = new Date().getTime();
        await fs.rename(filePath, path.join(archiveDir, `${timestamp}-${file}`));
        processedFiles.push(file);
      } catch (fileError) {
        console.error(`[CRON] Error processing file ${file}:`, fileError);
        // Move failed file to a 'failed' directory or just leave it?
        // For now, let's leave it and log the error to avoid losing data.
      }
    }

    return NextResponse.json({
      success: true,
      processedFiles,
      summary: {
        processed: overallProcessed,
        skipped: overallSkipped,
        totalCents: overallCents.toString(),
      }
    });
  } catch (error) {
    console.error('[CRON] Fatal error in rebate processing:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
