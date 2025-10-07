/**
 * Admin Layout
 * Provides navigation and layout for admin pages
 */

import { ReactNode } from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminProvider } from './components/AdminProvider';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />

        <div className="lg:pl-72">
          <AdminHeader />

          <main className="py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}