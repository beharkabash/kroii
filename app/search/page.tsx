'use client';

/**
 * Car Search Page
 * Advanced search and filtering for cars on the public website
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Car,
  MapPin,
  Phone,
  MessageCircle,
  Grid,
  List
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CarWithDetails } from '@/app/lib/db/cars';
import { getPlaceholder } from '@/app/lib/image-placeholder';

interface SearchFilters {
  query: string;
  brand: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  fuel: string;
  transmission: string;
  minKm: string;
  maxKm: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'km-asc' | 'km-desc' | 'name-asc';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cars, setCars] = useState<CarWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [totalResults, setTotalResults] = useState(0);

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    fuel: searchParams.get('fuel') || '',
    transmission: searchParams.get('transmission') || '',
    minKm: searchParams.get('minKm') || '',
    maxKm: searchParams.get('maxKm') || ''
  });

  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    fetchSearchMetadata();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
      updateURL();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy]);

  const fetchSearchMetadata = async () => {
    try {
      const response = await fetch('/api/cars/search', {
        method: 'POST'
      });
      const result = await response.json();

      if (result.success) {
        setBrands(result.data.brands);
      }
    } catch (error) {
      console.error('Error fetching search metadata:', error);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add search parameters
      if (filters.query) params.set('q', filters.query);
      if (filters.brand) params.set('brand', filters.brand);
      if (filters.category) params.set('category', filters.category);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.minYear) params.set('minYear', filters.minYear);
      if (filters.maxYear) params.set('maxYear', filters.maxYear);
      if (filters.fuel) params.set('fuel', filters.fuel);
      if (filters.transmission) params.set('transmission', filters.transmission);

      // Add sorting
      const [sortField, sortOrder] = sortBy.split('-');
      params.set('sortBy', sortField);
      params.set('sortOrder', sortOrder);
      params.set('limit', '20');

      const response = await fetch(`/api/cars/search?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setCars(result.data.cars);
        setTotalResults(result.data.total);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    if (sortBy !== 'price-asc') {
      params.set('sort', sortBy);
    }

    const newURL = `/search${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newURL, { scroll: false });
  }, [filters, sortBy, router]);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      brand: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      fuel: '',
      transmission: '',
      minKm: '',
      maxKm: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  const sortOptions = [
    { value: 'price-asc', label: 'Hinta: Halvin ensin' },
    { value: 'price-desc', label: 'Hinta: Kallein ensin' },
    { value: 'year-desc', label: 'Vuosi: Uusin ensin' },
    { value: 'year-asc', label: 'Vuosi: Vanhin ensin' },
    { value: 'km-asc', label: 'Kilometrit: Vähiten ensin' },
    { value: 'km-desc', label: 'Kilometrit: Eniten ensin' },
    { value: 'name-asc', label: 'Nimi: A-Z' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Hae autoja</h1>
              <p className="text-slate-600 mt-1">
                {loading ? 'Haetaan...' : `${totalResults} autoa löytyi`}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-600'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Suodattimet
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                placeholder="Hae merkillä, mallilla tai kuvauksella..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:w-80 flex-shrink-0"
              >
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">Suodattimet</h2>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        Tyhjennä
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Brand Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Merkki
                      </label>
                      <select
                        value={filters.brand}
                        onChange={(e) => updateFilter('brand', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Kaikki merkit</option>
                        {brands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Kategoria
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) => updateFilter('category', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Kaikki kategoriat</option>
                        <option value="FAMILY">Perheauto</option>
                        <option value="SUV">SUV</option>
                        <option value="PREMIUM">Premium</option>
                        <option value="COMPACT">Kompakti</option>
                        <option value="LUXURY">Luksus</option>
                        <option value="SPORTS">Urheilu</option>
                        <option value="ELECTRIC">Sähkö</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Hinta (EUR)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={filters.minPrice}
                          onChange={(e) => updateFilter('minPrice', e.target.value)}
                          placeholder="Minimi"
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="number"
                          value={filters.maxPrice}
                          onChange={(e) => updateFilter('maxPrice', e.target.value)}
                          placeholder="Maksimi"
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    {/* Year Range */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Vuosimalli
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={filters.minYear}
                          onChange={(e) => updateFilter('minYear', e.target.value)}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Alkaen</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <select
                          value={filters.maxYear}
                          onChange={(e) => updateFilter('maxYear', e.target.value)}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Asti</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Fuel Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Polttoaine
                      </label>
                      <select
                        value={filters.fuel}
                        onChange={(e) => updateFilter('fuel', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Kaikki</option>
                        <option value="DIESEL">Diesel</option>
                        <option value="PETROL">Bensiini</option>
                        <option value="ELECTRIC">Sähkö</option>
                        <option value="HYBRID">Hybridi</option>
                        <option value="PLUGIN_HYBRID">Lataushybridi</option>
                      </select>
                    </div>

                    {/* Transmission */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Vaihteisto
                      </label>
                      <select
                        value={filters.transmission}
                        onChange={(e) => updateFilter('transmission', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Kaikki</option>
                        <option value="AUTOMATIC">Automaatti</option>
                        <option value="MANUAL">Manuaali</option>
                        <option value="SEMI_AUTOMATIC">Puoliautomaatti</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Ei hakutuloksia
                </h3>
                <p className="text-slate-600 mb-6">
                  Yritä muuttaa hakukriteereitä löytääksesi sopivia autoja.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Tyhjennä suodattimet
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {cars.map((car, index) => {
                  const convertedCar = {
                    id: car.slug,
                    slug: car.slug,
                    name: car.name,
                    brand: car.brand,
                    model: car.model,
                    price: `€${car.priceEur.toLocaleString()}`,
                    priceEur: car.priceEur,
                    year: car.year.toString(),
                    fuel: car.fuel,
                    transmission: car.transmission,
                    km: `${car.kmNumber.toLocaleString()} km`,
                    kmNumber: car.kmNumber,
                    image: car.images[0]?.url || '',
                    description: car.description,
                    category: car.category.toLowerCase()
                  };

                  return (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <Link href={`/cars/${car.slug}`} className="block">
                        <motion.div
                          whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(168,85,168,0.2)' }}
                          className={`bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-purple-300 transition-all duration-300 cursor-pointer h-full ${
                            viewMode === 'list' ? 'flex' : ''
                          }`}
                        >
                          <div className={`relative bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden ${
                            viewMode === 'list' ? 'w-64 h-48' : 'h-48'
                          }`}>
                            {convertedCar.image ? (
                              <Image
                                src={convertedCar.image}
                                alt={convertedCar.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes={viewMode === 'list' ? '256px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                                loading={index < 6 ? 'eager' : 'lazy'}
                                priority={index < 6}
                                placeholder="blur"
                                blurDataURL={getPlaceholder(400, 192)}
                              />
                            ) : (
                              <div className="h-full flex items-center justify-center">
                                <Car className="h-24 w-24 text-purple-400" />
                              </div>
                            )}
                          </div>
                          <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition">
                              {convertedCar.name}
                            </h3>
                            <p className="text-2xl md:text-3xl font-bold text-purple-600 mb-4">
                              {convertedCar.price}
                            </p>
                            <div className={`space-y-2 text-sm text-slate-600 ${
                              viewMode === 'list' ? 'grid grid-cols-2 gap-2' : ''
                            }`}>
                              <p>📅 {convertedCar.year}</p>
                              <p>⛽ {convertedCar.fuel}</p>
                              <p>⚙️ {convertedCar.transmission}</p>
                              <p>🛣️ {convertedCar.km}</p>
                            </div>
                            {viewMode === 'list' && (
                              <p className="text-slate-600 mt-4 line-clamp-2">
                                {convertedCar.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(`https://wa.me/358413188214?text=Hei! Olen kiinnostunut autosta: ${convertedCar.name}`, '_blank');
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition text-center"
                      >
                        Kysy lisää
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Etkö löytänyt sopivaa autoa?</h2>
          <p className="text-slate-300 mb-6">
            Ota yhteyttä, niin autamme sinua löytämään unelmiesi auton!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="tel:+358413188214"
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition"
            >
              <Phone className="h-5 w-5" />
              <span>+358 41 3188214</span>
            </a>
            <a
              href="https://wa.me/358413188214"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/#contact"
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition"
            >
              <MapPin className="h-5 w-5" />
              <span>Läkkisepäntie 15 B, Helsinki</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}