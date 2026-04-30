import prisma, { DB } from '@/lib/prisma';
import type { TicketStatus, TicketType } from '@/generated/prisma/client';

/**
 * Fetches tickets based on status and type.
 * Includes user details (name, email).
 */
export async function getTickets(filters?: {
  status?: TicketStatus;
  type?: TicketType;
}, tx?: DB) {
  const db = tx || prisma;
  return await db.ticket.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.type && { type: filters.type }),
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      assigneeUser: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Claims a ticket for an admin.
 */
export async function claimTicket(ticketId: string, adminId: string, tx?: DB) {
  return await (tx || prisma).ticket.update({
    where: { id: ticketId },
    data: { assigneeUserId: adminId },
  });
}

/**
 * Creates an account verification ticket.
 */
export async function createAccountVerificationTicket(userId: string, data: { mt5AccountNo: string; broker: string; countryCode?: string; ibUrl?: string }, tx?: DB) {
  return await (tx || prisma).ticket.create({
    data: {
      userId,
      type: 'VERIFICATION',
      status: 'PENDING',
      content: `Account verification request for MT5: ${data.mt5AccountNo} (${data.broker})`,
      metadata: data as any,
    },
  });
}

/**
 * Creates a withdrawal ticket.
 */
export async function createWithdrawalTicket(userId: string, amount: bigint, tx?: DB) {
  return await (tx || prisma).ticket.create({
    data: {
      userId,
      type: 'WITHDRAWAL',
      status: 'PENDING',
      content: `Withdrawal request for ${amount.toString()} cents`,
      metadata: { amount: amount.toString() },
    },
  });
}

/**
 * Resolves a ticket and performs side effects (e.g., verifying accounts).
 */
export async function resolveTicket(ticketId: string, adminId: string, tx?: DB) {
  const db = tx || prisma;

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  const performResolution = async (client: DB) => {
    // Perform side effects based on ticket type
    if (ticket.type === 'VERIFICATION') {
      const metadata = ticket.metadata as any;
      if (metadata?.mt5AccountNo) {
        await client.brokerAccount.update({
          where: { mt5AccountNo: metadata.mt5AccountNo },
          data: {
            status: 'VERIFIED',
            verifiedAt: new Date(),
          },
        });
      }
    }

    // Mark ticket as DONE
    return await client.ticket.update({
      where: { id: ticketId },
      data: {
        status: 'DONE',
        closedAt: new Date(),
        assigneeUserId: adminId,
      },
    });
  };

  if (tx) {
    return await performResolution(tx);
  } else {
    return await prisma.$transaction(async (pTx) => {
      return await performResolution(pTx);
    });
  }
}
