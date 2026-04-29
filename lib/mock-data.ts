import { EntryType, Category } from '../generated/prisma/enums';

export interface ChartDataPoint {
  date: string;
  rebate: number; // For Recharts display (float)
  withdrawn: number;
}

export interface MockLedgerEntry {
  id: string;
  userId: string;
  amount: bigint;
  type: EntryType;
  category: Category;
  referenceId: string | null;
  createdAt: Date;
}

/**
 * Generates mock data for Recharts AreaChart.
 * Returns last 30 days of rebate and withdrawal activity.
 */
export const getMockChartData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Random values for demonstration
    // Rebates: $0.00 to $50.00
    // Withdrawals: Occasional $10.00 to $100.00
    data.push({
      date: date.toISOString().split('T')[0],
      rebate: Math.floor(Math.random() * 5000) / 100,
      withdrawn: Math.random() > 0.85 ? Math.floor(Math.random() * 10000) / 100 : 0,
    });
  }

  return data;
};

/**
 * Generates mock ledger entries for a user.
 */
export const getMockLedgerEntries = (userId: string = 'mock-user-id'): MockLedgerEntry[] => {
  const entries: MockLedgerEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    const isRebate = Math.random() > 0.3;
    const amount = BigInt(Math.floor(Math.random() * 10000) + 1000); // 1000 - 11000 cents ($10 - $110)

    entries.push({
      id: `ledger-${i}-${Math.random().toString(36).substring(7)}`,
      userId,
      amount: amount,
      type: isRebate ? EntryType.CREDIT : EntryType.DEBIT,
      category: isRebate ? Category.REBATE : Category.WITHDRAWAL,
      referenceId: isRebate ? `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : null,
      createdAt: new Date(now.getTime() - i * 1.5 * 24 * 60 * 60 * 1000), // Spaced out
    });
  }

  // Sort by date descending
  return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};
