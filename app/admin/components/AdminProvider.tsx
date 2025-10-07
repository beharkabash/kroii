'use client';

/**
 * Admin Provider
 * Provides session context for admin pages
 */

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}