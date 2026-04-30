import prisma, { DB } from '@/lib/prisma';
import * as LedgerService from '@/services/ledger.service';
import * as TicketService from '@/services/ticket.service';
import { SecurityService } from '@/services/security.service';

/**
 * Creates a withdrawal request.
 * Debits the amount from the available balance immediately.
 *
 * Requires 2FA verification if enabled for the user.
 *
 * @param userId - The ID of the user
 * @param amount - The amount to withdraw in cents (BigInt)
 * @param securityCode - (Optional) 2FA or Backup code
 * @param tx - Optional transaction client
 * @returns The created withdrawal ticket
 */
export async function createWithdrawal(userId: string, amount: bigint, securityCode?: string, tx?: DB) {
  if (amount <= BigInt(0)) {
    throw new Error('Amount must be greater than zero');
  }

  const db = tx || prisma;

  // 0. Verify 2FA if enabled
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { totpEnabled: true }
  });

  if (user?.totpEnabled) {
    if (!securityCode) {
      throw new Error('2FA_REQUIRED');
    }
    const isValid = await SecurityService.verifySecurityCode(userId, securityCode);
    if (!isValid) {
      throw new Error('INVALID_2FA_CODE');
    }
  }

  const performWithdrawal = async (client: DB) => {
    // 1. Create a Ticket using TicketService
    const ticket = await TicketService.createWithdrawalTicket(userId, amount, client);

    // 2. Execute Withdrawal Debit using LedgerService (includes balance check)
    await LedgerService.executeWithdrawalDebit(userId, amount, ticket.id, client);

    return ticket;
  };

  if (tx) {
    return await performWithdrawal(tx);
  } else {
    return await prisma.$transaction(async (pTx) => {
      return await performWithdrawal(pTx);
    });
  }
}

/**
 * Gets the withdrawal history for a user.
 *
 * @param userId - The ID of the user
 * @param tx - Optional transaction client
 * @returns Array of withdrawal tickets
 */
export async function getWithdrawalHistory(userId: string, tx?: DB) {
  return await (tx || prisma).ticket.findMany({
    where: {
      userId,
      type: 'WITHDRAWAL',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
