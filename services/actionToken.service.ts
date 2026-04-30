import prisma, { DB } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export async function createToken(userId: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET', tx?: DB) {
  const rawToken = randomBytes(16).toString('hex');
  const hash = await bcrypt.hash(rawToken, 12);

  const ttl = type === 'EMAIL_VERIFICATION' ? 24 : 1;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + ttl);

  await (tx || prisma).actionToken.create({
    data: {
      userId,
      tokenType: type,
      token: hash,
      expiresAt
    }
  });

  return rawToken;
}

export async function validateToken(userId: string, token: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET', tx?: DB) {
  const db = tx || prisma;
  const actionToken = await db.actionToken.findFirst({
    where: {
      userId,
      tokenType: type,
      consumedAt: null,
      expiresAt: {
        gt: new Date()
      }
    }
  });

  if (!actionToken) {
    return { success: false, error: 'Invalid or expired token' };
  }

  const isMatch = await bcrypt.compare(token, actionToken.token);
  if (!isMatch) {
    return { success: false, error: 'Invalid or expired token' };
  }

  await db.actionToken.update({
    where: { id: actionToken.id },
    data: { consumedAt: new Date() }
  });

  return { success: true };
}
