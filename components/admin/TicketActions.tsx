'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TicketStatus } from '@/generated/prisma/client';

interface TicketActionsProps {
  ticket: {
    id: string;
    status: TicketStatus;
    assigneeUserId: string | null;
  };
  currentAdminId: string;
}

export function TicketActions({ ticket, currentAdminId }: TicketActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClaim = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets/${ticket.id}/claim`, {
        method: 'PATCH',
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to claim ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets/${ticket.id}/resolve`, {
        method: 'PATCH',
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to resolve ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (ticket.status === 'DONE') {
    return <span className="text-gray-400">Resolved</span>;
  }

  return (
    <div className="flex space-x-2">
      {!ticket.assigneeUserId ? (
        <Button
          size="sm"
          onClick={handleClaim}
          disabled={isLoading}
        >
          Claim
        </Button>
      ) : ticket.assigneeUserId === currentAdminId ? (
        <Button
          size="sm"
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          onClick={handleResolve}
          disabled={isLoading}
        >
          Complete
        </Button>
      ) : (
        <span className="text-xs text-gray-500 italic">Assigned to another admin</span>
      )}
    </div>
  );
}
