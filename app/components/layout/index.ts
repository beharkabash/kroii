// Main layout components
export { default as PageLayout, AnimatedPageLayout, CarPageLayout, CategoryPageLayout } from './PageLayout';

// Header components
export { Header, TranslatedHeader } from './header';

// Footer components
export { Footer } from './footer';

// Navigation components
export { Breadcrumbs, FinnishIndicator, LanguageSwitcher } from './navigation';

// Re-export breadcrumb utilities
export {
  generateCarBreadcrumbs,
  generateCategoryBreadcrumbs,
  generateBrandBreadcrumbs,
  generateSearchBreadcrumbs,
  type BreadcrumbItem
} from './navigation/Breadcrumbs';