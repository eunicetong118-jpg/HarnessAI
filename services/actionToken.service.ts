import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export async function createToken(userId: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET') {
  const rawToken = randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(rawToken, 12);

  const ttl = type === 'EMAIL_VERIFICATION' ? 24 : 1;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + ttl);

  await prisma.actionToken.create({
    data: {
      userId,
      tokenType: type,
      token: hash,
      expiresAt
    }
  });

  return rawToken;
}
