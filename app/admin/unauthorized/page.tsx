'use client';

/**
 * Unauthorized Access Page
 * Shown when user doesn't have sufficient permissions
 */

import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function UnauthorizedPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ShieldX className="h-12 w-12 text-red-600" />
        </motion.div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Pääsy evätty
        </h1>

        <p className="text-lg text-slate-600 mb-2">
          Sinulla ei ole oikeuksia käyttää tätä sivua.
        </p>

        <p className="text-sm text-slate-500 mb-8">
          Nykyinen käyttöoikeustasosi: <strong>{session?.user?.role || 'Tuntematon'}</strong>
        </p>

        <div className="space-y-4">
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Takaisin hallintapaneeliin
          </Link>

          <div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition"
            >
              <Home className="h-4 w-4 mr-2" />
              Etusivulle
            </Link>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Tarvitsetko lisää oikeuksia?
          </h3>
          <p className="text-sm text-yellow-700">
            Ota yhteyttä järjestelmänvalvojaan saadaksesi tarvittavat käyttöoikeudet.
          </p>
        </div>
      </motion.div>
    </div>
  );
}