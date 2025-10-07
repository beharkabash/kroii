/**
 * Combined Middleware
 * Handles both authentication and security headers
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Create response
    const response = NextResponse.next();

    // Set security headers for all requests
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()'
    );
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // Handle authentication for admin routes
    if (pathname.startsWith('/admin')) {
      // Allow access to login page
      if (pathname.startsWith('/admin/login')) {
        return response;
      }

      // Redirect unauthenticated users to login
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }

      // Check role-based permissions
      const userRole = token.role as string;

      // Super admin has access to everything
      if (userRole === 'SUPER_ADMIN') {
        return response;
      }

      // Admin has access to most admin features
      if (userRole === 'ADMIN' && !pathname.startsWith('/admin/users')) {
        return response;
      }

      // Viewer has read-only access
      if (userRole === 'VIEWER' && (
        pathname.startsWith('/admin/cars') ||
        pathname.startsWith('/admin/leads') ||
        pathname.startsWith('/admin/analytics')
      )) {
        return response;
      }

      // Insufficient permissions
      return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public routes
        if (!pathname.startsWith('/admin')) {
          return true;
        }

        // Allow login page
        if (pathname === '/admin/login') {
          return true;
        }

        // Require authentication for admin routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)',
  ],
};
