'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/core/utils';

export interface BreadcrumbItem {
  name: string;
  url: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-1 text-sm text-slate-500 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-3 shadow-sm",
        className
      )}
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <motion.li
              key={index}
              variants={itemVariants}
              className="flex items-center"
            >
              {/* Separator */}
              {!isFirst && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
                </motion.div>
              )}

              {/* Item */}
              {isLast || item.isCurrentPage ? (
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  className="font-medium text-purple-600 truncate max-w-[200px] md:max-w-none flex items-center"
                  aria-current="page"
                >
                  {isFirst && (
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      className="mr-2"
                    >
                      <Home className="w-4 h-4 text-purple-500" />
                    </motion.div>
                  )}
                  {item.name}
                </motion.span>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.url}
                    className={cn(
                      "hover:text-purple-600 transition-all duration-300 truncate max-w-[150px] md:max-w-none relative group",
                      isFirst && "flex items-center"
                    )}
                  >
                    {isFirst && (
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        className="mr-2"
                      >
                        <Home className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                      </motion.div>
                    )}
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </motion.div>
              )}
            </motion.li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

// Utility function to generate common breadcrumb paths
export function generateCarBreadcrumbs(
  carMake?: string,
  carModel?: string,
  carYear?: number,
  carSlug?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Etusivu', url: '/' },
    { name: 'Autot', url: '/cars' }
  ];

  if (carMake) {
    breadcrumbs.push({
      name: carMake,
      url: `/cars/brand/${carMake.toLowerCase()}`
    });
  }

  if (carMake && carModel && carYear && carSlug) {
    breadcrumbs.push({
      name: `${carMake} ${carModel} ${carYear}`,
      url: `/cars/${carSlug}`,
      isCurrentPage: true
    });
  }

  return breadcrumbs;
}

export function generateCategoryBreadcrumbs(categoryName: string): BreadcrumbItem[] {
  return [
    { name: 'Etusivu', url: '/' },
    { name: 'Autot', url: '/cars' },
    { name: categoryName, url: `/cars/category/${categoryName.toLowerCase()}`, isCurrentPage: true }
  ];
}

export function generateBrandBreadcrumbs(brandName: string): BreadcrumbItem[] {
  return [
    { name: 'Etusivu', url: '/' },
    { name: 'Autot', url: '/cars' },
    { name: brandName, url: `/cars/brand/${brandName.toLowerCase()}`, isCurrentPage: true }
  ];
}

export function generateSearchBreadcrumbs(searchQuery?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Etusivu', url: '/' },
    { name: 'Autot', url: '/cars' }
  ];

  if (searchQuery) {
    breadcrumbs.push({
      name: `Hakutulokset: "${searchQuery}"`,
      url: `/cars?search=${encodeURIComponent(searchQuery)}`,
      isCurrentPage: true
    });
  } else {
    breadcrumbs.push({
      name: 'Haku',
      url: '/cars/search',
      isCurrentPage: true
    });
  }

  return breadcrumbs;
}