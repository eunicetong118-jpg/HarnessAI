import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { hasLinkedAccount, getBrokerAccounts } from '@/services/broker.service';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { PendingBanner } from '@/components/dashboard/pending-banner';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { PageTransition } from '@/components/dashboard/PageTransition';
import { DesignBackground } from '@/components/shared/DesignBackground';

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
    <div className="flex h-screen bg-design-bg relative overflow-hidden">
      <DesignBackground />

      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <header className="flex items-center justify-between px-6 py-4 bg-design-surface/80 backdrop-blur-md border-b border-white/5 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white tracking-tight">User Portal</h1>
            <StatusBadge status={hasPending ? 'PENDING' : 'VERIFIED'} />
          </div>
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
        <main className="flex-1 overflow-y-auto p-8">
          <PageTransition>
            {hasPending && <PendingBanner />}
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
