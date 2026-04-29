import { linkAccount, hasLinkedAccount } from '@/services/broker.service';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    brokerAccount: {
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    ticket: {
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

describe('Broker Service', () => {
  const userId = 'user-1';
  const mt5AccountNo = '1234567';
  const countryCode = 'ID';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('linkAccount', () => {
    it('creates a BrokerAccount and a VERIFICATION ticket on success', async () => {
      (prisma.brokerAccount.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.brokerAccount.create as jest.Mock).mockResolvedValue({ id: 'ba-1', userId, mt5AccountNo });
      (prisma.ticket.create as jest.Mock).mockResolvedValue({ id: 't-1', userId, type: 'VERIFICATION' });

      const result = await linkAccount(userId, mt5AccountNo, countryCode);

      expect(prisma.brokerAccount.findUnique).toHaveBeenCalledWith({
        where: { mt5AccountNo },
      });
      expect(prisma.brokerAccount.create).toHaveBeenCalledWith({
        data: {
          userId,
          mt5AccountNo,
          status: 'PENDING',
        },
      });
      expect(prisma.ticket.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          type: 'VERIFICATION',
          status: 'PENDING',
          metadata: expect.objectContaining({
            mt5AccountNo,
            countryCode,
          }),
        }),
      });
      expect(result).toBeDefined();
      expect(result.brokerAccount.id).toBe('ba-1');
    });

    it('throws error if MT5 account number is not numeric', async () => {
      await expect(linkAccount(userId, 'abc123', countryCode)).rejects.toThrow(
        'MT5 Account Number must be numeric'
      );
    });

    it('throws error if MT5 account number is too short', async () => {
      await expect(linkAccount(userId, '123', countryCode)).rejects.toThrow(
        'MT5 Account Number must be at least 5 digits'
      );
    });

    it('throws error if MT5 account is already linked', async () => {
      (prisma.brokerAccount.findUnique as jest.Mock).mockResolvedValue({ id: 'existing' });

      await expect(linkAccount(userId, mt5AccountNo, countryCode)).rejects.toThrow(
        'This MT5 account is already linked to a user'
      );
    });

    it('throws error if country code is invalid', async () => {
      (prisma.brokerAccount.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(linkAccount(userId, mt5AccountNo, 'XX')).rejects.toThrow(
        'Invalid country code'
      );
    });
  });

  describe('hasLinkedAccount', () => {
    it('returns true if user has at least one broker account', async () => {
      (prisma.brokerAccount.count as jest.Mock).mockResolvedValue(1);
      const result = await hasLinkedAccount(userId);
      expect(result).toBe(true);
      expect(prisma.brokerAccount.count).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('returns false if user has no broker accounts', async () => {
      (prisma.brokerAccount.count as jest.Mock).mockResolvedValue(0);
      const result = await hasLinkedAccount(userId);
      expect(result).toBe(false);
    });
  });
});
