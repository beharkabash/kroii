'use client';

import { useEffect, useState } from 'react';
import { X, ArrowRight, Scale, Car, Zap, Fuel, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComparisonStore } from '@/app/lib/features/comparison-store';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/app/lib/core/utils';
import confetti from 'canvas-confetti';

export default function ComparisonWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { comparedCars, removeFromComparison, getComparisonCount } = useComparisonStore();

  useEffect(() => {
    const count = getComparisonCount();
    setIsVisible(count > 0);

    // Celebrate when user adds 3rd car
    if (count === 3) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#7c3aed', '#ec4899', '#8b5cf6']
      });
    }
  }, [getComparisonCount]);

  // Hydration fix for SSR
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-collapse on mobile after 5 seconds
  useEffect(() => {
    if (isMounted && isVisible && window.innerWidth <= 768) {
      const timer = setTimeout(() => {
        setIsCollapsed(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isMounted, isVisible]);

  if (!isMounted || !isVisible || comparedCars.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-2 right-2 sm:left-4 sm:right-4 z-50 max-w-4xl mx-auto"
      >
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-100 overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)" }}
        >
          {isCollapsed ? (
            <motion.div
              initial={false}
              className="p-3 cursor-pointer"
              onClick={() => setIsCollapsed(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="p-1.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                  >
                    <Scale className="h-3 w-3 text-white" />
                  </motion.div>
                  <span className="text-sm font-semibold text-gray-900">
                    Vertailu ({comparedCars.length})
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            </motion.div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="p-1.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                  >
                    <Scale className="h-4 w-4 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Autojen vertailu
                    </h3>
                    <p className="text-xs text-gray-500">
                      {comparedCars.length}/3 autoa valittu
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCollapsed(true)}
                    className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <ArrowRight className="h-4 w-4 rotate-90" />
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/cars/compare"
                      className="bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1"
                    >
                      <span className="hidden sm:inline">Vertaile autoja</span>
                      <span className="sm:hidden">Vertaa</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {comparedCars.map((car, index) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100 group hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        removeFromComparison(car.id);
                        // Small celebration when removing
                        confetti({
                          particleCount: 20,
                          spread: 30,
                          origin: { y: 0.8 },
                          colors: ['#ef4444']
                        });
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                      aria-label="Poista vertailusta"
                    >
                      <X className="h-3 w-3" />
                    </motion.button>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 relative">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="relative rounded-lg overflow-hidden shadow-md"
                        >
                          <Image
                            src={car.image || '/cars/placeholder.jpg'}
                            alt={car.name}
                            width={60}
                            height={45}
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </motion.div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {car.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                          <div className="flex items-center space-x-1">
                            <Car className="h-3 w-3" />
                            <span>{car.year}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="h-3 w-3" />
                            <span>{(car.kmNumber / 1000).toFixed(0)}k km</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                          >
                            {car.priceEur.toLocaleString('fi-FI', { maximumFractionDigits: 0 })} €
                          </motion.div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Fuel className="h-3 w-3" />
                            <span>{car.fuel || 'Diesel'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Settings className="h-3 w-3" />
                            <span>{car.transmission || 'Auto'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Add more slots indicator */}
                {comparedCars.length < 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: comparedCars.length * 0.1 + 0.2 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                        className="mx-auto mb-2"
                      >
                        <Scale className="h-6 w-6 text-gray-400 group-hover:text-purple-500 transition-colors" />
                      </motion.div>
                      <p className="text-xs text-gray-500 group-hover:text-purple-600 font-medium transition-colors">
                        Lisää {comparedCars.length === 0 ? 'ensimmäinen' : comparedCars.length === 1 ? 'toinen' : 'kolmas'} auto
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Klikkaa autokortin ❤️ kuvaketta
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Progress indicator */}
              <div className="mt-4 px-2">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Vertailun edistyminen</span>
                  <span>{comparedCars.length}/3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(comparedCars.length / 3) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 h-1.5 rounded-full"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Add to Compare Button Component
interface AddToCompareButtonProps {
  car: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    priceEur: number;
    kmNumber: number;
    fuel: string;
    transmission: string;
    description: string;
    image?: string;
    images?: Array<{ url: string; alt?: string }>;
  };
  className?: string;
  variant?: 'default' | 'compact';
}

export function AddToCompareButton({ car, className, variant = 'default' }: AddToCompareButtonProps) {
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparisonStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid hydration issues
  }

  const inComparison = isInComparison(car.id);
  const canAdd = canAddMore();

  const handleClick = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (inComparison) {
      removeFromComparison(car.id);
      // Small celebration when removing
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#ef4444', '#f97316']
      });
    } else if (canAdd) {
      // Convert car data to ComparisonCar format
      const comparisonCar = {
        ...car,
        image: car.image || car.images?.[0]?.url,
        category: 'Auto',
        features: [],
      };
      addToComparison(comparisonCar);

      // Celebration when adding
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#7c3aed', '#ec4899', '#8b5cf6']
      });
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  if (variant === 'compact') {
    return (
      <motion.button
        onClick={handleClick}
        disabled={(!canAdd && !inComparison) || isAnimating}
        whileHover={{ scale: canAdd || inComparison ? 1.1 : 1 }}
        whileTap={{ scale: canAdd || inComparison ? 0.9 : 1 }}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        className={cn(
          "p-2 rounded-lg border transition-all duration-300 relative overflow-hidden group",
          inComparison
            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white border-purple-600 shadow-lg shadow-purple-500/30"
            : canAdd
            ? "bg-white text-gray-700 border-gray-300 hover:border-purple-600 hover:text-purple-600 hover:shadow-md"
            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed",
          className
        )}
        title={
          inComparison
            ? "Poista vertailusta ❌"
            : canAdd
            ? "Lisää vertailuun ❤️"
            : "Maksimi 3 autoa vertailussa 🚫"
        }
      >
        <motion.div
          animate={inComparison ? { rotate: 360 } : {}}
          transition={{ duration: 0.3 }}
        >
          <Scale className="h-4 w-4" />
        </motion.div>
        {inComparison && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full h-3 w-3 flex items-center justify-center text-xs"
          >
            ✓
          </motion.div>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={(!canAdd && !inComparison) || isAnimating}
      whileHover={{ scale: canAdd || inComparison ? 1.05 : 1 }}
      whileTap={{ scale: canAdd || inComparison ? 0.95 : 1 }}
      animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 text-sm font-medium relative overflow-hidden group",
        inComparison
          ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white border-purple-600 shadow-lg shadow-purple-500/30"
          : canAdd
          ? "bg-white text-gray-700 border-gray-300 hover:border-purple-600 hover:text-purple-600 hover:shadow-md hover:bg-purple-50"
          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed",
        className
      )}
    >
      <motion.div
        animate={inComparison ? { rotate: 360 } : {}}
        transition={{ duration: 0.3 }}
      >
        <Scale className="h-4 w-4" />
      </motion.div>
      <span className="relative">
        {inComparison
          ? "Poista vertailusta ❌"
          : canAdd
          ? "Lisää vertailuun ❤️"
          : "Vertailu täynnä 🚫"}
      </span>
      {inComparison && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold"
        >
          ✓
        </motion.div>
      )}
      {/* Sparkle effect when hovering */}
      {(canAdd || inComparison) && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}