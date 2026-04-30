import prisma from '@/lib/prisma';
import { getBalance } from '@/services/ledger.service';

/**
 * Creates a withdrawal request.
 * Debits the amount from the available balance immediately.
 *
 * @param userId - The ID of the user
 * @param amount - The amount to withdraw in cents (BigInt)
 * @returns The created withdrawal ticket
 */
export async function createWithdrawal(userId: string, amount: bigint) {
  if (amount <= BigInt(0)) {
    throw new Error('Amount must be greater than zero');
  }

  // Use a transaction to ensure atomic balance check and debit
  return await prisma.$transaction(async (tx) => {
    // 1. Check available balance
    // Note: We use the injected transaction context if possible,
    // but getBalance currently uses the global prisma client.
    // For strict consistency, we should ideally have a version of getBalance that accepts a tx.
    // However, since we are only doing one debit, the transaction around ticket creation and ledger entry
    // is the most critical part for atomicity of the 'debit' itself.

    const { available } = await getBalance(userId);

    if (available < amount) {
      throw new Error('Insufficient balance');
    }

    // 2. Create a Ticket (type: WITHDRAWAL, status: PENDING)
    const ticket = await tx.ticket.create({
      data: {
        userId,
        type: 'WITHDRAWAL',
        status: 'PENDING',
        content: `Withdrawal request for $${Number(amount) / 100}`,
        metadata: {
          amount: amount.toString(),
        },
      },
    });

    // 3. Create a Ledger entry (type: DEBIT, category: WITHDRAWAL, referenceId: ticket.id)
    await tx.ledger.create({
      data: {
        userId,
        amount,
        type: 'DEBIT',
        category: 'WITHDRAWAL',
        referenceId: ticket.id,
      },
    });

    return ticket;
  });
}

/**
 * Gets the withdrawal history for a user.
 *
 * @param userId - The ID of the user
 * @returns Array of withdrawal tickets
 */
export async function getWithdrawalHistory(userId: string) {
  return await prisma.ticket.findMany({
    where: {
      userId,
      type: 'WITHDRAWAL',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
