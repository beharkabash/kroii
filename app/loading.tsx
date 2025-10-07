import { Car } from 'lucide-react';

/**
 * Global Loading Component for Next.js App Router
 * Shown while pages are loading or streaming
 * https://nextjs.org/docs/app/api-reference/file-conventions/loading
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block mb-8">
          {/* Animated pulsing gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />

          {/* Logo container */}
          <div className="relative h-24 w-24 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
            <Car className="h-12 w-12 text-white animate-bounce" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Ladataan...
        </h2>
        <p className="text-slate-600">
          Hetki, haemme tietoja
        </p>

        {/* Loading dots animation */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="h-3 w-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-3 w-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-3 w-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}