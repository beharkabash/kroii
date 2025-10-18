'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Car } from 'lucide-react';

// Lazy load the TradeInEstimator only when user requests it
const TradeInEstimator = dynamic(() => import('../features/trade-in/TradeInEstimator'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <p className="text-center text-gray-700">Loading trade-in estimator...</p>
        </div>
      </div>
    </div>
  ),
});

interface LazyTradeInEstimatorProps {
  variant?: 'button' | 'inline';
  className?: string;
  compact?: boolean;
}

export default function LazyTradeInEstimator({
  variant = 'button',
  className = '',
  compact
}: LazyTradeInEstimatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Inline variant renders the component directly (for pages like /trade-in)
  if (variant === 'inline') {
    return (
      <TradeInEstimator
        className={className}
        compact={compact}
      />
    );
  }

  // Button variant only renders button initially (for floating widgets)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-40 right-4 z-40 shadow-lg bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors ${className}`}
        title="Trade-In Estimator"
        aria-label="Open Trade-In Estimator"
      >
        <Car className="h-5 w-5" />
      </button>
    );
  }

  // Load the actual component when requested
  return (
    <TradeInEstimator
      compact={compact}
    />
  );
}