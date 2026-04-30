import { RebateService } from '../rebate.service';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    brokerAccount: {
      findUnique: jest.fn(),
    },
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
      amountInCents: BigInt(750), // 1.5 * 5.0 * 100
    });
    expect(results[1]).toEqual({
      tradeId: 'T101',
      mt5AccountNo: '654321',
      volume: 0.5,
      rebatePerLot: 10.0,
      userId: 'user-2',
      amountInCents: BigInt(500), // 0.5 * 10.0 * 100
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
});
