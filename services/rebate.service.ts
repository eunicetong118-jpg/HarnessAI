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
        // volume (lots) * rebatePerLot (USD/lot) * 100 (cents/USD)
        const amountInCents = BigInt(Math.round(validatedRow.volume * validatedRow.rebatePerLot * 100));

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
}
