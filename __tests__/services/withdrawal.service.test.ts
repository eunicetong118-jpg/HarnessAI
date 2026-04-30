import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createWithdrawal, getWithdrawalHistory } from '@/services/withdrawal.service';
import prisma from '@/lib/prisma';
import * as LedgerService from '@/services/ledger.service';
import { SecurityService } from '@/services/security.service';
import * as TicketService from '@/services/ticket.service';

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
    ledger: {
      groupBy: vi.fn(),
      create: vi.fn(),
    },
    ticket: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback({
      ticket: { create: vi.fn().mockResolvedValue({ id: 't-1' }) },
      ledger: { create: vi.fn().mockResolvedValue({ id: 'l-1' }) },
    })),
  },
}));

vi.mock('@/services/ledger.service', () => ({
  getBalance: vi.fn(),
  executeWithdrawalDebit: vi.fn(),
}));

vi.mock('@/services/ticket.service', () => ({
  createWithdrawalTicket: vi.fn(),
}));

vi.mock('@/services/security.service', () => ({
  SecurityService: {
    verifySecurityCode: vi.fn(),
  },
}));

describe('Withdrawal Service', () => {
  const userId = 'user-1';

  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.user.findUnique as any).mockResolvedValue({ id: userId, totpEnabled: false });
    // Reset transaction mock to return a fresh set of mocks each time
    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      const mockTx = {
        ticket: { create: vi.fn().mockResolvedValue({ id: 't-1' }) },
        ledger: { create: vi.fn().mockResolvedValue({ id: 'l-1' }) },
        user: { findUnique: vi.fn().mockResolvedValue({ id: userId, totpEnabled: false }) },
      };
      return callback(mockTx);
    });

    (TicketService.createWithdrawalTicket as any).mockResolvedValue({ id: 't-1' });
    (LedgerService.executeWithdrawalDebit as any).mockResolvedValue({ id: 'l-1' });
  });

  describe('createWithdrawal', () => {
    it('creates a withdrawal ticket and ledger entry when balance is sufficient', async () => {
      const amount = BigInt(5000); // $50.00

      const result = await createWithdrawal(userId, amount);

      expect(TicketService.createWithdrawalTicket).toHaveBeenCalledWith(userId, amount, expect.anything());
      expect(LedgerService.executeWithdrawalDebit).toHaveBeenCalledWith(userId, amount, 't-1', expect.anything());
      expect(result).toEqual({ id: 't-1' });
    });

    it('throws 2FA_REQUIRED when 2FA is enabled but no code provided', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ id: userId, totpEnabled: true });

      await expect(createWithdrawal(userId, BigInt(1000))).rejects.toThrow('2FA_REQUIRED');
    });

    it('throws INVALID_2FA_CODE when security code is invalid', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ id: userId, totpEnabled: true });
      (SecurityService.verifySecurityCode as any).mockResolvedValue(false);

      await expect(createWithdrawal(userId, BigInt(1000), 'wrong')).rejects.toThrow('INVALID_2FA_CODE');
      expect(SecurityService.verifySecurityCode).toHaveBeenCalledWith(userId, 'wrong');
    });

    it('processes withdrawal when 2FA is enabled and valid code is provided', async () => {
      const amount = BigInt(5000);
      (prisma.user.findUnique as any).mockResolvedValue({ id: userId, totpEnabled: true });
      (SecurityService.verifySecurityCode as any).mockResolvedValue(true);

      const result = await createWithdrawal(userId, amount, '123456');

      expect(SecurityService.verifySecurityCode).toHaveBeenCalledWith(userId, '123456');
      expect(result).toEqual({ id: 't-1' });
    });

    it('throws error when amount is zero or negative', async () => {
      await expect(createWithdrawal(userId, BigInt(0))).rejects.toThrow('Amount must be greater than zero');
      await expect(createWithdrawal(userId, BigInt(-100))).rejects.toThrow('Amount must be greater than zero');
    });

    it('throws error when LedgerService throws insufficient funds', async () => {
      const amount = BigInt(5000);
      (LedgerService.executeWithdrawalDebit as any).mockRejectedValue(new Error('Insufficient funds'));

      await expect(createWithdrawal(userId, amount)).rejects.toThrow('Insufficient funds');
    });
  });

  describe('getWithdrawalHistory', () => {
    it('returns ticket history for withdrawal type', async () => {
      const mockTickets = [{ id: 't-1', type: 'WITHDRAWAL' }];
      (prisma.ticket.findMany as any).mockResolvedValue(mockTickets);

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
