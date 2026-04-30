'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isDisabled: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  balance: string;
}

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleToggleStatus = async (userId: string) => {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'POST',
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to toggle status');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setLoading(null);
    }
  };

  const handleResendVerification = async (userId: string) => {
    setLoading(`resend-${userId}`);
    try {
      const res = await fetch(`/api/admin/resend-verification/${userId}`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Verification email resent successfully');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to resend verification');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-design-card divide-y divide-white/10">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-sm text-gray-400">{user.email}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${
                    user.isDisabled ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {user.isDisabled ? 'Disabled' : 'Enabled'}
                  </span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${
                    user.isEmailVerified ? 'bg-design-pink/10 text-design-pink' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                ${user.balance}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                {!user.isEmailVerified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendVerification(user.id)}
                    disabled={loading === `resend-${user.id}`}
                    className="border-white/10 hover:bg-white/5 text-white"
                  >
                    Resend Email
                  </Button>
                )}
                <Button
                  variant={user.isDisabled ? 'default' : 'destructive'}
                  size="sm"
                  onClick={() => handleToggleStatus(user.id)}
                  disabled={loading === user.id}
                  className={user.isDisabled ? 'bg-design-pink text-white hover:bg-design-pink/90 border-none' : 'bg-red-600 text-white hover:bg-red-700 border-none'}
                >
                  {user.isDisabled ? 'Enable' : 'Disable'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
