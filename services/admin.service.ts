import prisma, { DB } from '@/lib/prisma';
import { sendVerificationEmail } from './emailVerification.service';

/**
 * Returns a list of all users with their calculated balances.
 */
export async function getUsers(tx?: DB) {
  const db = tx || prisma;
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const aggregates = await db.ledger.groupBy({
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
export async function toggleUserDisabled(userId: string, tx?: DB) {
  const db = tx || prisma;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isDisabled: true },
  });

  if (!user) throw new Error('User not found');

  return await db.user.update({
    where: { id: userId },
    data: { isDisabled: !user.isDisabled },
  });
}

/**
 * Manually triggers a verification email resend.
 * Invalidates any existing verification tokens for the user first.
 */
export async function triggerManualResendVerification(userId: string, tx?: DB) {
  const db = tx || prisma;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user) throw new Error('User not found');

  const performCleanup = async (client: DB) => {
    // Invalidate old tokens
    await client.actionToken.deleteMany({
      where: {
        userId,
        tokenType: 'EMAIL_VERIFICATION',
      },
    });
  };

  if (tx) {
    await performCleanup(tx);
  } else {
    await prisma.$transaction(async (pTx) => {
      await performCleanup(pTx);
    });
  }

  // Send new email (this creates a new token internally)
  // Outside transaction to avoid timeout from SMTP network delay
  await sendVerificationEmail(user.id, user.email);
}
