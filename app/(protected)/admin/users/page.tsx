import { getUsers } from '@/services/admin.service';
import { UserTable } from '@/components/admin/UserTable';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await getUsers();

  // Need to serialize for the Client Component
  const serializedUsers = users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    lastModifiedAt: user.lastModifiedAt.toISOString(),
    emailVerified: user.emailVerified?.toISOString() || null,
    lastLoginAttemptAt: user.lastLoginAttemptAt?.toISOString() || null,
    lastSuccessfulLoginAt: user.lastSuccessfulLoginAt?.toISOString() || null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="text-sm text-gray-400">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-design-card shadow-xl rounded-xl border border-white/5 overflow-hidden">
        <UserTable users={serializedUsers as any} />
      </div>
    </div>
  );
}
