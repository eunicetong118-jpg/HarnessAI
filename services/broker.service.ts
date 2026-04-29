import prisma from '@/lib/prisma';
import { IB_MAPPING } from '@/config/ib-mapping';

/**
 * Links an MT5 account to a user and creates a verification ticket.
 *
 * @param userId - The ID of the user linking the account
 * @param mt5AccountNo - The MT5 account number
 * @param countryCode - The country code selected by the user
 * @returns The created broker account and ticket
 * @throws Error if validation fails or account is already linked
 */
export async function linkAccount(userId: string, mt5AccountNo: string, countryCode: string) {
  // 1. Validate mt5AccountNo (numeric, length check)
  if (!/^\d+$/.test(mt5AccountNo)) {
    throw new Error('MT5 Account Number must be numeric');
  }
  if (mt5AccountNo.length < 5) {
    throw new Error('MT5 Account Number must be at least 5 digits');
  }

  // 2. Check if mt5AccountNo is already linked
  const existing = await prisma.brokerAccount.findUnique({
    where: { mt5AccountNo },
  });

  if (existing) {
    throw new Error('This MT5 account is already linked to a user');
  }

  const ibConfig = IB_MAPPING.find(m => m.countryCode === countryCode);
  if (!ibConfig) {
    throw new Error('Invalid country code');
  }

  // 3. Create BrokerAccount and Ticket in a transaction
  return await prisma.$transaction(async (tx) => {
    const brokerAccount = await tx.brokerAccount.create({
      data: {
        userId,
        mt5AccountNo,
        status: 'PENDING',
      },
    });

    const ticket = await tx.ticket.create({
      data: {
        userId,
        type: 'VERIFICATION',
        status: 'PENDING',
        content: `MT5 Account Linkage Request: ${mt5AccountNo} (${ibConfig.countryName})`,
        metadata: {
          mt5AccountNo,
          countryCode,
          ibUrl: ibConfig.ibUrl,
        },
      },
    });

    return { brokerAccount, ticket };
  });
}

/**
 * Checks if a user has any linked broker accounts.
 * Used for dashboard route guards.
 *
 * @param userId - The ID of the user to check
 * @returns Boolean indicating if the user has any linked accounts
 */
export async function hasLinkedAccount(userId: string) {
  const count = await prisma.brokerAccount.count({
    where: { userId },
  });
  return count > 0;
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
