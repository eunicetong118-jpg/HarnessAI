import { RebateService, NormalizedTrade } from '@/services/rebate.service';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';

// Define mocks in the outer scope
const mockProcessedTradeCreateMany = jest.fn().mockResolvedValue({ count: 0 });
const mockLedgerCreate = jest.fn().mockResolvedValue({ id: 'l1' });

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    brokerAccount: {
      findUnique: jest.fn(),
    },
    processedTrade: {
      findMany: jest.fn(),
      createMany: mockProcessedTradeCreateMany,
    },
    ledger: {
      create: mockLedgerCreate,
    },
    $transaction: jest.fn(async (cb) => {
      const tx = {
        processedTrade: {
          createMany: mockProcessedTradeCreateMany,
        },
        ledger: {
          create: mockLedgerCreate,
        },
      };
      return await cb(tx);
    }),
  },
}));

// Mock XLSX
jest.mock('xlsx', () => ({
  read: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}));

describe('RebateService', () => {
  const mockBuffer = Buffer.from('test');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse a valid CSV/Excel buffer and return normalized trades', async () => {
    // Mock XLSX to return sample data
    const mockData = [
      { tradeId: 'T100', mt5AccountNo: '123456', volume: 1.5, rebatePerLot: 5.0 },
      { tradeId: 'T101', mt5AccountNo: '654321', volume: 0.5, rebatePerLot: 10.0 },
    ];

    (XLSX.read as jest.Mock).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} },
    });

    (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);

    // Mock Prisma lookups
    (prisma.brokerAccount.findUnique as jest.Mock).mockImplementation(({ where }) => {
      if (where.mt5AccountNo === '123456') {
        return Promise.resolve({
          userId: 'user-1',
          status: 'VERIFIED',
          isActive: true,
        });
      }
      if (where.mt5AccountNo === '654321') {
        return Promise.resolve({
          userId: 'user-2',
          status: 'VERIFIED',
          isActive: true,
        });
      }
      return Promise.resolve(null);
    });

    const results = await RebateService.ingestTrades(mockBuffer);

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      tradeId: 'T100',
      mt5AccountNo: '123456',
      volume: 1.5,
      rebatePerLot: 5.0,
      userId: 'user-1',
      amountInCents: BigInt(600), // 1.5 * 5.0 * 0.8 * 100
    });
    expect(results[1]).toEqual({
      tradeId: 'T101',
      mt5AccountNo: '654321',
      volume: 0.5,
      rebatePerLot: 10.0,
      userId: 'user-2',
      amountInCents: BigInt(400), // 0.5 * 10.0 * 0.8 * 100
    });
  });

  it('should skip rows with unknown MT5 accounts', async () => {
    const mockData = [
      { tradeId: 'T102', mt5AccountNo: 'unknown', volume: 1.0, rebatePerLot: 5.0 },
    ];

    (XLSX.read as jest.Mock).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} },
    });

    (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    (prisma.brokerAccount.findUnique as jest.Mock).mockResolvedValue(null);

    const results = await RebateService.ingestTrades(mockBuffer);
    expect(results).toHaveLength(0);
  });

  it('should skip rows with unverified MT5 accounts', async () => {
    const mockData = [
      { tradeId: 'T103', mt5AccountNo: '999999', volume: 1.0, rebatePerLot: 5.0 },
    ];

    (XLSX.read as jest.Mock).mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} },
    });

    (XLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    (prisma.brokerAccount.findUnique as jest.Mock).mockResolvedValue({
      userId: 'user-3',
      status: 'PENDING',
      isActive: true,
    });

    const results = await RebateService.ingestTrades(mockBuffer);
    expect(results).toHaveLength(0);
  });

  describe('processBatch', () => {
    const trades: NormalizedTrade[] = [
      {
        tradeId: 'T100',
        mt5AccountNo: '123456',
        volume: 1.0,
        rebatePerLot: 10.0,
        userId: 'user-1',
        amountInCents: BigInt(800), // (1.0 * 10.0 * 0.8) * 100
      },
      {
        tradeId: 'T101',
        mt5AccountNo: '123456',
        volume: 2.0,
        rebatePerLot: 10.0,
        userId: 'user-1',
        amountInCents: BigInt(1600), // (2.0 * 10.0 * 0.8) * 100
      },
      {
        tradeId: 'T102',
        mt5AccountNo: '654321',
        volume: 1.0,
        rebatePerLot: 10.0,
        userId: 'user-2',
        amountInCents: BigInt(800),
      },
    ];

    it('should calculate individual rebates using 80% formula correctly', async () => {
      const rebate = RebateService.calculateRebate(1.5, 5.0);
      expect(rebate).toBe(BigInt(600)); // 1.5 * 5.0 * 0.8 * 100
    });

    it('should skip duplicate trade IDs that already exist in ProcessedTrade', async () => {
      (prisma.processedTrade.findMany as jest.Mock).mockResolvedValue([
        { tradeId: 'T100' },
      ]);

      const result = await RebateService.processBatch(trades);

      expect(result.processed).toBe(2); // T101, T102
      expect(result.skipped).toBe(1); // T100
      expect(result.totalCents).toBe(BigInt(1600 + 800));
    });

    it('should aggregate multiple trades for the same user into a single batch ledger entry', async () => {
      (prisma.processedTrade.findMany as jest.Mock).mockResolvedValue([]);

      await RebateService.processBatch(trades);

      // Should have 2 ledger entries: one for user-1 (T100+T101) and one for user-2 (T102)
      expect(mockLedgerCreate).toHaveBeenCalledTimes(2);

      // Verify user-1 aggregation: 800 + 1600 = 2400
      expect(mockLedgerCreate).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          amount: BigInt(2400),
          type: 'CREDIT',
          category: 'REBATE',
        }),
      }));
    });

    it('should insert ProcessedTrade records for every successfully processed tradeId', async () => {
      (prisma.processedTrade.findMany as jest.Mock).mockResolvedValue([]);

      await RebateService.processBatch(trades);

      expect(mockProcessedTradeCreateMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          { tradeId: 'T100', userId: 'user-1' },
          { tradeId: 'T101', userId: 'user-1' },
          { tradeId: 'T102', userId: 'user-2' },
        ]),
      });
    });
  });
});
