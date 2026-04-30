'use client';

import { format } from 'date-fns';
import { TicketStatus, TicketType } from '@/generated/prisma/client';
import { TicketActions } from './TicketActions';

interface TicketWithUser {
  id: string;
  userId: string;
  assigneeUserId: string | null;
  type: TicketType;
  status: TicketStatus;
  content: string;
  metadata: any;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  assigneeUser: {
    name: string;
  } | null;
}

interface TicketTableProps {
  tickets: TicketWithUser[];
  currentAdminId: string;
}

export function TicketTable({ tickets, currentAdminId }: TicketTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assignee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-design-card divide-y divide-white/10">
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-400">
                No tickets found.
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{ticket.user.name}</div>
                  <div className="text-sm text-gray-400">{ticket.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ticket.type === 'WITHDRAWAL' ? 'bg-design-purple/10 text-design-purple' : 'bg-design-pink/10 text-design-pink'
                  }`}>
                    {ticket.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                  {ticket.type === 'WITHDRAWAL' ? (
                    <span className="text-white font-medium">${(Number(ticket.metadata?.amount || 0) / 100).toFixed(2)}</span>
                  ) : (
                    <span>MT5: {ticket.metadata?.mt5AccountNo || 'N/A'}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ticket.status === 'DONE' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {ticket.assigneeUser?.name || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <TicketActions ticket={ticket} currentAdminId={currentAdminId} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
