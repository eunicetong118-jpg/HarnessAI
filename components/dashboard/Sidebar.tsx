'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, Settings, LogOut, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { StatusBadge } from './StatusBadge';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Withdraw', href: '/dashboard/withdraw', icon: Wallet },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  status?: 'PENDING' | 'VERIFIED';
}

export const Sidebar = ({ status = 'PENDING' }: SidebarProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <aside className="w-64 bg-design-surface/40 backdrop-blur-2xl border-r border-white/10 hidden md:flex flex-col relative z-20">
      <div className="p-8">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-design-pink to-design-purple flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all duration-500">
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            REBATE<span className="text-design-pink">NGINE</span>
          </span>
        </div>
        <div className="mt-6 px-1">
          <StatusBadge status={status} />
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'relative flex items-center px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 group',
                isActive
                  ? 'bg-design-pink/10 text-white border border-design-pink/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              )}
            >
              {isActive && (
                <>
                  <motion.div
                    layoutId="sidebar-active-glow"
                    className="absolute inset-0 bg-design-pink/5 blur-md rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 w-1 h-5 bg-design-pink rounded-r-full shadow-[0_0_10px_#ec4899]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </>
              )}
              <item.icon
                className={cn('mr-3 h-5 w-5 transition-colors duration-300', isActive ? 'text-design-pink drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]' : 'group-hover:text-gray-400')}
              />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-white/5">
            <p className="px-4 mb-2 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">System Admin</p>
            <Link
              href="/admin"
              className={cn(
                "flex items-center px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 group",
                pathname.startsWith('/admin')
                  ? 'bg-amber-400/10 text-white border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                  : 'text-amber-500/50 hover:text-amber-400 hover:bg-amber-400/5'
              )}
            >
              <ShieldCheck className={cn("mr-3 h-5 w-5 transition-colors", pathname.startsWith('/admin') ? "text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" : "text-amber-500/50")} />
              Admin Portal
            </Link>
          </div>
        )}
      </nav>
      <div className="p-4 border-t border-white/5">
        <button
          className="flex items-center w-full px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all duration-300 group"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
