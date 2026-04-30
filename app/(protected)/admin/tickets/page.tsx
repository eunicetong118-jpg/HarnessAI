import { auth } from '@/lib/auth';
import { getTickets } from '@/services/ticket.service';
import { TicketTable } from '@/components/admin/TicketTable';
import { TicketType } from '@/generated/prisma/client';

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  const currentAdminId = session?.user?.id as string;

  const { tab } = await searchParams;
  const activeTab = tab || 'VERIFICATION';

  const tickets = await getTickets({
    type: activeTab as TicketType,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ticket Command Center</h2>
          <p className="text-sm text-gray-500">Manage user verification and withdrawal requests</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <a
          href="?tab=VERIFICATION"
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'VERIFICATION'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Verifications
        </a>
        <a
          href="?tab=WITHDRAWAL"
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'WITHDRAWAL'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Withdrawals
        </a>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <TicketTable tickets={tickets as any} currentAdminId={currentAdminId} />
      </div>
    </div>
  );
}
