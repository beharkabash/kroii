'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/app/lib/utils';

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

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm text-gray-500", className)}
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center">
              {/* Separator */}
              {!isFirst && (
                <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
              )}

              {/* Item */}
              {isLast || item.isCurrentPage ? (
                <span
                  className="font-medium text-gray-900 truncate max-w-[200px] md:max-w-none"
                  aria-current="page"
                >
                  {isFirst && <Home className="w-4 h-4 inline mr-1" />}
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className={cn(
                    "hover:text-gray-700 transition-colors truncate max-w-[150px] md:max-w-none",
                    isFirst && "flex items-center"
                  )}
                >
                  {isFirst && <Home className="w-4 h-4 mr-1" />}
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
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