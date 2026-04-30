import { createToken, validateToken } from '@/services/actionToken.service';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    actionToken: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn()
    }
  }
}));

describe('ActionToken Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hashes token and stores with TTL', async () => {
    // ... existing test code ...
  });

  describe('validateToken', () => {
    const userId = 'user-1';
    const type = 'EMAIL_VERIFICATION';

    it('returns success and consumes token if valid', async () => {
      const rawToken = 'raw-token-123';
      const hash = await bcrypt.hash(rawToken, 12);

      (prisma.actionToken.findFirst as any).mockResolvedValue({
        id: 'token-id',
        userId,
        token: hash,
        expiresAt: new Date(Date.now() + 10000), // 10s from now
        consumedAt: null
      });

      const result = await validateToken(userId, rawToken, type);

      expect(result).toEqual({ success: true });
      expect(prisma.actionToken.update).toHaveBeenCalledWith({
        where: { id: 'token-id' },
        data: { consumedAt: expect.any(Date) }
      });
    });

    it('returns false if token not found or already consumed', async () => {
      (prisma.actionToken.findFirst as any).mockResolvedValue(null);

      const result = await validateToken(userId, 'any-token', type);
      expect(result).toEqual({ success: false, error: 'Invalid or expired token' });
    });

    it('returns false if token is expired', async () => {
      (prisma.actionToken.findFirst as any).mockResolvedValue({
        id: 'token-id',
        userId,
        token: 'some-hash',
        expiresAt: new Date(Date.now() - 10000), // 10s ago
        consumedAt: null
      });

      const result = await validateToken(userId, 'any-token', type);
      expect(result).toEqual({ success: false, error: 'Invalid or expired token' });
    });

    it('returns false if token hash does not match', async () => {
      const hash = await bcrypt.hash('different-token', 12);

      (prisma.actionToken.findFirst as any).mockResolvedValue({
        id: 'token-id',
        userId,
        token: hash,
        expiresAt: new Date(Date.now() + 10000),
        consumedAt: null
      });

      const result = await validateToken(userId, 'raw-token', type);
      expect(result).toEqual({ success: false, error: 'Invalid or expired token' });
    });
  });
});
