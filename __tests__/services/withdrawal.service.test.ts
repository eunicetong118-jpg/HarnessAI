import { createWithdrawal, getWithdrawalHistory } from '@/services/withdrawal.service';
import prisma from '@/lib/prisma';
import { getBalance } from '@/services/ledger.service';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    ledger: {
      groupBy: jest.fn(),
      create: jest.fn(),
    },
    ticket: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

jest.mock('@/services/ledger.service', () => ({
  getBalance: jest.fn(),
}));

describe('Withdrawal Service', () => {
  const userId = 'user-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWithdrawal', () => {
    it('creates a withdrawal ticket and ledger entry when balance is sufficient', async () => {
      const amount = BigInt(5000); // $50.00
      (getBalance as jest.Mock).mockResolvedValue({ available: BigInt(10000) });
      (prisma.ticket.create as jest.Mock).mockResolvedValue({ id: 't-1' });
      (prisma.ledger.create as jest.Mock).mockResolvedValue({ id: 'l-1' });

      const result = await createWithdrawal(userId, amount);

      expect(getBalance).toHaveBeenCalledWith(userId);
      expect(prisma.ticket.create).toHaveBeenCalledWith({
        data: {
          userId,
          type: 'WITHDRAWAL',
          status: 'PENDING',
          content: 'Withdrawal request for $50',
          metadata: { amount: amount.toString() },
        },
      });
      expect(prisma.ledger.create).toHaveBeenCalledWith({
        data: {
          userId,
          amount,
          type: 'DEBIT',
          category: 'WITHDRAWAL',
          referenceId: 't-1',
        },
      });
      expect(result).toEqual({ id: 't-1' });
    });

    it('throws error when amount is zero or negative', async () => {
      await expect(createWithdrawal(userId, BigInt(0))).rejects.toThrow('Amount must be greater than zero');
      await expect(createWithdrawal(userId, BigInt(-100))).rejects.toThrow('Amount must be greater than zero');
    });

    it('throws error when balance is insufficient', async () => {
      const amount = BigInt(5000);
      (getBalance as jest.Mock).mockResolvedValue({ available: BigInt(3000) });

      await expect(createWithdrawal(userId, amount)).rejects.toThrow('Insufficient balance');
    });
  });

  describe('getWithdrawalHistory', () => {
    it('returns ticket history for withdrawal type', async () => {
      const mockTickets = [{ id: 't-1', type: 'WITHDRAWAL' }];
      (prisma.ticket.findMany as jest.Mock).mockResolvedValue(mockTickets);

      const result = await getWithdrawalHistory(userId);

      expect(prisma.ticket.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          type: 'WITHDRAWAL',
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTickets);
    });
  });
});
