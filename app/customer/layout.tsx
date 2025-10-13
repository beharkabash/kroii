'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Heart,
  Search,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Car,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Kojelauta', href: '/customer/dashboard', icon: LayoutDashboard },
  { name: 'Suosikit', href: '/customer/favorites', icon: Heart },
  { name: 'Tallennetut haut', href: '/customer/searches', icon: Search },
  { name: 'Yhteydenotot', href: '/customer/inquiries', icon: MessageSquare },
  { name: 'Hälytykset', href: '/customer/alerts', icon: Bell },
  { name: 'Profiili', href: '/customer/profile', icon: User },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show navigation on auth pages
  const isAuthPage = pathname?.startsWith('/customer/auth');

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthPage) {
    return children;
  }

  if (!session || session.user?.role !== 'CUSTOMER') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Pääsy evätty
          </h2>
          <p className="text-slate-600 mb-4">
            Tämä alue on tarkoitettu vain asiakkaille.
          </p>
          <Link
            href="/customer/auth/login"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Kirjaudu sisään
          </Link>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-slate-900">Asiakasalue</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-4 px-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                      isActive
                        ? 'bg-purple-100 text-purple-900'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-purple-500' : 'text-slate-400 group-hover:text-slate-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200">
              <button
                onClick={handleSignOut}
                className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                Kirjaudu ulos
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
          <div className="flex items-center h-16 px-4 border-b border-slate-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-slate-900">Asiakasalue</span>
            </div>
          </div>
          <nav className="mt-4 flex-1 px-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                      isActive
                        ? 'bg-purple-100 text-purple-900'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-purple-500' : 'text-slate-400 group-hover:text-slate-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tili
              </div>
              <div className="mt-1 space-y-1">
                <div className="px-3 py-2">
                  <div className="text-sm font-medium text-slate-900">
                    {session.user?.name || 'Asiakas'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {session.user?.email}
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition"
                >
                  <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" />
                  Kirjaudu ulos
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-500 hover:text-slate-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-slate-900">Asiakasalue</span>
            </div>
            <div></div>
          </div>
        </div>

        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}