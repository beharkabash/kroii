'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

/**
 * Production-ready Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 * Logs error details and displays a fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Caught error:', error);
      console.error('[ErrorBoundary] Error info:', errorInfo);
    }

    // Log error to monitoring service (e.g., Sentry) in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service
      console.error('[ErrorBoundary] Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }

    this.setState({
      errorInfo: errorInfo.componentStack || null,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-red-100">
              <div className="flex items-center justify-center mb-6">
                <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
                Hups! Jotain meni pieleen
              </h1>

              <p className="text-lg text-slate-600 text-center mb-8">
                Pahoittelemme häiriötä. Sivulla tapahtui odottamaton virhe. Yritä päivittää sivu tai palata etusivulle.
              </p>

              {/* Error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-mono text-red-800 mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="text-xs font-mono text-red-700">
                      <summary className="cursor-pointer hover:text-red-900">Stack Trace</summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Päivitä sivu</span>
                </button>

                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-purple-300 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
                >
                  <Home className="h-5 w-5" />
                  <span>Etusivulle</span>
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-500 mb-4">
                  Jos ongelma jatkuu, ota meihin yhteyttä:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                  <a
                    href="tel:+358413188214"
                    className="text-purple-600 hover:text-purple-700 font-medium transition"
                  >
                    +358 41 3188214
                  </a>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <a
                    href="mailto:kroiautocenter@gmail.com"
                    className="text-purple-600 hover:text-purple-700 font-medium transition"
                  >
                    kroiautocenter@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error fallback component for specific sections
 */
export function ErrorFallback({ error, reset }: { error: Error; reset?: () => void }) {
  return (
    <div className="p-8 bg-red-50 border border-red-200 rounded-xl">
      <div className="flex items-start space-x-4">
        <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Virhe ladattaessa sisältöä
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {error.message || 'Tapahtui odottamaton virhe. Yritä uudelleen.'}
          </p>
          {reset && (
            <button
              onClick={reset}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
            >
              Yritä uudelleen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}