'use client';

/**
 * Reusable Loading State Components
 * Provides consistent loading experiences across the application
 */

import { motion } from 'framer-motion';
import { Loader2, Car, Users, Settings, BarChart3, Mail } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Basic loading spinner
 */
export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 className={`animate-spin text-purple-600 ${sizeClasses[size]} ${className}`} />
  );
}

interface PageLoadingProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Full page loading state
 */
export function PageLoading({
  title = 'Ladataan...',
  description,
  icon: IconComponent = Car
}: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto px-4"
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="h-16 w-16 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center"
          >
            <IconComponent className="h-8 w-8 text-white" />
          </motion.div>

          <h2 className="text-xl font-semibold text-slate-900 mb-2">{title}</h2>
          {description && (
            <p className="text-slate-600">{description}</p>
          )}

          <div className="mt-6">
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="h-2 w-2 bg-purple-400 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Card loading state with skeleton
 */
export function CardLoading({ count = 1 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg border border-slate-200 p-6"
        >
          <div className="animate-pulse">
            <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Table loading state
 */
export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-b border-slate-200 last:border-b-0">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 bg-slate-200 rounded"
                  style={{
                    animationDelay: `${(rowIndex * columns + colIndex) * 0.1}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Button loading state
 */
export function ButtonLoading({ children, loading, ...props }: {
  children: React.ReactNode;
  loading: boolean;
  [key: string]: unknown;
}) {
  return (
    <button {...props} disabled={loading}>
      <span className="flex items-center justify-center">
        {loading && <LoadingSpinner size="sm" className="mr-2" />}
        {children}
      </span>
    </button>
  );
}

/**
 * Section loading for partial page updates
 */
export function SectionLoading({
  title = 'Ladataan sisältöä...',
  height = 'h-64'
}: {
  title?: string;
  height?: string;
}) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 ${height} flex flex-col items-center justify-center`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 border-4 border-purple-200 border-t-purple-600 rounded-full mb-4"
      ></motion.div>
      <h3 className="text-lg font-medium text-slate-700 mb-2">{title}</h3>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [-2, 2, -2],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="h-1 w-1 bg-purple-400 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Data loading with context-specific icons and messages
 */
export function DataLoading({ type }: { type: 'cars' | 'users' | 'leads' | 'settings' | 'analytics' }) {
  const config = {
    cars: {
      icon: Car,
      title: 'Ladataan autoja...',
      description: 'Haetaan viimeisimpiä autotietoja',
    },
    users: {
      icon: Users,
      title: 'Ladataan käyttäjiä...',
      description: 'Päivitetään käyttäjätiedot',
    },
    leads: {
      icon: Mail,
      title: 'Ladataan liidejä...',
      description: 'Haetaan asiakasyhteydenotot',
    },
    settings: {
      icon: Settings,
      title: 'Ladataan asetuksia...',
      description: 'Noudetaan järjestelmäkonfiguraatio',
    },
    analytics: {
      icon: BarChart3,
      title: 'Ladataan analytiikkaa...',
      description: 'Lasketaan tilastotiedot',
    },
  };

  const { icon, title, description } = config[type];

  return (
    <PageLoading
      title={title}
      description={description}
      icon={icon}
    />
  );
}