/**
 * Auth Module
 * Authentication and authorization utilities
 */

import React from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
}

export interface Session {
  user: User;
  token: AuthToken;
  isAuthenticated: boolean;
}

class AuthService {
  private currentSession: Session | null = null;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentSession?.isAuthenticated || false;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }

  /**
   * Get current session
   */
  getSession(): Session | null {
    return this.currentSession;
  }

  /**
   * Set session
   */
  setSession(session: Session): void {
    this.currentSession = session;
  }

  /**
   * Clear session (logout)
   */
  clearSession(): void {
    this.currentSession = null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Check if session is expired
   */
  isSessionExpired(): boolean {
    if (!this.currentSession?.token) {
      return true;
    }

    return new Date() > this.currentSession.token.expiresAt;
  }

  /**
   * Validate token format (basic validation)
   */
  validateToken(token: string): boolean {
    // Basic token validation - in real app would verify JWT signature, etc.
    return typeof token === 'string' && token.length > 0;
  }

  /**
   * Create a mock session for development
   */
  createMockSession(user: Partial<User> = {}): Session {
    const mockUser: User = {
      id: user.id || '1',
      email: user.email || 'user@example.com',
      name: user.name || 'Test User',
      role: user.role || 'user'
    };

    const mockToken: AuthToken = {
      token: 'mock-token-' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    return {
      user: mockUser,
      token: mockToken,
      isAuthenticated: true
    };
  }
}

export const authService = new AuthService();

/**
 * HOC for protecting components
 */
export function requireAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const AuthenticatedComponent = (props: P) => {
    if (!authService.isAuthenticated()) {
      // In real app, redirect to login
      return null;
    }
    return React.createElement(Component, props);
  };

  AuthenticatedComponent.displayName = `requireAuth(${Component.displayName || Component.name || 'Component'})`;

  return AuthenticatedComponent;
}

/**
 * Hook for using auth in components
 */
export function useAuth() {
  return {
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    hasRole: (role: string) => authService.hasRole(role),
    logout: () => authService.clearSession()
  };
}

export default authService;