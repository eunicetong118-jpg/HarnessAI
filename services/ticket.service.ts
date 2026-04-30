import prisma from '@/lib/prisma';
import type { TicketStatus, TicketType } from '@/generated/prisma/client';

/**
 * Fetches tickets based on status and type.
 * Includes user details (name, email).
 */
export async function getTickets(filters?: {
  status?: TicketStatus;
  type?: TicketType;
}) {
  return await prisma.ticket.findMany({
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
export async function claimTicket(ticketId: string, adminId: string) {
  return await prisma.ticket.update({
    where: { id: ticketId },
    data: { assigneeUserId: adminId },
  });
}

/**
 * Resolves a ticket and performs side effects (e.g., verifying accounts).
 */
export async function resolveTicket(ticketId: string, adminId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error('Ticket not found');
  }

  return await prisma.$transaction(async (tx) => {
    // Perform side effects based on ticket type
    if (ticket.type === 'VERIFICATION') {
      const metadata = ticket.metadata as any;
      if (metadata?.mt5AccountNo) {
        await tx.brokerAccount.update({
          where: { mt5AccountNo: metadata.mt5AccountNo },
          data: {
            status: 'VERIFIED',
            verifiedAt: new Date(),
          },
        });
      }
    }

    // Mark ticket as DONE
    return await tx.ticket.update({
      where: { id: ticketId },
      data: {
        status: 'DONE',
        closedAt: new Date(),
        assigneeUserId: adminId,
      },
    });
  });
}
