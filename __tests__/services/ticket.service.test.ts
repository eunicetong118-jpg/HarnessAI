import { getTickets, claimTicket, resolveTicket } from '@/services/ticket.service';
import prisma from '@/lib/prisma';

// Use strings instead of enums from the generated client to avoid Jest issues with ESM in Prisma client
const TicketStatus = {
  PENDING: 'PENDING',
  DONE: 'DONE'
} as const;

const TicketType = {
  WITHDRAWAL: 'WITHDRAWAL',
  VERIFICATION: 'VERIFICATION'
} as const;

vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    ticket: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    brokerAccount: {
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

describe('Ticket Service', () => {
  const adminId = 'admin-1';
  const ticketId = 'ticket-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTickets', () => {
    it('fetches tickets with filters and user details', async () => {
      const mockTickets = [
        { id: '1', status: 'PENDING', type: 'WITHDRAWAL', user: { name: 'User 1', email: 'user1@example.com' } },
      ];
      (prisma.ticket.findMany as any).mockResolvedValue(mockTickets);

      const result = await getTickets({ status: TicketStatus.PENDING, type: TicketType.WITHDRAWAL });

      expect(prisma.ticket.findMany).toHaveBeenCalledWith({
        where: {
          status: TicketStatus.PENDING,
          type: TicketType.WITHDRAWAL,
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
      expect(result).toEqual(mockTickets);
    });
  });

  describe('claimTicket', () => {
    it('sets assigneeUserId to current admin ID', async () => {
      (prisma.ticket.update as any).mockResolvedValue({ id: ticketId, assigneeUserId: adminId });

      await claimTicket(ticketId, adminId);

      expect(prisma.ticket.update).toHaveBeenCalledWith({
        where: { id: ticketId },
        data: { assigneeUserId: adminId },
      });
    });
  });

  describe('resolveTicket', () => {
    it('sets status to DONE and sets closedAt', async () => {
      (prisma.ticket.findUnique as any).mockResolvedValue({
        id: ticketId,
        type: TicketType.WITHDRAWAL,
      });

      await resolveTicket(ticketId, adminId);

      expect(prisma.ticket.update).toHaveBeenCalledWith({
        where: { id: ticketId },
        data: expect.objectContaining({
          status: TicketStatus.DONE,
          closedAt: expect.any(Date),
          assigneeUserId: adminId,
        }),
      });
    });

    it('verifies BrokerAccount if ticket type is VERIFICATION', async () => {
      const mt5AccountNo = '12345';
      (prisma.ticket.findUnique as any).mockResolvedValue({
        id: ticketId,
        type: TicketType.VERIFICATION,
        metadata: { mt5AccountNo },
      });

      await resolveTicket(ticketId, adminId);

      expect(prisma.brokerAccount.update).toHaveBeenCalledWith({
        where: { mt5AccountNo },
        data: {
          status: 'VERIFIED',
          verifiedAt: expect.any(Date),
        },
      });
      expect(prisma.ticket.update).toHaveBeenCalled();
    });
  });
});
