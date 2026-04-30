import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as adminService from './admin.service';
import prisma from '@/lib/prisma';
import * as emailVerificationService from './emailVerification.service';

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    actionToken: {
      deleteMany: vi.fn(),
    },
    ledger: {
      groupBy: vi.fn(),
    },
  },
}));

vi.mock('./emailVerification.service', () => ({
  sendVerificationEmail: vi.fn(),
}));

describe('AdminService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return users with their balances', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1', email: 'user1@example.com', isDisabled: false, isEmailVerified: true },
        { id: '2', name: 'User 2', email: 'user2@example.com', isDisabled: true, isEmailVerified: false },
      ];

      const mockBalances = [
        { userId: '1', type: 'CREDIT', _sum: { amount: BigInt(1000) } },
      ];

      (prisma.user.findMany as any).mockResolvedValue(mockUsers);
      (prisma.ledger.groupBy as any).mockResolvedValue(mockBalances);

      const result = await adminService.getUsers();

      expect(result).toHaveLength(2);
      expect(result[0].balance).toBe('10.00');
      expect(result[1].balance).toBe('0.00');
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('toggleUserDisabled', () => {
    it('should flip the isDisabled flag', async () => {
      const mockUser = { id: '1', isDisabled: false };
      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (prisma.user.update as any).mockResolvedValue({ ...mockUser, isDisabled: true });

      const result = await adminService.toggleUserDisabled('1');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isDisabled: true },
      });
      expect(result.isDisabled).toBe(true);
    });
  });

  describe('triggerManualResendVerification', () => {
    it('should invalidate old tokens and send new email', async () => {
      const mockUser = { id: '1', email: 'user1@example.com' };
      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      await adminService.triggerManualResendVerification('1');

      expect(prisma.actionToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: '1', tokenType: 'EMAIL_VERIFICATION' },
      });
      expect(emailVerificationService.sendVerificationEmail).toHaveBeenCalledWith('1', 'user1@example.com');
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      await expect(adminService.triggerManualResendVerification('1')).rejects.toThrow('User not found');
    });
  });
});
