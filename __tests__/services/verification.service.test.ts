import { parseCsv, bulkVerify } from '@/services/verification.service';
import prisma from '@/lib/prisma';
import { Readable } from 'stream';

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    brokerAccount: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    ticket: {
      deleteMany: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
    },
    user: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

describe('VerificationService', () => {
  describe('parseCsv', () => {
    it('should extract mt5AccountNo from CSV stream', async () => {
      const csvContent = 'mt5AccountNo\n12345\n67890\n';
      const stream = Readable.from([csvContent]);
      const result = await parseCsv(stream);
      expect(result).toEqual(['12345', '67890']);
    });

    it('should handle CSV without header if it only contains numbers', async () => {
      const csvContent = '11111\n22222\n';
      const stream = Readable.from([csvContent]);
      const result = await parseCsv(stream);
      expect(result).toContain('11111');
      expect(result).toContain('22222');
    });
  });

  describe('bulkVerify', () => {
    beforeEach(async () => {
      vi.clearAllMocks();
    });

    it('should verify matching accounts and close associated tickets', async () => {
      const user = { id: 'user-1', name: 'Test User', email: 'test@example.com' };
      (prisma.user.create as any).mockResolvedValue(user);

      (prisma.brokerAccount.findUnique as any).mockImplementation(({ where }: any) => {
        if (where.mt5AccountNo === '123') return Promise.resolve({ id: 'acc-123', status: 'PENDING' });
        if (where.mt5AccountNo === '456') return Promise.resolve({ id: 'acc-456', status: 'PENDING' });
        if (where.mt5AccountNo === '789') return Promise.resolve({ id: 'acc-789', status: 'VERIFIED' });
        return Promise.resolve(null);
      });

      (prisma.ticket.findMany as any).mockResolvedValue([
        { id: 't-123', type: 'VERIFICATION', status: 'PENDING', metadata: { mt5AccountNo: '123' } }
      ]);

      const results = await bulkVerify(['123', '456', '789', '000']);

      expect(results.verified).toBe(2); // 123 and 456
      expect(results.alreadyVerified).toBe(1); // 789
      expect(results.notFound).toBe(1); // 000

      expect(prisma.brokerAccount.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'acc-123' },
        data: expect.objectContaining({ status: 'VERIFIED' })
      }));

      expect(prisma.ticket.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 't-123' },
        data: expect.objectContaining({ status: 'DONE' })
      }));
    });
  });
});
