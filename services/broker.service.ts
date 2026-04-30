import prisma, { DB } from '@/lib/prisma';
import { IB_MAPPING } from '@/config/ib-mapping';
import * as TicketService from './ticket.service';

/**
 * Links an MT5 account to a user and creates a verification ticket.
 *
 * @param userId - The ID of the user linking the account
 * @param mt5AccountNo - The MT5 account number
 * @param countryCode - The country code selected by the user
 * @param tx - Optional transaction client
 * @returns The created broker account and ticket
 * @throws Error if validation fails or account is already linked
 */
export async function linkAccount(userId: string, mt5AccountNo: string, countryCode: string, tx?: DB) {
  // 1. Validate mt5AccountNo (numeric, length check)
  if (!/^\d+$/.test(mt5AccountNo)) {
    throw new Error('MT5 Account Number must be numeric');
  }
  if (mt5AccountNo.length < 5) {
    throw new Error('MT5 Account Number must be at least 5 digits');
  }

  const db = tx || prisma;

  // 2. Check if mt5AccountNo is already linked
  const existing = await db.brokerAccount.findUnique({
    where: { mt5AccountNo },
  });

  if (existing) {
    throw new Error('This MT5 account is already linked to a user');
  }

  const ibConfig = IB_MAPPING.find(m => m.countryCode === countryCode);
  if (!ibConfig) {
    throw new Error('Invalid country code');
  }

  const performLinkage = async (client: DB) => {
    // 3. Create BrokerAccount
    const brokerAccount = await client.brokerAccount.create({
      data: {
        userId,
        mt5AccountNo,
        status: 'PENDING',
      },
    });

    // 4. Create Ticket using TicketService
    const ticket = await TicketService.createAccountVerificationTicket(userId, {
      mt5AccountNo,
      broker: ibConfig.countryName,
      countryCode,
      ibUrl: ibConfig.ibUrl,
    }, client);

    return { brokerAccount, ticket };
  };

  if (tx) {
    return await performLinkage(tx);
  } else {
    return await prisma.$transaction(async (pTx) => {
      return await performLinkage(pTx);
    });
  }
}

/**
 * Checks if a user has any linked broker accounts.
 * Used for dashboard route guards.
 *
 * @param userId - The ID of the user to check
 * @param tx - Optional transaction client
 * @returns Boolean indicating if the user has any linked accounts
 */
export async function hasLinkedAccount(userId: string, tx?: DB) {
  const count = await (tx || prisma).brokerAccount.count({
    where: { userId },
  });
  return count > 0;
}

/**
 * Gets all broker accounts for a user.
 *
 * @param userId - The ID of the user to check
 * @param tx - Optional transaction client
 * @returns Array of broker accounts
 */
export async function getBrokerAccounts(userId: string, tx?: DB) {
  return await (tx || prisma).brokerAccount.findMany({
    where: { userId },
  });
}

/**
 * Gets the IB URL and name for a given country code.
 *
 * @param countryCode - The country code to look up
 * @returns The IB configuration or null if not found
 */
export function getIbUrl(countryCode: string) {
  const config = IB_MAPPING.find((m) => m.countryCode === countryCode);
  if (!config) return null;
  return {
    ibUrl: config.ibUrl,
    ibName: config.countryName, // Using countryName as ibName for now
  };
}
