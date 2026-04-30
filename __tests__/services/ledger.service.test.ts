import { getBalance, insertCredit, insertDebit, getHistory } from '@/services/ledger.service';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    ledger: {
      groupBy: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('Ledger Service', () => {
  const userId = 'user-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBalance', () => {
    it('calculates totalEarned and available balance correctly', async () => {
      (prisma.ledger.groupBy as any).mockResolvedValue([
        {
          type: 'CREDIT',
          category: 'REBATE',
          _sum: { amount: BigInt(10000) }, // $100.00
        },
        {
          type: 'CREDIT',
          category: 'REBATE',
          _sum: { amount: BigInt(5000) }, // $50.00
        },
        {
          type: 'DEBIT',
          category: 'WITHDRAWAL',
          _sum: { amount: BigInt(3000) }, // $30.00
        }
      ]);

      const result = await getBalance(userId);

      // totalEarned = 10000 + 5000 = 15000
      // available = (10000 + 5000) - 3000 = 12000
      expect(result.totalEarned).toBe(BigInt(15000));
      expect(result.available).toBe(BigInt(12000));
      expect(result.pending).toBe(BigInt(0));
    });

    it('returns zero balances if no ledger entries exist', async () => {
      (prisma.ledger.groupBy as any).mockResolvedValue([]);

      const result = await getBalance(userId);

      expect(result.totalEarned).toBe(BigInt(0));
      expect(result.available).toBe(BigInt(0));
      expect(result.pending).toBe(BigInt(0));
    });
  });

  describe('insertCredit', () => {
    it('creates a credit ledger entry', async () => {
      const amount = BigInt(1000);
      (prisma.ledger.create as any).mockResolvedValue({ id: 'l-1' });

      await insertCredit(userId, amount, 'REBATE', 'ref-1');

      expect(prisma.ledger.create).toHaveBeenCalledWith({
        data: {
          userId,
          amount,
          type: 'CREDIT',
          category: 'REBATE',
          referenceId: 'ref-1',
        },
      });
    });
  });

  describe('insertDebit', () => {
    it('creates a debit ledger entry', async () => {
      const amount = BigInt(500);
      (prisma.ledger.create as any).mockResolvedValue({ id: 'l-2' });

      await insertDebit(userId, amount, 'WITHDRAWAL', 'ref-2');

      expect(prisma.ledger.create).toHaveBeenCalledWith({
        data: {
          userId,
          amount,
          type: 'DEBIT',
          category: 'WITHDRAWAL',
          referenceId: 'ref-2',
        },
      });
    });
  });

  describe('getHistory', () => {
    it('returns paginated ledger history', async () => {
      const items = [{ id: 'l-1' }, { id: 'l-2' }];
      (prisma.ledger.findMany as any).mockResolvedValue(items);
      (prisma.ledger.count as any).mockResolvedValue(20);

      const result = await getHistory(userId, 2, 5);

      expect(prisma.ledger.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: 5,
        take: 5,
      });
      expect(result.items).toBe(items);
      expect(result.total).toBe(20);
      expect(result.totalPages).toBe(4);
    });
  });
});
