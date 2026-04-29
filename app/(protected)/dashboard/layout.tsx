import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { hasLinkedAccount, getBrokerAccounts } from '@/services/broker.service';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { PendingBanner } from '@/components/dashboard/pending-banner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userId = (session.user as any).id;
  const accounts = await getBrokerAccounts(userId);

  if (accounts.length === 0) {
    redirect('/onboarding');
  }

  const hasPending = accounts.some(acc => acc.status === 'PENDING');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">User Portal</h1>
          <div className="flex items-center">
            <div className="text-right mr-4 hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {hasPending && <PendingBanner />}
          {children}
        </main>
      </div>
    </div>
  );
}
