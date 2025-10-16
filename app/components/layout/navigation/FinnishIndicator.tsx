'use client';

import { motion } from 'framer-motion';

interface FinnishIndicatorProps {
  className?: string;
  showText?: boolean;
}

export default function FinnishIndicator({ className = '', showText = true }: FinnishIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 ${className}`}
      title="Sivusto on saatavilla suomeksi"
    >
      <motion.span
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="text-lg"
      >
        🇫🇮
      </motion.span>
      {showText && (
        <span className="text-sm font-medium text-slate-700 hidden sm:inline">
          Suomi
        </span>
      )}
    </motion.div>
  );
}