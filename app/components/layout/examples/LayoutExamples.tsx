'use client';

import { PageLayout, AnimatedPageLayout, CarPageLayout, CategoryPageLayout } from '../PageLayout';
import { BreadcrumbItem } from '../navigation/Breadcrumbs';

// Example 1: Basic page layout
export function BasicPageExample() {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Etusivu', url: '/' },
    { name: 'Tietoa meistä', url: '/about', isCurrentPage: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs} pageKey="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Tietoa meistä</h1>
        <p className="text-slate-600">
          Kroi Auto Center on luotettava kumppanisi autokaupassa...
        </p>
      </div>
    </PageLayout>
  );
}

// Example 2: Animated page layout
export function AnimatedPageExample() {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Etusivu', url: '/' },
    { name: 'Palvelut', url: '/services', isCurrentPage: true }
  ];

  return (
    <AnimatedPageLayout
      breadcrumbs={breadcrumbs}
      pageKey="services"
      animationType="slide"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Palvelumme</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service cards here */}
        </div>
      </div>
    </AnimatedPageLayout>
  );
}

// Example 3: Car page layout
export function CarPageExample() {
  return (
    <CarPageLayout
      carName="BMW 320i Sedan"
      carMake="BMW"
      carModel="320i"
      carYear={2022}
      carSlug="bmw-320i-sedan-2022"
      pageKey="car-detail"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">BMW 320i Sedan 2022</h1>
        {/* Car details here */}
      </div>
    </CarPageLayout>
  );
}

// Example 4: Category page layout
export function CategoryPageExample() {
  return (
    <CategoryPageLayout
      categoryName="Mercedes-Benz"
      categoryType="brand"
      pageKey="brand-mercedes"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Mercedes-Benz autot</h1>
        {/* Car listings here */}
      </div>
    </CategoryPageLayout>
  );
}

// Example 5: Page without footer
export function NoFooterPageExample() {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Etusivu', url: '/' },
    { name: 'Kirjautuminen', url: '/login', isCurrentPage: true }
  ];

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      showFooter={false}
      pageKey="login"
      className="bg-slate-100"
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Kirjautuminen</h1>
          {/* Login form here */}
        </div>
      </div>
    </PageLayout>
  );
}