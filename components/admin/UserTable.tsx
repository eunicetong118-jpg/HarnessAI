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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className="text-xs text-gray-400">{user.role}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${
                    user.isDisabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.isDisabled ? 'Disabled' : 'Enabled'}
                  </span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full w-fit ${
                    user.isEmailVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                ${user.balance}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                {!user.isEmailVerified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendVerification(user.id)}
                    disabled={loading === `resend-${user.id}`}
                  >
                    Resend Email
                  </Button>
                )}
                <Button
                  variant={user.isDisabled ? 'default' : 'destructive'}
                  size="sm"
                  onClick={() => handleToggleStatus(user.id)}
                  disabled={loading === user.id}
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
