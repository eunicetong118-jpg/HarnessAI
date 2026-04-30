'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Withdraw', href: '/dashboard/withdraw', icon: Wallet },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-design-surface border-r border-white/5 hidden md:flex flex-col">
      <div className="p-6">
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-design-pink to-design-purple">
          Rebatengine
        </span>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon
                className={cn('mr-3 h-5 w-5', isActive ? 'text-design-pink' : 'text-gray-500')}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5">
        <button
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-500" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
