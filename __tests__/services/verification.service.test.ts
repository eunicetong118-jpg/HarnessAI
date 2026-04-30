import { parseCsv, bulkVerify } from '@/services/verification.service';
import prisma from '@/lib/prisma';
import { Readable } from 'stream';

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
      await prisma.brokerAccount.deleteMany();
      await prisma.ticket.deleteMany();
      await prisma.user.deleteMany();
    });

    it('should verify matching accounts and close associated tickets', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
        },
      });

      await prisma.brokerAccount.createMany({
        data: [
          { userId: user.id, mt5AccountNo: '123', status: 'PENDING' },
          { userId: user.id, mt5AccountNo: '456', status: 'PENDING' },
          { userId: user.id, mt5AccountNo: '789', status: 'VERIFIED' },
        ],
      });

      await prisma.ticket.create({
        data: {
          userId: user.id,
          type: 'VERIFICATION',
          status: 'PENDING',
          content: 'Verify 123',
          metadata: { mt5AccountNo: '123' },
        },
      });

      const results = await bulkVerify(['123', '456', '789', '000']);

      expect(results.verified).toBe(2); // 123 and 456
      expect(results.alreadyVerified).toBe(1); // 789
      expect(results.notFound).toBe(1); // 000

      const acc123 = await prisma.brokerAccount.findUnique({ where: { mt5AccountNo: '123' } });
      expect(acc123?.status).toBe('VERIFIED');

      const ticket123 = await prisma.ticket.findFirst({
        where: { metadata: { path: ['mt5AccountNo'], equals: '123' } },
      });
      expect(ticket123?.status).toBe('DONE');
    });
  });
});
