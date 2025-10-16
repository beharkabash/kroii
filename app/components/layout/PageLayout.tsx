'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './header/Header';
import Footer from './footer/Footer';
import Breadcrumbs, { BreadcrumbItem } from './navigation/Breadcrumbs';

interface PageLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showFooter?: boolean;
  className?: string;
  pageKey?: string; // For page transitions
}

export default function PageLayout({
  children,
  breadcrumbs,
  showFooter = true,
  className = '',
  pageKey = 'default'
}: PageLayoutProps) {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <Header />

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="sticky top-16 z-40 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pageKey}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          className={`flex-1 ${className}`}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      {showFooter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Footer />
        </motion.div>
      )}
    </div>
  );
}

// Enhanced layout with animations for specific page types
export function AnimatedPageLayout({
  children,
  breadcrumbs,
  showFooter = true,
  className = '',
  pageKey = 'default',
  animationType = 'default'
}: PageLayoutProps & { animationType?: 'slide' | 'fade' | 'scale' | 'default' }) {
  const getPageVariants = () => {
    switch (animationType) {
      case 'slide':
        return {
          initial: { opacity: 0, x: 50 },
          in: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
          out: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" } }
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          in: { opacity: 1, transition: { duration: 0.6 } },
          out: { opacity: 0, transition: { duration: 0.3 } }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          in: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
          out: { opacity: 0, scale: 1.1, transition: { duration: 0.3, ease: "easeIn" } }
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          in: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
          out: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="sticky top-16 z-40 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={pageKey}
          variants={getPageVariants()}
          initial="initial"
          animate="in"
          exit="out"
          className={`flex-1 ${className}`}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {showFooter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Footer />
        </motion.div>
      )}
    </div>
  );
}

// Specialized layout for car listing pages
export function CarPageLayout({
  children,
  carName,
  carMake,
  carModel,
  carYear,
  carSlug,
  className = '',
  pageKey = 'car'
}: Omit<PageLayoutProps, 'breadcrumbs'> & {
  carName?: string;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  carSlug?: string;
}) {
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

  if (carName && carSlug) {
    breadcrumbs.push({
      name: carName,
      url: `/cars/${carSlug}`,
      isCurrentPage: true
    });
  }

  return (
    <AnimatedPageLayout
      breadcrumbs={breadcrumbs}
      className={className}
      pageKey={pageKey}
      animationType="slide"
    >
      {children}
    </AnimatedPageLayout>
  );
}

// Specialized layout for category/brand pages
export function CategoryPageLayout({
  children,
  categoryName,
  categoryType = 'category',
  className = '',
  pageKey = 'category'
}: Omit<PageLayoutProps, 'breadcrumbs'> & {
  categoryName: string;
  categoryType?: 'category' | 'brand';
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Etusivu', url: '/' },
    { name: 'Autot', url: '/cars' },
    {
      name: categoryName,
      url: `/cars/${categoryType}/${categoryName.toLowerCase()}`,
      isCurrentPage: true
    }
  ];

  return (
    <AnimatedPageLayout
      breadcrumbs={breadcrumbs}
      className={className}
      pageKey={pageKey}
      animationType="fade"
    >
      {children}
    </AnimatedPageLayout>
  );
}