'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Ticket,
  LayoutDashboard,
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
  { name: 'Users', href: '/admin/users', icon: Users },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-design-surface text-white hidden md:flex flex-col border-r border-white/5">
      <div className="p-6 flex items-center space-x-2">
        <ShieldCheck className="h-8 w-8 text-design-pink" />
        <span className="text-xl font-bold">Admin Portal</span>
      </div>
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-colors',
                isActive
                  ? 'bg-design-card text-design-pink'
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
        <Link
          href="/dashboard"
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-400 rounded-xl hover:bg-white/5 hover:text-white"
        >
          <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
          User Portal
        </Link>
        <button
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-400 rounded-xl hover:bg-white/5 hover:text-white mt-2"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-500" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
