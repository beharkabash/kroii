# Layout Components

This directory contains all the layout components for the Kroi Auto Center application. All components are designed to work without i18n dependencies and use Finnish text throughout.

## Components Overview

### 🏠 Header (`header/Header.tsx`)
- Modern, responsive header with Finnish navigation
- Smooth animations with Framer Motion
- Mobile-friendly hamburger menu
- Integrated Finnish flag indicator
- Purple/pink gradient branding

**Features:**
- Sticky positioning with backdrop blur
- Animated logo and navigation items
- Mobile-responsive design
- Hover effects and transitions

### 🦶 Footer (`footer/Footer.tsx`)
- Comprehensive footer with company information
- Contact details and social media links
- Animated sections with Framer Motion
- Professional design with gradient backgrounds
- Back-to-top button

**Sections:**
- Company info with animated logo
- Quick links navigation
- Services listing
- Contact information with icons
- Social media links
- Legal links

### 🧭 Navigation Components

#### Breadcrumbs (`navigation/Breadcrumbs.tsx`)
- Enhanced with Framer Motion animations
- Staggered entrance animations
- Hover effects and transitions
- Utility functions for common breadcrumb patterns

#### Finnish Indicator (`navigation/FinnishIndicator.tsx`)
- Simple component showing Finnish flag
- Replaces the complex language switcher
- Subtle animations

### 📱 Layout Wrappers

#### PageLayout (`PageLayout.tsx`)
Main layout wrapper that includes:
- Header
- Optional breadcrumbs
- Animated main content
- Optional footer
- Page transition animations

#### AnimatedPageLayout
Enhanced version with configurable animation types:
- `slide` - Horizontal slide transitions
- `fade` - Fade in/out transitions
- `scale` - Scale transitions
- `default` - Vertical slide transitions

#### CarPageLayout
Specialized layout for car detail pages:
- Auto-generates breadcrumbs for cars
- Optimized for car listing pages
- Slide animations

#### CategoryPageLayout
Specialized layout for category/brand pages:
- Auto-generates breadcrumbs for categories
- Fade animations
- Support for both categories and brands

## Usage Examples

### Basic Page Layout
```tsx
import { PageLayout } from '@/app/components/layout';

function AboutPage() {
  const breadcrumbs = [
    { name: 'Etusivu', url: '/' },
    { name: 'Tietoa meistä', url: '/about', isCurrentPage: true }
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs} pageKey="about">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1>Tietoa meistä</h1>
        {/* Content */}
      </div>
    </PageLayout>
  );
}
```

### Car Detail Page
```tsx
import { CarPageLayout } from '@/app/components/layout';

function CarDetailPage({ car }) {
  return (
    <CarPageLayout
      carName={car.name}
      carMake={car.make}
      carModel={car.model}
      carYear={car.year}
      carSlug={car.slug}
      pageKey={`car-${car.id}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Car details */}
      </div>
    </CarPageLayout>
  );
}
```

### Animated Page
```tsx
import { AnimatedPageLayout } from '@/app/components/layout';

function ServicesPage() {
  return (
    <AnimatedPageLayout
      breadcrumbs={breadcrumbs}
      animationType="slide"
      pageKey="services"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Content */}
      </div>
    </AnimatedPageLayout>
  );
}
```

### Category Page
```tsx
import { CategoryPageLayout } from '@/app/components/layout';

function BrandPage({ brandName }) {
  return (
    <CategoryPageLayout
      categoryName={brandName}
      categoryType="brand"
      pageKey={`brand-${brandName}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Brand cars listing */}
      </div>
    </CategoryPageLayout>
  );
}
```

## Breadcrumb Utilities

The breadcrumb component includes several utility functions:

```tsx
import {
  generateCarBreadcrumbs,
  generateCategoryBreadcrumbs,
  generateBrandBreadcrumbs,
  generateSearchBreadcrumbs
} from '@/app/components/layout';

// For car pages
const carBreadcrumbs = generateCarBreadcrumbs('BMW', '320i', 2022, 'bmw-320i-2022');

// For category pages
const categoryBreadcrumbs = generateCategoryBreadcrumbs('Sedanit');

// For brand pages
const brandBreadcrumbs = generateBrandBreadcrumbs('Mercedes-Benz');

// For search results
const searchBreadcrumbs = generateSearchBreadcrumbs('BMW 320i');
```

## Animation Features

All layout components include:
- ✨ Entrance animations
- 🎯 Hover effects
- 📱 Mobile-optimized transitions
- ⚡ Smooth page transitions
- 🎨 Staggered animations for lists

## Styling

Components use:
- 🎨 Purple/pink gradient branding
- 🌙 Slate color palette
- ✨ Backdrop blur effects
- 📐 Responsive grid layouts
- 🎪 Framer Motion animations

## Migration from Old Components

### TranslatedHeader → Header
```tsx
// Old
import { TranslatedHeader } from './header';

// New
import { Header } from './header';
```

### LanguageSwitcher → FinnishIndicator
```tsx
// Old
import { LanguageSwitcher } from './navigation';

// New
import { FinnishIndicator } from './navigation';
```

## File Structure

```
layout/
├── header/
│   ├── Header.tsx              # New Finnish-only header
│   ├── TranslatedHeader.tsx    # Legacy (deprecated)
│   └── index.ts
├── footer/
│   ├── Footer.tsx              # Professional footer
│   └── index.ts
├── navigation/
│   ├── Breadcrumbs.tsx         # Enhanced with animations
│   ├── FinnishIndicator.tsx    # Simple Finnish flag
│   ├── LanguageSwitcher.tsx    # Legacy (deprecated)
│   └── index.ts
├── examples/
│   └── LayoutExamples.tsx      # Usage examples
├── PageLayout.tsx              # Main layout wrappers
├── index.ts                    # Main exports
└── README.md                   # This file
```

## Notes

- All components are client-side ('use client')
- No i18n dependencies required
- Finnish text is hardcoded
- Responsive design for all screen sizes
- Optimized for performance with Framer Motion
- Accessible with proper ARIA labels
- SEO-friendly with semantic HTML