'use client';

/**
 * Admin Sidebar
 * Navigation sidebar for admin dashboard
 */

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Search,
  UserPlus,
  Shield,
  Activity
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  current?: boolean;
  children?: NavItem[];
  badge?: string;
  roles?: string[];
}

export function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['cars']);

  const userRole = session?.user?.role;

  const navigation: NavItem[] = [
    {
      name: 'Kojelauta',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Autot',
      href: '/admin/cars',
      icon: Car,
      children: [
        { name: 'Kaikki autot', href: '/admin/cars', icon: Car },
        { name: 'Lisää auto', href: '/admin/cars/new', icon: UserPlus, roles: ['SUPER_ADMIN', 'ADMIN'] },
        { name: 'Kategoriat', href: '/admin/cars/categories', icon: Settings },
      ],
    },
    {
      name: 'Asiakasviestit',
      href: '/admin/leads',
      icon: MessageSquare,
      children: [
        { name: 'Kaikki viestit', href: '/admin/leads', icon: MessageSquare },
        { name: 'Uudet', href: '/admin/leads?status=NEW', icon: Activity, badge: 'new' },
        { name: 'Käsittelemättömät', href: '/admin/leads?status=CONTACTED', icon: Users },
      ],
    },
    {
      name: 'Analytiikka',
      href: '/admin/analytics',
      icon: BarChart3,
      children: [
        { name: 'Yleiskatsaus', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Auto-analytiikka', href: '/admin/analytics/cars', icon: Car },
        { name: 'Liikenne', href: '/admin/analytics/traffic', icon: Activity },
      ],
    },
    {
      name: 'Käyttäjät',
      href: '/admin/users',
      icon: Users,
      roles: ['SUPER_ADMIN'],
    },
    {
      name: 'Asetukset',
      href: '/admin/settings',
      icon: Settings,
      roles: ['SUPER_ADMIN', 'ADMIN'],
    },
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemVisible = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole || '');
  };

  const isCurrentPath = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200">
        <Link href="/" className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">
            KROI ADMIN
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col p-6">
        <ul className="space-y-1">
          {navigation.filter(isItemVisible).map((item) => (
            <li key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition ${
                      isCurrentPath(item.href)
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    {expandedItems.includes(item.name) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedItems.includes(item.name) && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 ml-6 space-y-1"
                      >
                        {item.children.filter(isItemVisible).map((child) => (
                          <li key={child.name}>
                            <Link
                              href={child.href}
                              className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition ${
                                isCurrentPath(child.href)
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <child.icon className="h-4 w-4" />
                              <span>{child.name}</span>
                              {child.badge && (
                                <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition ${
                    isCurrentPath(item.href)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Quick Actions */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Pikavalinnat
          </h3>
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <Home className="h-4 w-4" />
              <span>Etusivulle</span>
            </Link>
            <Link
              href="/admin/cars/search"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              <Search className="h-4 w-4" />
              <span>Hae autoja</span>
            </Link>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-auto pt-6 border-t border-slate-200">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {session?.user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-slate-500 flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>{userRole}</span>
              </p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-6 w-6 text-slate-600" />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-slate-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-slate-900/80"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white"
            >
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
                  <Link href="/" className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                      <Car className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900">
                      KROI ADMIN
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <SidebarContent />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}