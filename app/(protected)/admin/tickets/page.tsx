import { auth } from '@/lib/auth';
import { getTickets } from '@/services/ticket.service';
import { TicketTable } from '@/components/admin/TicketTable';
import { TicketType } from '@/generated/prisma/client';
import { BulkVerifyDialog } from '@/components/admin/BulkVerifyDialog';

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
          <h2 className="text-2xl font-bold text-white">Ticket Command Center</h2>
          <p className="text-sm text-gray-400">Manage user verification and withdrawal requests</p>
        </div>
        {activeTab === 'VERIFICATION' && <BulkVerifyDialog />}
      </div>

      <div className="flex border-b border-white/10">
        <a
          href="?tab=VERIFICATION"
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'VERIFICATION'
              ? 'border-design-pink text-design-pink'
              : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
          }`}
        >
          Verifications
        </a>
        <a
          href="?tab=WITHDRAWAL"
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'WITHDRAWAL'
              ? 'border-design-pink text-design-pink'
              : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
          }`}
        >
          Withdrawals
        </a>
      </div>

      <div className="bg-design-card shadow-xl rounded-xl overflow-hidden border border-white/5">
        <TicketTable tickets={tickets as any} currentAdminId={currentAdminId} />
      </div>
    </div>
  );
}
