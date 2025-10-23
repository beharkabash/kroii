'use client';

import dynamic from 'next/dynamic';

// Lazy load the AdvancedFinancingCalculator
const AdvancedFinancingCalculator = dynamic(
  () => import('../features/financing/AdvancedFinancingCalculator'),
  {
    ssr: false,
    loading: () => (
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="ml-4 text-slate-700">Ladataan laskinta...</p>
          </div>
        </div>
      </div>
    ),
  }
);

interface LazyFinancingCalculatorProps {
  variant?: 'button' | 'inline';
  className?: string;
  vehiclePrice?: number;
  vehicleName?: string;
}

export default function LazyFinancingCalculator({
  variant = 'inline',
  className = '',
  vehiclePrice,
  vehicleName,
}: LazyFinancingCalculatorProps) {
  return (
    <AdvancedFinancingCalculator
      vehiclePrice={vehiclePrice}
      vehicleName={vehicleName}
      className={className}
    />
  );
}
