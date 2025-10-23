'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Car as CarIcon,
  Search,
  SlidersHorizontal,
  X,
  Heart,
  Eye,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown
} from 'lucide-react';
import { cn } from '../lib/core/utils';
import type { Car } from '../data/cars';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 }
};

// Filter options
const FILTER_OPTIONS = {
  brands: ['BMW', 'Skoda', 'Mercedes-Benz', 'Volkswagen', 'Audi'],
  fuelTypes: ['Diesel', 'Bensiini', 'Hybridi', 'Sähkö'],
  categories: ['premium', 'family', 'suv', 'compact'],
  priceRanges: [
    { label: 'Alle €10,000', min: 0, max: 10000 },
    { label: '€10,000 - €15,000', min: 10000, max: 15000 },
    { label: '€15,000 - €20,000', min: 15000, max: 20000 },
    { label: '€20,000 - €30,000', min: 20000, max: 30000 },
    { label: 'Yli €30,000', min: 30000, max: 999999 }
  ],
  yearRanges: [
    { label: '2020-2024', min: 2020, max: 2024 },
    { label: '2018-2019', min: 2018, max: 2019 },
    { label: '2015-2017', min: 2015, max: 2017 },
    { label: 'Alle 2015', min: 0, max: 2014 }
  ]
};

const SORT_OPTIONS = [
  { value: 'newest', label: 'Uusimmat ensin', sortBy: 'year', sortOrder: 'desc' },
  { value: 'price-low', label: 'Halvin ensin', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price-high', label: 'Kallein ensin', sortBy: 'price', sortOrder: 'desc' },
  { value: 'mileage-low', label: 'Vähiten kilometrejä', sortBy: 'mileage', sortOrder: 'asc' },
  { value: 'year-new', label: 'Uusin vuosimalli', sortBy: 'year', sortOrder: 'desc' },
  { value: 'brand', label: 'Merkki A-Z', sortBy: 'make', sortOrder: 'asc' }
];

const PAGE_SIZE_OPTIONS = [12, 24, 48];

interface ActiveFilters {
  search: string;
  brands: string[];
  fuelTypes: string[];
  categories: string[];
  priceRange: { min: number; max: number } | null;
  yearRange: { min: number; max: number } | null;
}

export default function AllCarsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Load cars dynamically
  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);

  useEffect(() => {
    console.log('🚗 Starting to load cars...');
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        console.log('📡 API Response:', data);
        if (data.success && data.cars && data.cars.length > 0) {
          console.log('✅ Loading dynamic cars:', data.cars.length);
          setCars(data.cars);
        } else {
          console.log('⚠️ No dynamic cars, falling back to static');
          // Fallback to static import if needed
          import('../data/cars').then(module => {
            console.log('✅ Static cars loaded:', module.cars.length);
            setCars(module.cars);
          });
        }
      })
      .catch((error) => {
        console.error('❌ API Error:', error);
        // Fallback to static import on error
        import('../data/cars').then(module => {
          console.log('✅ Static cars loaded (error fallback):', module.cars.length);
          setCars(module.cars);
        });
      })
      .finally(() => {
        console.log('🏁 Cars loading complete');
        setCarsLoading(false);
      });
  }, []);

  // State
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Animation variant
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Initialize filters from URL
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    search: searchParams.get('search') || '',
    brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
    fuelTypes: searchParams.get('fuel')?.split(',').filter(Boolean) || [],
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    priceRange: null,
    yearRange: null
  });

  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('limit') || '12'));
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');

  // Get current sort config
  const currentSort = useMemo(() =>
    SORT_OPTIONS.find(opt => opt.value === sortOption) || SORT_OPTIONS[0],
    [sortOption]
  );

  // Update URL with current state
  const updateURL = useCallback((newFilters?: Partial<ActiveFilters>, newPage?: number, newPageSize?: number, newSort?: string) => {
    const params = new URLSearchParams();

    const filters = { ...activeFilters, ...newFilters };
    const page = newPage ?? currentPage;
    const limit = newPageSize ?? pageSize;
    const sort = newSort ?? sortOption;

    if (filters.search) params.set('search', filters.search);
    if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.fuelTypes.length > 0) params.set('fuel', filters.fuelTypes.join(','));
    if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));
    if (page > 1) params.set('page', page.toString());
    if (limit !== 12) params.set('limit', limit.toString());
    if (sort !== 'newest') params.set('sort', sort);

    const newURL = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newURL);
  }, [activeFilters, currentPage, pageSize, sortOption, pathname, router]);

  // Get filtered and paginated cars
  const { filteredCars, totalPages, totalCars, isFiltered } = useMemo(() => {
    let filtered = [...cars];

    // Apply search filter
    if (activeFilters.search) {
      const searchTerm = activeFilters.search.toLowerCase();
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(searchTerm) ||
        car.brand.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm) ||
        car.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply brand filter
    if (activeFilters.brands.length > 0) {
      filtered = filtered.filter(car => activeFilters.brands.includes(car.brand));
    }

    // Apply fuel type filter
    if (activeFilters.fuelTypes.length > 0) {
      filtered = filtered.filter(car => activeFilters.fuelTypes.includes(car.fuel));
    }

    // Apply category filter
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter(car => activeFilters.categories.includes(car.category));
    }

    // Apply price range filter
    if (activeFilters.priceRange) {
      filtered = filtered.filter(car =>
        car.priceEur >= activeFilters.priceRange!.min &&
        car.priceEur <= activeFilters.priceRange!.max
      );
    }

    // Apply year range filter
    if (activeFilters.yearRange) {
      filtered = filtered.filter(car => {
        const year = parseInt(car.year);
        return year >= activeFilters.yearRange!.min && year <= activeFilters.yearRange!.max;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (currentSort.sortBy) {
        case 'price':
          aValue = a.priceEur;
          bValue = b.priceEur;
          break;
        case 'year':
          aValue = parseInt(a.year);
          bValue = parseInt(b.year);
          break;
        case 'mileage':
          aValue = a.kmNumber;
          bValue = b.kmNumber;
          break;
        case 'make':
          aValue = a.brand.toLowerCase();
          bValue = b.brand.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return currentSort.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return currentSort.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const pages = Math.ceil(total / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    const hasActiveFilters = activeFilters.search ||
      activeFilters.brands.length > 0 ||
      activeFilters.fuelTypes.length > 0 ||
      activeFilters.categories.length > 0 ||
      activeFilters.priceRange ||
      activeFilters.yearRange;

    console.log('🔍 Filter results:', {
      totalCars: total,
      pages,
      currentPage,
      pageSize,
      paginatedCount: paginated.length,
      hasActiveFilters
    });

    return {
      filteredCars: paginated,
      totalPages: pages,
      totalCars: total,
      isFiltered: hasActiveFilters
    };
  }, [activeFilters, currentPage, pageSize, currentSort, cars.length]);

  // Handle search
  const handleSearch = useCallback((value: string) => {
    setActiveFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
    updateURL({ search: value }, 1);
  }, [updateURL]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType: keyof ActiveFilters, value: ActiveFilters[keyof ActiveFilters]) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, 1);
  }, [activeFilters, updateURL]);

  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setSortOption(value);
    updateURL(undefined, 1, undefined, value);
  }, [updateURL]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    updateURL(undefined, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateURL]);

  // Handle page size change
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    updateURL(undefined, 1, size);
  }, [updateURL]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      search: '',
      brands: [],
      fuelTypes: [],
      categories: [],
      priceRange: null,
      yearRange: null
    });
    setCurrentPage(1);
    setSortOption('newest');
    router.replace(pathname);
  }, [pathname, router]);

  // Toggle favorite
  const toggleFavorite = useCallback((carId: string) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(carId)) {
        newSet.delete(carId);
      } else {
        newSet.add(carId);
      }
      return newSet;
    });
  }, []);

  // Scroll to top handler
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Initialize loading state - wait for cars to load
  useEffect(() => {
    console.log('🔄 carsLoading changed to:', carsLoading);
    if (!carsLoading) {
      console.log('⏰ Setting isLoading to false in 100ms...');
      const timer = setTimeout(() => {
        console.log('✨ isLoading set to false, cars count:', cars.length);
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [carsLoading, cars.length]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.search) count++;
    count += activeFilters.brands.length;
    count += activeFilters.fuelTypes.length;
    count += activeFilters.categories.length;
    if (activeFilters.priceRange) count++;
    if (activeFilters.yearRange) count++;
    return count;
  }, [activeFilters]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="text-lg font-medium text-slate-700">Ladataan autoja...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Käytetyt autot - KROI AUTO CENTER",
            "description": "Laaja valikoima käytettyjä autoja. BMW, Skoda, Mercedes, Volkswagen, Audi. Laadukkaita käytettyjä autoja Helsingissä.",
            "url": "https://kroiautocenter.fi/cars",
            "numberOfItems": cars.length,
            "itemListElement": cars.map((car, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "@id": `https://kroiautocenter.fi/cars/${car.slug}`,
                "name": car.name,
                "description": car.description,
                "brand": {
                  "@type": "Brand",
                  "name": car.brand
                },
                "model": car.model,
                "vehicleModelDate": car.year,
                "mileageFromOdometer": {
                  "@type": "QuantitativeValue",
                  "value": car.kmNumber,
                  "unitText": "km"
                },
                "fuelType": car.fuel,
                "vehicleTransmission": car.transmission,
                "offers": {
                  "@type": "Offer",
                  "price": car.priceEur,
                  "priceCurrency": "EUR",
                  "availability": "https://schema.org/InStock",
                  "seller": {
                    "@type": "LocalBusiness",
                    "name": "KROI AUTO CENTER"
                  }
                },
                "image": `https://kroiautocenter.fi${car.image}`,
                "url": `https://kroiautocenter.fi/cars/${car.slug}`
              }
            }))
          })
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <motion.header
          className="bg-white shadow-sm sticky top-0 z-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg px-2 py-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Takaisin etusivulle
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <CarIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  KROI AUTO CENTER
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12 md:py-16 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center relative z-10">
              <motion.h1
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                Kaikki Autot
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                Selaa koko valikoimaamme. Meillä on {cars.length} laadukasta käytettyä autoa.
              </motion.p>
            </div>
          </div>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-16 left-4 md:left-10 w-12 md:w-16 h-12 md:h-16 bg-white/10 rounded-full"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-24 right-4 md:right-16 w-8 md:w-12 h-8 md:h-12 bg-pink-300/20 rounded-full"
            animate={{
              y: [0, 12, 0],
              x: [0, 8, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-4 left-1/4 w-6 md:w-8 h-6 md:h-8 bg-purple-300/20 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </section>

        {/* Search and Filters */}
        <motion.section
          className="bg-white border-b"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Hae merkin, mallin tai ominaisuuden mukaan..."
                    value={activeFilters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <motion.button
                onClick={() => setIsFiltersOpen(true)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium relative",
                  activeFilterCount > 0
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SlidersHorizontal className="h-5 w-5" />
                Suodattimet
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </motion.button>

              {/* View Options */}
              <div className="flex items-center gap-2">
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                >
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>{size} per sivu</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            <AnimatePresence>
              {isFiltered && (
                <motion.div
                  className="mt-4 flex flex-wrap items-center gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <span className="text-sm text-slate-600 font-medium">Aktiiviset suodattimet:</span>

                  {activeFilters.search && (
                    <motion.span
                      className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      Haku: &ldquo;{activeFilters.search}&rdquo;
                      <button
                        onClick={() => handleFilterChange('search', '')}
                        className="hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  )}

                  {activeFilters.brands.map(brand => (
                    <motion.span
                      key={brand}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {brand}
                      <button
                        onClick={() => handleFilterChange('brands', activeFilters.brands.filter(b => b !== brand))}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  ))}

                  <motion.button
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Tyhjennä kaikki
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Results Summary and Sort */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {totalCars} {totalCars === 1 ? 'auto' : 'autoa'} {isFiltered ? 'löytyi' : 'myynnissä'}
              </h2>
              {isFiltered && (
                <p className="text-slate-600">
                  Näytetään {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCars)} / {totalCars}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Cars Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {totalCars === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CarIcon className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {isFiltered ? 'Ei tuloksia' : 'Ei autoja saatavilla'}
              </h3>
              <p className="text-slate-600 mb-6">
                {isFiltered
                  ? 'Kokeile muuttaa hakuehtoja tai suodattimia.'
                  : 'Autoja ei ole tällä hetkellä myynnissä. Tarkista myöhemmin uudelleen!'
                }
              </p>
              {isFiltered && (
                <motion.button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-4 w-4" />
                  Tyhjennä suodattimet
                </motion.button>
              )}
            </motion.div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {filteredCars.map((car, index) => (
                  <motion.div
                    key={car.id}
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/cars/${car.slug}`} className="block h-full">
                      <motion.div
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full"
                        whileHover={{ y: -5 }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={car.image || '/placeholder-car.jpg'}
                            alt={car.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />

                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-sm font-bold text-purple-600">
                            {car.price}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                          {car.name}
                        </h3>

                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                          {car.description}
                        </p>

                        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-slate-500 block">Vuosi</span>
                            <span className="font-semibold text-slate-900">{car.year}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">km</span>
                            <span className="font-semibold text-slate-900">{car.km}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Polttoaine</span>
                            <span className="font-semibold text-slate-900">{car.fuel}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                          <span className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors group-hover:underline">
                            Katso lisätietoja →
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="text-sm text-slate-600">
                    Sivu {currentPage} / {totalPages}
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentPage === 1
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                      whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
                      whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        return (
                          <motion.button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={cn(
                              "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
                              pageNumber === currentPage
                                ? "bg-purple-600 text-white"
                                : "text-slate-700 hover:bg-slate-100"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {pageNumber}
                          </motion.button>
                        );
                      })}
                    </div>

                    <motion.button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentPage === totalPages
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                      whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
                      whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </main>

        {/* Filters Modal */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              className="fixed inset-0 z-50 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFiltersOpen(false)}
              />

              {/* Modal */}
              <motion.div
                className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-xl font-bold text-slate-900">Suodattimet</h3>
                    <motion.button
                      onClick={() => setIsFiltersOpen(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>

                  {/* Filter Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Brand Filter */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Merkki</h4>
                      <div className="space-y-2">
                        {FILTER_OPTIONS.brands.map(brand => (
                          <label key={brand} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={activeFilters.brands.includes(brand)}
                              onChange={(e) => {
                                const newBrands = e.target.checked
                                  ? [...activeFilters.brands, brand]
                                  : activeFilters.brands.filter(b => b !== brand);
                                handleFilterChange('brands', newBrands);
                              }}
                              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-slate-700">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Fuel Type Filter */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Polttoaine</h4>
                      <div className="space-y-2">
                        {FILTER_OPTIONS.fuelTypes.map(fuel => (
                          <label key={fuel} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={activeFilters.fuelTypes.includes(fuel)}
                              onChange={(e) => {
                                const newFuels = e.target.checked
                                  ? [...activeFilters.fuelTypes, fuel]
                                  : activeFilters.fuelTypes.filter(f => f !== fuel);
                                handleFilterChange('fuelTypes', newFuels);
                              }}
                              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-slate-700">{fuel}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Hinta</h4>
                      <div className="space-y-2">
                        {FILTER_OPTIONS.priceRanges.map(range => (
                          <label key={range.label} className="flex items-center">
                            <input
                              type="radio"
                              name="priceRange"
                              checked={activeFilters.priceRange?.min === range.min && activeFilters.priceRange?.max === range.max}
                              onChange={() => handleFilterChange('priceRange', range)}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-slate-700">{range.label}</span>
                          </label>
                        ))}
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={!activeFilters.priceRange}
                            onChange={() => handleFilterChange('priceRange', null)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-slate-700">Kaikki hinnat</span>
                        </label>
                      </div>
                    </div>

                    {/* Year Range Filter */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Vuosimalli</h4>
                      <div className="space-y-2">
                        {FILTER_OPTIONS.yearRanges.map(range => (
                          <label key={range.label} className="flex items-center">
                            <input
                              type="radio"
                              name="yearRange"
                              checked={activeFilters.yearRange?.min === range.min && activeFilters.yearRange?.max === range.max}
                              onChange={() => handleFilterChange('yearRange', range)}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-2 text-slate-700">{range.label}</span>
                          </label>
                        ))}
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="yearRange"
                            checked={!activeFilters.yearRange}
                            onChange={() => handleFilterChange('yearRange', null)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-slate-700">Kaikki vuodet</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t space-y-3">
                    <motion.button
                      onClick={clearAllFilters}
                      className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Tyhjennä kaikki
                    </motion.button>
                    <motion.button
                      onClick={() => setIsFiltersOpen(false)}
                      className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Näytä tulokset ({totalCars})
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-40 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronUp className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Etkö löytänyt sopivaa autoa?
            </motion.h2>
            <motion.p
              className="text-xl text-purple-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Kerro meille mitä etsit, niin autamme sinua löytämään täydellisen auton!
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                Ota yhteyttä
              </Link>
              <a
                href="tel:+358413188214"
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
              >
                Soita meille
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}