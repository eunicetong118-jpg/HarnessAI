import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Role-based protection
  if ((session.user as any).role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen bg-design-bg">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-design-surface border-b border-white/5 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">Admin Command Center</h1>
            <span className="ml-4 px-2 py-1 text-xs font-semibold text-design-pink bg-design-pink/10 rounded-full uppercase tracking-wider">
              Staff Access
            </span>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-4 hidden sm:block">
              <p className="text-sm font-semibold text-white">{session.user.name}</p>
              <p className="text-xs text-gray-400 font-medium">{session.user.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-design-card flex items-center justify-center text-white font-bold text-sm shadow-inner ring-2 ring-design-pink">
              {session.user.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-design-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
