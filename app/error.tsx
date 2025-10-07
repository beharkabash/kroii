'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Global Error Component for Next.js App Router
 * Handles errors that occur in the root layout or below
 * https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Global Error]:', error);
    }

    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[Global Error] Production error:', {
        message: error.message,
        digest: error.digest,
        timestamp: new Date().toISOString(),
      });
    }
  }, [error]);

  return (
    <html lang="fi">
      <body>
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
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-mono text-red-800 mb-2">
                    <strong>Error:</strong> {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs font-mono text-red-700">
                      <strong>Digest:</strong> {error.digest}
                    </p>
                  )}
                  {error.stack && (
                    <details className="text-xs font-mono text-red-700 mt-2">
                      <summary className="cursor-pointer hover:text-red-900">Stack Trace</summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={reset}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Yritä uudelleen</span>
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
      </body>
    </html>
  );
}