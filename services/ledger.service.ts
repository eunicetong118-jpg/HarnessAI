import prisma, { DB } from '@/lib/prisma';

/**
 * Gets the balance summary for a user.
 * Returns amounts in cents (BigInt).
 *
 * @param userId - The ID of the user
 * @param tx - Optional transaction client
 * @returns { totalEarned: bigint, available: bigint, pending: bigint }
 */
export async function getBalance(userId: string, tx?: DB) {
  const db = tx || prisma;
  // Aggregate ledger entries by type and category
  // EntryType: CREDIT, DEBIT
  // Category: REBATE, WITHDRAWAL, FEE

  const aggregate = await db.ledger.groupBy({
    by: ['type', 'category'],
    where: { userId },
    _sum: {
      amount: true,
    },
  });

  let totalEarned = BigInt(0);
  let totalCredit = BigInt(0);
  let totalDebit = BigInt(0);

  aggregate.forEach((group) => {
    const amount = group._sum.amount || BigInt(0);

    if (group.type === 'CREDIT') {
      totalCredit += amount;
      if (group.category === 'REBATE') {
        totalEarned += amount;
      }
    } else if (group.type === 'DEBIT') {
      totalDebit += amount;
    }
  });

  const available = totalCredit - totalDebit;

  // Pending rebates are trades not yet processed into the ledger.
  // In the current schema, we don't have a 'PENDING' ledger entry.
  // For now, we return 0 or can be extended when Trade model is added.
  const pending = BigInt(0);

  return {
    totalEarned,
    available,
    pending,
  };
}

/**
 * Records a rebate credit for a user.
 */
export async function recordRebateCredit(userId: string, amount: bigint, referenceId?: string, tx?: DB) {
  return await (tx || prisma).ledger.create({
    data: {
      userId,
      amount,
      type: 'CREDIT',
      category: 'REBATE',
      referenceId: referenceId || `REB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
  });
}

/**
 * Executes a withdrawal debit for a user.
 * Validates available balance first.
 */
export async function executeWithdrawalDebit(userId: string, amount: bigint, referenceId: string, tx?: DB) {
  const db = tx || prisma;

  // Validate balance
  const { available } = await getBalance(userId, db);
  if (available < amount) {
    throw new Error('Insufficient funds');
  }

  return await db.ledger.create({
    data: {
      userId,
      amount,
      type: 'DEBIT',
      category: 'WITHDRAWAL',
      referenceId,
    },
  });
}

/**
 * Inserts a credit entry into the ledger.
 * @deprecated Use recordRebateCredit for rebates.
 */
export async function insertCredit(userId: string, amount: bigint, category: 'REBATE' | 'FEE', referenceId?: string, tx?: DB) {
  return await (tx || prisma).ledger.create({
    data: {
      userId,
      amount,
      type: 'CREDIT',
      category,
      referenceId,
    },
  });
}

/**
 * Inserts a debit entry into the ledger.
 * @deprecated Use executeWithdrawalDebit for withdrawals.
 */
export async function insertDebit(userId: string, amount: bigint, category: 'WITHDRAWAL' | 'FEE', referenceId?: string, tx?: DB) {
  return await (tx || prisma).ledger.create({
    data: {
      userId,
      amount,
      type: 'DEBIT',
      category,
      referenceId,
    },
  });
}

/**
 * Gets paginated ledger history for a user.
 */
export async function getHistory(userId: string, page: number = 1, pageSize: number = 10, tx?: DB) {
  const db = tx || prisma;
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    db.ledger.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    db.ledger.count({
      where: { userId },
    }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
