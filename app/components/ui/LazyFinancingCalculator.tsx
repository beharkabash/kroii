'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Calculator } from 'lucide-react';

// Lazy load the FinancingCalculator only when user requests it
const FinancingCalculator = dynamic(() => import('../features/financing/FinancingCalculator'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-center text-gray-700">Loading calculator...</p>
        </div>
      </div>
    </div>
  ),
});

interface LazyFinancingCalculatorProps {
  variant?: 'button' | 'inline';
  className?: string;
  vehiclePrice?: number;
  vehicleName?: string;
  compact?: boolean;
}

export default function LazyFinancingCalculator({
  variant = 'button',
  className = '',
  vehiclePrice,
  vehicleName,
  compact
}: LazyFinancingCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Inline variant renders the component directly (for pages like /financing)
  if (variant === 'inline') {
    return (
      <FinancingCalculator
        vehiclePrice={vehiclePrice}
        vehicleName={vehicleName}
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
        className={`fixed bottom-24 right-4 z-40 shadow-lg bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors ${className}`}
        title="Financing Calculator"
        aria-label="Open Financing Calculator"
      >
        <Calculator className="h-5 w-5" />
      </button>
    );
  }

  // Load the actual component when requested
  return (
    <FinancingCalculator
      vehiclePrice={vehiclePrice}
      vehicleName={vehicleName}
      compact={compact}
    />
  );
}