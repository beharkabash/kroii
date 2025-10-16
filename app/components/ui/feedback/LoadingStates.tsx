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

/**
 * Enhanced Car Skeleton Loader
 */
export function CarSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl overflow-hidden border border-slate-200"
        >
          <div className="animate-pulse">
            {/* Car Image Skeleton */}
            <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 400] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div className="h-6 bg-slate-200 rounded-lg w-3/4 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-150, 300] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.1 }}
                />
              </div>

              {/* Price */}
              <div className="h-8 bg-purple-100 rounded-lg w-1/2 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/50 to-transparent"
                  animate={{ x: [-100, 200] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
                />
              </div>

              {/* Details */}
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded w-full relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: [-120, 240] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.1 * i }}
                    />
                  </div>
                ))}
              </div>

              {/* WhatsApp Button */}
              <div className="h-12 bg-green-100 rounded-lg relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/50 to-transparent"
                  animate={{ x: [-150, 300] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Form Skeleton Loader
 */
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          {/* Label */}
          <div className="h-4 bg-slate-200 rounded w-1/4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: [-50, 100] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
            />
          </div>

          {/* Input */}
          <div className="h-12 bg-slate-100 border-2 border-slate-200 rounded-lg relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/30 to-transparent"
              animate={{ x: [-200, 400] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
            />
          </div>
        </motion.div>
      ))}

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="h-12 bg-purple-100 rounded-lg relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/50 to-transparent"
          animate={{ x: [-200, 400] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }}
        />
      </motion.div>
    </div>
  );
}

/**
 * Dashboard Stats Skeleton
 */
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-xl border border-slate-200"
        >
          <div className="animate-pulse space-y-4">
            {/* Icon */}
            <div className="h-12 w-12 bg-slate-200 rounded-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-25, 50] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
              />
            </div>

            {/* Value */}
            <div className="h-8 bg-slate-200 rounded w-3/4 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-75, 150] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
              />
            </div>

            {/* Label */}
            <div className="h-4 bg-slate-200 rounded w-1/2 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-50, 100] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * List Item Skeleton
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-slate-200"
        >
          <div className="animate-pulse flex items-center space-x-4 flex-1">
            {/* Avatar */}
            <div className="h-12 w-12 bg-slate-200 rounded-full relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-25, 50] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
              />
            </div>

            <div className="flex-1 space-y-2">
              {/* Title */}
              <div className="h-4 bg-slate-200 rounded w-1/3 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-50, 100] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
                />
              </div>

              {/* Subtitle */}
              <div className="h-3 bg-slate-200 rounded w-1/2 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-75, 150] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
                />
              </div>
            </div>

            {/* Action */}
            <div className="h-8 w-20 bg-slate-200 rounded relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-40, 80] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Chat Message Skeleton
 */
export function ChatSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => {
        const isBot = index % 2 === 0;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`flex space-x-2 max-w-xs ${isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
              {/* Avatar */}
              <div className="h-8 w-8 bg-slate-200 rounded-full relative overflow-hidden flex-shrink-0">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-15, 30] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
                />
              </div>

              {/* Message */}
              <div className={`p-3 rounded-lg ${isBot ? 'bg-slate-100' : 'bg-purple-100'} relative overflow-hidden`}>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-20 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: [-40, 80] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 }}
                    />
                  </div>
                  <div className="h-3 bg-slate-200 rounded w-16 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: [-32, 64] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: index * 0.1 + 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}