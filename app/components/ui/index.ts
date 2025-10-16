/**
 * KROI Auto Center UI Component Library
 *
 * A comprehensive, professional UI component library built with:
 * - React 19 & Next.js 15
 * - TypeScript for type safety
 * - Framer Motion for smooth animations
 * - Tailwind CSS for styling
 * - Finnish localization
 * - Purple/Pink branding theme
 * - Mobile-first responsive design
 *
 * @version 1.0.0
 * @author Claude Code
 */

// =============================================================================
// FORM COMPONENTS
// =============================================================================
export {
  Input,
  Select,
} from './forms';

export type {
  InputProps,
  SelectProps,
  SelectOption,
} from './forms';

// =============================================================================
// BUTTON COMPONENTS
// =============================================================================
export {
  Button,
} from './buttons';

export type {
  ButtonProps,
} from './buttons';

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  Modal,
  ModalFooter,
  ModalBody,
  OptimizedImage,
} from './layout';

export type {
  CardProps,
  ModalProps,
} from './layout';

// =============================================================================
// FEEDBACK COMPONENTS
// =============================================================================
export {
  ErrorBoundary,
  ErrorFallback,
  Badge,
  StatusBadge,
  CountBadge,
  NotificationBadge,
  Tooltip,
  SimpleTooltip,
  InfoTooltip,
  LoadingSpinner,
  PageLoading,
  CardLoading,
  TableLoading,
  ButtonLoading,
  SectionLoading,
  DataLoading,
  CarSkeleton,
  FormSkeleton,
  StatsSkeleton,
  ListSkeleton,
  ChatSkeleton,
} from './feedback';

export type {
  BadgeProps,
  TooltipProps,
} from './feedback';

// =============================================================================
// THEME CONFIGURATION
// =============================================================================

/**
 * Design System Colors
 * Primary brand colors used throughout the UI
 */
export const colors = {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea', // Primary purple
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899', // Primary pink
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
} as const;

/**
 * Design System Spacing
 * Consistent spacing scale
 */
export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
} as const;

/**
 * Design System Breakpoints
 * Mobile-first responsive breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Design System Typography
 * Font sizes and weights
 */
export const typography = {
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

/**
 * Finnish Translations
 * Common UI text in Finnish
 */
export const translations = {
  // Common actions
  save: 'Tallenna',
  cancel: 'Peruuta',
  delete: 'Poista',
  edit: 'Muokkaa',
  close: 'Sulje',
  back: 'Takaisin',
  next: 'Seuraava',
  previous: 'Edellinen',
  submit: 'Lähetä',
  reset: 'Nollaa',

  // Form validation
  required: 'Pakollinen kenttä',
  invalidEmail: 'Virheellinen sähköpostiosoite',
  invalidPhone: 'Virheellinen puhelinnumero',
  passwordTooShort: 'Salasana on liian lyhyt',

  // Loading states
  loading: 'Ladataan...',
  saving: 'Tallennetaan...',
  deleting: 'Poistetaan...',
  processing: 'Käsitellään...',

  // Errors
  error: 'Virhe',
  errorOccurred: 'Tapahtui virhe',
  tryAgain: 'Yritä uudelleen',
  contactSupport: 'Ota yhteyttä tukeen',

  // Success
  success: 'Onnistui',
  saved: 'Tallennettu',
  deleted: 'Poistettu',
  sent: 'Lähetetty',

  // Cars specific
  cars: 'Autot',
  car: 'Auto',
  price: 'Hinta',
  year: 'Vuosi',
  fuel: 'Polttoaine',
  transmission: 'Vaihteisto',
  mileage: 'Kilometrit',

  // Contact
  contact: 'Ota yhteyttä',
  name: 'Nimi',
  email: 'Sähköposti',
  phone: 'Puhelin',
  message: 'Viesti',

  // Navigation
  home: 'Etusivu',
  about: 'Meistä',
  services: 'Palvelut',
  testimonials: 'Arvostelut',
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get color value from theme
 */
export const getColor = (color: keyof typeof colors, shade: keyof typeof colors.primary = 600) => {
  return colors[color][shade];
};

/**
 * Get responsive breakpoint
 */
export const getBreakpoint = (size: keyof typeof breakpoints) => {
  return breakpoints[size];
};

/**
 * Get translation
 */
export const t = (key: keyof typeof translations) => {
  return translations[key];
};