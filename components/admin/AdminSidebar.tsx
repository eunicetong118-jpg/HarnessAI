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
  { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
      <div className="p-6 flex items-center space-x-2">
        <ShieldCheck className="h-8 w-8 text-blue-400" />
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
                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-slate-800 text-blue-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon
                className={cn('mr-3 h-5 w-5', isActive ? 'text-blue-400' : 'text-slate-400')}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/dashboard"
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 hover:text-white"
        >
          <LayoutDashboard className="mr-3 h-5 w-5 text-slate-400" />
          User Portal
        </Link>
        <button
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 hover:text-white mt-2"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
