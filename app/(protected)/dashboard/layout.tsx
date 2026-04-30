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
    <div className="flex h-screen bg-design-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-design-surface border-b border-white/5 shadow-sm">
          <h1 className="text-xl font-bold text-white">User Portal</h1>
          <div className="flex items-center">
            <div className="text-right mr-4 hidden sm:block">
              <p className="text-sm font-semibold text-white">{session.user.name}</p>
              <p className="text-xs text-gray-400 font-medium">{session.user.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-design-card flex items-center justify-center text-white font-bold text-sm shadow-inner ring-2 ring-design-pink">
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-design-bg">
          {hasPending && <PendingBanner />}
          {children}
        </main>
      </div>
    </div>
  );
}
