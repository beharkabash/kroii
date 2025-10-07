'use client';

/**
 * Admin Header
 * Top header bar for admin dashboard
 */

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Home,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export function AdminHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Kojelauta';
    if (pathname.startsWith('/admin/cars')) return 'Autot';
    if (pathname.startsWith('/admin/leads')) return 'Asiakasviestit';
    if (pathname.startsWith('/admin/analytics')) return 'Analytiikka';
    if (pathname.startsWith('/admin/users')) return 'Käyttäjät';
    if (pathname.startsWith('/admin/settings')) return 'Asetukset';
    return 'Hallintapaneeli';
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const quickActions = [
    {
      name: 'Lisää auto',
      href: '/admin/cars/new',
      icon: Plus,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      name: 'Etusivulle',
      href: '/',
      icon: Home,
      roles: ['SUPER_ADMIN', 'ADMIN', 'VIEWER']
    }
  ];

  const userRole = session?.user?.role;
  const visibleActions = quickActions.filter(action =>
    !action.roles || action.roles.includes(userRole || '')
  );

  return (
    <header className="bg-white border-b border-slate-200 lg:pl-72">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="flex items-center space-x-4">
          <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {getPageTitle()}
            </h1>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-slate-500">
                <li>
                  <Link href="/admin" className="hover:text-slate-700 transition">
                    Hallintapaneeli
                  </Link>
                </li>
                {pathname !== '/admin' && (
                  <>
                    <span>/</span>
                    <li className="text-slate-700 font-medium">
                      {getPageTitle()}
                    </li>
                  </>
                )}
              </ol>
            </nav>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Hae autoja, asiakkaita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-80 pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {visibleActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.name}
              </Link>
            ))}
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg transition">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 p-2 text-sm rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {session?.user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="font-medium text-slate-900">
                  {session?.user?.name || 'Admin'}
                </p>
                <p className="text-xs text-slate-500">
                  {userRole}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
                  onBlur={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-900">
                      {session?.user?.name || 'Admin User'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {session?.user?.email}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {userRole}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/admin/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profiili</span>
                    </Link>

                    {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
                      <Link
                        href="/admin/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Asetukset</span>
                      </Link>
                    )}

                    <Link
                      href="/"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Home className="h-4 w-4" />
                      <span>Etusivulle</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-200 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Kirjaudu ulos</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-4 pb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Hae..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
}