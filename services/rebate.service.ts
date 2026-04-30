import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { z } from 'zod';

/**
 * Zod schema for trade log row validation.
 */
const TradeLogRowSchema = z.object({
  tradeId: z.coerce.string().min(1, 'Trade ID is required'),
  mt5AccountNo: z.coerce.string().min(5, 'MT5 Account Number is required'),
  volume: z.coerce.number().positive('Volume must be positive'),
  rebatePerLot: z.coerce.number().nonnegative('Rebate per lot must be non-negative'),
});

export type TradeLogRow = z.infer<typeof TradeLogRowSchema>;

export interface NormalizedTrade {
  tradeId: string;
  mt5AccountNo: string;
  volume: number;
  rebatePerLot: number;
  userId: string;
  amountInCents: bigint;
}

/**
 * Service for handling rebate ingestion and trade normalization.
 */
export class RebateService {
  /**
   * Ingests trades from a Buffer (e.g., from a file upload).
   * Parses CSV/Excel, normalizes data, and validates MT5 accounts.
   *
   * @param buffer - The file buffer to parse
   * @returns List of valid, processable trade objects
   * @throws Error if parsing fails or critical data is missing
   */
  static async ingestTrades(buffer: Buffer): Promise<NormalizedTrade[]> {
    // 1. Parse the file using xlsx
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON objects
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    if (!rawData || rawData.length === 0) {
      throw new Error('The provided file is empty or invalid');
    }

    const normalizedTrades: NormalizedTrade[] = [];

    // 2. Process and normalize each row
    for (const row of rawData) {
      try {
        // Validate row format
        const validatedRow = TradeLogRowSchema.parse(row);

        // 3. Map MT5 Account to User
        // Account must be VERIFIED and Active
        const brokerAccount = await prisma.brokerAccount.findUnique({
          where: { mt5AccountNo: validatedRow.mt5AccountNo },
          include: { user: true },
        });

        if (!brokerAccount) {
          console.warn(`[RebateService] MT5 Account ${validatedRow.mt5AccountNo} not found in system. Skipping.`);
          continue;
        }

        if (brokerAccount.status !== 'VERIFIED') {
          console.warn(`[RebateService] MT5 Account ${validatedRow.mt5AccountNo} is not VERIFIED. Skipping.`);
          continue;
        }

        if (!brokerAccount.isActive) {
          console.warn(`[RebateService] MT5 Account ${validatedRow.mt5AccountNo} is inactive. Skipping.`);
          continue;
        }

        // 4. Calculate amount in cents (BigInt)
        // Formula: volume (lots) * rebatePerLot (USD/lot) * 0.80 * 100 (cents/USD)
        const amountInCents = RebateService.calculateRebate(validatedRow.volume, validatedRow.rebatePerLot);

        normalizedTrades.push({
          tradeId: validatedRow.tradeId,
          mt5AccountNo: validatedRow.mt5AccountNo,
          volume: validatedRow.volume,
          rebatePerLot: validatedRow.rebatePerLot,
          userId: brokerAccount.userId,
          amountInCents,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(`[RebateService] Validation error for row:`, row, error.errors);
        } else {
          console.error(`[RebateService] Unexpected error processing row:`, row, error);
        }
        // Skip invalid rows but continue processing
      }
    }

    return normalizedTrades;
  }

  /**
   * Calculates the rebate amount in cents.
   * Formula: volume * rebatePerLot * 0.80
   *
   * @param volume - Trade volume in lots
   * @param rebatePerLot - Rebate rate in USD per lot
   * @returns BigInt amount in cents
   */
  static calculateRebate(volume: number, rebatePerLot: number): bigint {
    return BigInt(Math.round(volume * rebatePerLot * 0.80 * 100));
  }

  /**
   * Processes a batch of normalized trades.
   * Performs deduplication, aggregation per user, and ledger insertion.
   *
   * @param trades - List of normalized trades to process
   * @returns Summary of processing
   */
  static async processBatch(trades: NormalizedTrade[]): Promise<{
    processed: number;
    skipped: number;
    totalCents: bigint;
  }> {
    if (trades.length === 0) {
      return { processed: 0, skipped: 0, totalCents: BigInt(0) };
    }

    // 1. Deduplication: Check for existing trade IDs
    const tradeIds = trades.map((t) => t.tradeId);
    const existingProcessed = await prisma.processedTrade.findMany({
      where: { tradeId: { in: tradeIds } },
      select: { tradeId: true },
    });

    const existingTradeIds = new Set(existingProcessed.map((p) => p.tradeId));
    const newTrades = trades.filter((t) => !existingTradeIds.has(t.tradeId));
    const skippedCount = trades.length - newTrades.length;

    if (newTrades.length === 0) {
      return { processed: 0, skipped: skippedCount, totalCents: BigInt(0) };
    }

    const userAggregates = new Map<string, bigint>();
    newTrades.forEach((trade) => {
      const current = userAggregates.get(trade.userId) || BigInt(0);
      userAggregates.set(trade.userId, current + trade.amountInCents);
    });

    let totalCents = BigInt(0);
    userAggregates.forEach((amount) => {
      totalCents += amount;
    });

    // 3. Execution: Wrap in a Prisma transaction
    await prisma.$transaction(async (tx) => {
      // a. Insert ProcessedTrade records for audit and dedup
      await tx.processedTrade.createMany({
        data: newTrades.map((t) => ({
          tradeId: t.tradeId,
          userId: t.userId,
        })),
      });

      // b. Insert aggregated Ledger entries
      for (const [userId, amount] of Array.from(userAggregates.entries())) {
        await tx.ledger.create({
          data: {
            userId,
            amount,
            type: 'CREDIT',
            category: 'REBATE',
            referenceId: `BATCH-${new Date().toISOString().split('T')[0]}-${userId}-${Date.now()}`,
          },
        });
      }
    });

    return {
      processed: newTrades.length,
      skipped: skippedCount,
      totalCents,
    };
  }
}
