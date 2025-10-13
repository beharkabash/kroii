'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Trash2,
  Eye,
  Calendar,
  Fuel,
  Gauge,
  Car,
  ArrowRight,
  Filter,
  SortDesc,
  Grid3X3,
  List,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FavoriteVehicle {
  id: string;
  vehicleId: string;
  addedAt: string;
  vehicle: {
    id: string;
    slug: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    bodyType: string;
    color: string;
    images: string;
    status: string;
  };
}

type ViewMode = 'grid' | 'list';
type SortOption = 'addedAt' | 'price' | 'year' | 'mileage';

export default function CustomerFavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteVehicle[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<FavoriteVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('addedAt');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);

  useEffect(() => {
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  useEffect(() => {
    filterAndSortFavorites();
  }, [favorites, searchTerm, selectedMakes, sortBy]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/customer/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortFavorites = () => {
    let filtered = [...favorites];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(fav =>
        `${fav.vehicle.make} ${fav.vehicle.model} ${fav.vehicle.year}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Make filter
    if (selectedMakes.length > 0) {
      filtered = filtered.filter(fav =>
        selectedMakes.includes(fav.vehicle.make)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'addedAt':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'price':
          return a.vehicle.price - b.vehicle.price;
        case 'year':
          return b.vehicle.year - a.vehicle.year;
        case 'mileage':
          return a.vehicle.mileage - b.vehicle.mileage;
        default:
          return 0;
      }
    });

    setFilteredFavorites(filtered);
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const response = await fetch(`/api/customer/favorites/${favoriteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const availableMakes = Array.from(new Set(favorites.map(fav => fav.vehicle.make))).sort();

  const sortOptions = [
    { value: 'addedAt', label: 'Lisätty viimeksi' },
    { value: 'price', label: 'Hinta (alhaisin ensin)' },
    { value: 'year', label: 'Vuosimalli (uusin ensin)' },
    { value: 'mileage', label: 'Kilometrit (vähiten ensin)' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Ladataan suosikkeja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                Suosikkiautot
              </h1>
              <p className="text-slate-600 mt-1">
                {favorites.length} tallennettu auto
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Ei vielä suosikkiautoja
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Aloita autojen selaaminen ja lisää kiinnostavat autot suosikkeihisi helposti käsin.
            </p>
            <Link
              href="/inventory"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Car className="h-5 w-5 mr-2" />
              Selaa autoja
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Filters and Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Search */}
                <div className="flex-1 lg:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Hae autoja..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Make Filter */}
                  {availableMakes.length > 1 && (
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-slate-400" />
                      <select
                        value={selectedMakes.join(',')}
                        onChange={(e) => setSelectedMakes(e.target.value ? e.target.value.split(',') : [])}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Kaikki merkit</option>
                        {availableMakes.map(make => (
                          <option key={make} value={make}>{make}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <SortDesc className="h-4 w-4 text-slate-400" />
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
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center border border-slate-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-slate-400'} hover:bg-slate-50 transition`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-slate-400'} hover:bg-slate-50 transition`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Grid/List */}
            <AnimatePresence mode="wait">
              {filteredFavorites.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Ei hakutuloksia
                  </h3>
                  <p className="text-slate-600">
                    Yritä muuttaa hakukritereitä tai poista suodattimia.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${viewMode}-${filteredFavorites.length}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredFavorites.map((favorite, index) => {
                    const vehicle = favorite.vehicle;
                    const images = JSON.parse(vehicle.images || '[]');
                    const primaryImage = images[0] || '/images/placeholder-car.jpg';

                    return (
                      <motion.div
                        key={favorite.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 group ${
                          viewMode === 'list' ? 'flex' : ''
                        }`}
                      >
                        {/* Image */}
                        <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-[4/3]'}`}>
                          <Image
                            src={primaryImage}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={() => removeFavorite(favorite.id)}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {vehicle.status !== 'AVAILABLE' && (
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                                {vehicle.status === 'SOLD' ? 'Myyty' : 'Varattu'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <div className={`${viewMode === 'list' ? 'flex justify-between h-full' : ''}`}>
                            <div className={viewMode === 'list' ? 'flex-1' : ''}>
                              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                {vehicle.make} {vehicle.model}
                              </h3>

                              <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {vehicle.year}
                                </div>
                                <div className="flex items-center">
                                  <Gauge className="h-4 w-4 mr-1" />
                                  {vehicle.mileage.toLocaleString()} km
                                </div>
                                <div className="flex items-center">
                                  <Fuel className="h-4 w-4 mr-1" />
                                  {vehicle.fuelType}
                                </div>
                              </div>

                              <p className="text-2xl font-bold text-purple-600 mb-4">
                                €{vehicle.price.toLocaleString()}
                              </p>

                              <p className="text-xs text-slate-500">
                                Lisätty suosikkeihin {new Date(favorite.addedAt).toLocaleDateString('fi-FI')}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className={`${viewMode === 'list' ? 'flex flex-col justify-center ml-6' : 'mt-4'}`}>
                              <Link
                                href={`/cars/${vehicle.slug || vehicle.id}`}
                                className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Katso auto
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}