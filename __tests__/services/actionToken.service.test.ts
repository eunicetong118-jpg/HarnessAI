import { createToken } from '@/services/actionToken.service';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    actionToken: {
      create: jest.fn()
    }
  }
}));

describe('ActionToken Service', () => {
  it('hashes token and stores with TTL', async () => {
    const userId = 'user-1';
    const rawToken = await createToken(userId, 'EMAIL_VERIFICATION');

    expect(rawToken).toBeDefined();
    expect(rawToken.length).toBeGreaterThan(0);
    expect(prisma.actionToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId,
          tokenType: 'EMAIL_VERIFICATION',
          token: expect.any(String),
          expiresAt: expect.any(Date)
        })
      })
    );

    // Verify hashing works (stored token != raw token)
    const callArgs = (prisma.actionToken.create as jest.Mock).mock.calls[0][0];
    const storedHash = callArgs.data.token;
    const isMatch = await bcrypt.compare(rawToken, storedHash);
    expect(isMatch).toBe(true);
  });
});
