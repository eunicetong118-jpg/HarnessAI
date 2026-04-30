import prisma from '@/lib/prisma';
import { sendVerificationEmail } from './emailVerification.service';

/**
 * Returns a list of all users with their calculated balances.
 */
export async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const aggregates = await prisma.ledger.groupBy({
    by: ['userId', 'type'],
    where: {
      userId: { in: users.map((u) => u.id) },
    },
    _sum: {
      amount: true,
    },
  });

  const userBalances = new Map<string, bigint>();
  aggregates.forEach((agg) => {
    const current = userBalances.get(agg.userId) || BigInt(0);
    const amount = agg._sum.amount || BigInt(0);
    if (agg.type === 'CREDIT') {
      userBalances.set(agg.userId, current + amount);
    } else {
      userBalances.set(agg.userId, current - amount);
    }
  });

  return users.map((user) => {
    const balanceCents = userBalances.get(user.id) || BigInt(0);
    return {
      ...user,
      balance: (Number(balanceCents) / 100).toFixed(2),
    };
  });
}

/**
 * Toggles the isDisabled status of a user.
 */
export async function toggleUserDisabled(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isDisabled: true },
  });

  if (!user) throw new Error('User not found');

  return await prisma.user.update({
    where: { id: userId },
    data: { isDisabled: !user.isDisabled },
  });
}

/**
 * Manually triggers a verification email resend.
 * Invalidates any existing verification tokens for the user first.
 */
export async function triggerManualResendVerification(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) throw new Error('User not found');

  // Invalidate old tokens
  await prisma.actionToken.deleteMany({
    where: {
      userId,
      tokenType: 'EMAIL_VERIFICATION',
    },
  });

  // Send new email (this creates a new token internally)
  await sendVerificationEmail(user.id, user.email);
}
