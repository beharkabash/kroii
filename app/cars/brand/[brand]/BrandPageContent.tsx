'use client';

/**
 * Brand Page Content
 * Client component for displaying cars from a specific brand
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Grid,
  List,
  Search,
  ArrowLeft,
  MessageCircle,
  Phone,
  MapPin,
  Star,
  Award,
  Shield
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getPlaceholder } from '@/app/lib/image-placeholder';

interface BrandPageContentProps {
  cars: any[];
  brandName: string;
  brandDescription: string;
  brand: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'price-asc' | 'price-desc' | 'year-desc' | 'year-asc' | 'km-asc' | 'km-desc' | 'name-asc';

export default function BrandPageContent({
  cars: initialCars,
  brandName,
  brandDescription,
  brand
}: BrandPageContentProps) {
  const [cars, setCars] = useState(initialCars);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort cars
  const filteredAndSortedCars = cars
    .filter(car => {
      if (!searchQuery) return true;
      return (
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      const [field, order] = sortBy.split('-');
      let aValue: any, bValue: any;

      switch (field) {
        case 'price':
          aValue = a.priceEur;
          bValue = b.priceEur;
          break;
        case 'year':
          aValue = parseInt(a.year);
          bValue = parseInt(b.year);
          break;
        case 'km':
          aValue = a.kmNumber;
          bValue = b.kmNumber;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        default:
          return 0;
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const sortOptions = [
    { value: 'price-asc', label: 'Hinta: Halvin ensin' },
    { value: 'price-desc', label: 'Hinta: Kallein ensin' },
    { value: 'year-desc', label: 'Vuosi: Uusin ensin' },
    { value: 'year-asc', label: 'Vuosi: Vanhin ensin' },
    { value: 'km-asc', label: 'Kilometrit: Vähiten ensin' },
    { value: 'km-desc', label: 'Kilometrit: Eniten ensin' },
    { value: 'name-asc', label: 'Malli: A-Z' }
  ];

  // Calculate brand statistics
  const avgPrice = cars.length > 0
    ? Math.round(cars.reduce((sum, car) => sum + car.priceEur, 0) / cars.length)
    : 0;

  const newestYear = cars.length > 0
    ? Math.max(...cars.map(car => parseInt(car.year)))
    : 0;

  const oldestYear = cars.length > 0
    ? Math.min(...cars.map(car => parseInt(car.year)))
    : 0;

  const getBrandLogo = (brandName: string) => {
    // In a real implementation, these would be actual brand logos
    const logos: Record<string, string> = {
      'bmw': '🔷',
      'volkswagen': '🔵',
      'audi': '⭕',
      'mercedes': '⭐',
      'mercedes-benz': '⭐',
      'skoda': '💚',
      'volvo': '🔶',
      'toyota': '🔴',
      'ford': '🔹',
      'opel': '⚡'
    };
    return logos[brandName.toLowerCase()] || '🚗';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              href="/"
              className="p-2 text-purple-300 hover:text-white transition"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="text-6xl">
              {getBrandLogo(brandName)}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {brandName} <span className="text-purple-400">autot</span>
              </h1>
              <p className="text-lg md:text-xl text-purple-100 mb-8 leading-relaxed">
                {brandDescription}
              </p>

              {/* Brand Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{cars.length}</div>
                  <div className="text-sm text-purple-200">Autoa saatavilla</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">€{avgPrice.toLocaleString()}</div>
                  <div className="text-sm text-purple-200">Keskihinta</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white">{newestYear}</div>
                  <div className="text-sm text-purple-200">Uusin malli</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative h-80 w-full"
              >
                {cars.length > 0 && cars[0].image ? (
                  <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={cars[0].image}
                      alt={`${brandName} auto`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                ) : (
                  <div className="h-full bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Car className="h-32 w-32 text-white opacity-50" />
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative max-w-md flex-1 md:mr-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Hae ${brandName} mallia...`}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-4">
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
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            {filteredAndSortedCars.length === cars.length
              ? `${cars.length} ${brandName} autoa`
              : `${filteredAndSortedCars.length} / ${cars.length} ${brandName} autoa`
            }
            {searchQuery && ` hakusanalla "${searchQuery}"`}
          </p>
        </div>

        {/* Cars Grid/List */}
        {filteredAndSortedCars.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">{getBrandLogo(brandName)}</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchQuery ? 'Ei hakutuloksia' : `Ei ${brandName} autoja saatavilla`}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchQuery
                ? `Yritä eri hakusanoja tai selaa muita ${brandName} malleja.`
                : `${brandName} autoja lisätään valikoimaan säännöllisesti. Tarkista myöhemmin uudelleen!`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
                >
                  Näytä kaikki {brandName} autot
                </button>
              )}
              <Link
                href="/search"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Selaa kaikkia merkkejä
              </Link>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {filteredAndSortedCars.map((car, index) => (
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
                      {car.image ? (
                        <Image
                          src={car.image}
                          alt={car.name}
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
                        {car.name}
                      </h3>
                      <p className="text-2xl md:text-3xl font-bold text-purple-600 mb-4">
                        {car.price}
                      </p>
                      <div className={`space-y-2 text-sm text-slate-600 ${
                        viewMode === 'list' ? 'grid grid-cols-2 gap-2' : ''
                      }`}>
                        <p>📅 {car.year}</p>
                        <p>⛽ {car.fuel}</p>
                        <p>⚙️ {car.transmission}</p>
                        <p>🛣️ {car.km}</p>
                      </div>
                      {viewMode === 'list' && (
                        <p className="text-slate-600 mt-4 line-clamp-2">
                          {car.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Link>
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`https://wa.me/358413188214?text=Hei! Olen kiinnostunut ${brandName} autosta: ${car.name}`, '_blank');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition text-center"
                >
                  Kysy lisää
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Brand Promise Section */}
        {cars.length > 0 && (
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Miksi valita {brandName}?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Laatu</h3>
                <p className="text-slate-600 text-sm">
                  Kaikki {brandName} automme on tarkastettu ja huollettu ammattitaidolla
                </p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Luotettavuus</h3>
                <p className="text-slate-600 text-sm">
                  Takaamme {brandName} autojen teknisen kunnon ja historiatiedot
                </p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Palvelu</h3>
                <p className="text-slate-600 text-sm">
                  Henkilökohtainen palvelu ja asiantunteva neuvonta koko ostoprosessin ajan
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Kiinnostunut {brandName} autoista?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Asiantuntijamme auttavat sinua löytämään täydellisen {brandName} auton!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <a
              href="tel:+358413188214"
              className="flex items-center space-x-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
            >
              <Phone className="h-5 w-5" />
              <span>Soita: +358 41 3188214</span>
            </a>
            <a
              href={`https://wa.me/358413188214?text=Hei! Olen kiinnostunut ${brandName} autoista`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/#contact"
              className="flex items-center space-x-3 px-6 py-3 border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white rounded-lg font-semibold transition"
            >
              <MapPin className="h-5 w-5" />
              <span>Käy paikan päällä</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}