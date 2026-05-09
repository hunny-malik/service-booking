"use client";

import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { LogOut, User, Briefcase, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { currentUser, logout, login, initializeMockData } = useAppStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
    initializeMockData();
  }, [initializeMockData]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      login({
        id: (session.user as any).id || `c_${session.user.email}`,
        name: session.user.name || 'User',
        phone: session.user.email || 'N/A', // storing email in phone field for compatibility
        role: 'customer'
      });
    } else if (status === 'unauthenticated' && currentUser?.role === 'customer') {
      logout();
    }
  }, [status, session, login, logout, currentUser?.role]);

  const handleLogout = async () => {
    if (currentUser?.role === 'customer') {
      await signOut({ redirect: false });
    }
    logout();
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 premium-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl text-text-primary tracking-tight">ServiceHub</span>
          </Link>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link 
                  href={currentUser.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard'}
                  className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-text-primary">{currentUser.name}</span>
                    <span className="text-xs text-text-muted capitalize">{currentUser.role}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-text-secondary hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Customer Login
                </Link>
                <Link 
                  href="/vendor/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors premium-shadow"
                >
                  <Briefcase className="w-4 h-4" />
                  Vendor Access
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
