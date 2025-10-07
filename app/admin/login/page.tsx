'use client';

/**
 * Admin Login Page
 * Handles authentication for admin users
 */

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Car, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@kroiautocenter.fi');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Virheelliset kirjautumistiedot');
        setIsLoading(false);
        return;
      }

      // Check session to ensure login was successful
      const session = await getSession();
      if (session) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Kirjautuminen epäonnistui');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Kirjautumisessa tapahtui virhe');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
              <Car className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              KROI AUTO CENTER
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            Hallintapaneeli
          </h1>
          <p className="text-slate-300">
            Kirjaudu sisään hallintapaneeliin
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Sähköposti
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="admin@kroiautocenter.fi"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Salasana
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Syötä salasana"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-300 hover:text-white transition"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Kirjautuminen...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Kirjaudu sisään</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Development Help */}
          <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200 text-sm font-medium mb-2">
              Kehitystilin tiedot:
            </p>
            <p className="text-blue-100 text-xs font-mono">
              Email: admin@kroiautocenter.fi<br />
              Password: admin123
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-slate-300 hover:text-white transition text-sm"
          >
            ← Takaisin etusivulle
          </Link>
        </div>
      </motion.div>
    </div>
  );
}