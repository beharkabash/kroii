'use client';

/**
 * Admin Cars Listing Page
 * Shows all cars with management options
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Car,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  SortAsc,
  SortDesc
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CarWithDetails } from '@/app/lib/db/cars';

type SortField = 'name' | 'brand' | 'year' | 'priceEur' | 'kmNumber' | 'createdAt';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'COMING_SOON';

export default function AdminCarsPage() {
  const { data: session } = useSession();
  const [cars, setCars] = useState<CarWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const userRole = session?.user?.role;
  const canEdit = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, sortField, sortOrder, searchQuery]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) params.set('search', searchQuery);
      if (filterStatus !== 'all') params.set('status', filterStatus);
      params.set('sortBy', sortField);
      params.set('sortOrder', sortOrder);
      params.set('limit', '50'); // Show more cars in admin

      const response = await fetch(`/api/cars?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCars(data.data.cars);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectCar = (carId: string) => {
    setSelectedCars(prev =>
      prev.includes(carId)
        ? prev.filter(id => id !== carId)
        : [...prev, carId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCars.length === cars.length) {
      setSelectedCars([]);
    } else {
      setSelectedCars(cars.map(car => car.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      AVAILABLE: { icon: CheckCircle, color: 'text-green-600 bg-green-100', text: 'Saatavilla' },
      RESERVED: { icon: Clock, color: 'text-yellow-600 bg-yellow-100', text: 'Varattu' },
      SOLD: { icon: XCircle, color: 'text-red-600 bg-red-100', text: 'Myyty' },
      COMING_SOON: { icon: Clock, color: 'text-blue-600 bg-blue-100', text: 'Tulossa' },
      UNDER_MAINTENANCE: { icon: Clock, color: 'text-gray-600 bg-gray-100', text: 'Huollossa' }
    };

    const badge = badges[status as keyof typeof badges] || badges.AVAILABLE;
    const IconComponent = badge.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-slate-700 hover:text-slate-900"
    >
      <span>{children}</span>
      {sortField === field && (
        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Autojen hallinta</h1>
          <p className="text-slate-600 mt-1">
            {cars.length} autoa yhteensä
          </p>
        </div>
        {canEdit && (
          <Link
            href="/admin/cars/new"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Lisää auto
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Hae autoja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Kaikki tilat</option>
              <option value="AVAILABLE">Saatavilla</option>
              <option value="RESERVED">Varattu</option>
              <option value="SOLD">Myyty</option>
              <option value="COMING_SOON">Tulossa</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Suodattimet
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCars.length > 0 && canEdit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 border border-purple-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-purple-900">
              {selectedCars.length} autoa valittu
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition">
                Merkitse saataville
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition">
                Poista
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cars Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {canEdit && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCars.length === cars.length && cars.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Auto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <SortButton field="brand">Merkki</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <SortButton field="year">Vuosi</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <SortButton field="priceEur">Hinta</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <SortButton field="kmNumber">Kilometrit</SortButton>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tila
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <SortButton field="createdAt">Lisätty</SortButton>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Toiminnot
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {cars.map((car, index) => (
                <motion.tr
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50"
                >
                  {canEdit && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCars.includes(car.id)}
                        onChange={() => handleSelectCar(car.id)}
                        className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-16 relative rounded-lg overflow-hidden bg-slate-100 mr-4">
                        {car.images[0] ? (
                          <Image
                            src={car.images[0].url}
                            alt={car.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Car className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{car.name}</div>
                        <div className="text-sm text-slate-500">{car.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {car.brand}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {car.year}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    €{car.priceEur.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {car.kmNumber.toLocaleString()} km
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(car.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(car.createdAt).toLocaleDateString('fi-FI')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/cars/${car.slug}`}
                        className="p-2 text-slate-400 hover:text-slate-600 transition"
                        title="Näytä sivulla"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {canEdit && (
                        <>
                          <Link
                            href={`/admin/cars/${car.id}/edit`}
                            className="p-2 text-blue-400 hover:text-blue-600 transition"
                            title="Muokkaa"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            className="p-2 text-red-400 hover:text-red-600 transition"
                            title="Poista"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {cars.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Ei autoja löytynyt
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery ? 'Yritä eri hakusanoja' : 'Aloita lisäämällä ensimmäinen auto'}
            </p>
            {canEdit && (
              <Link
                href="/admin/cars/new"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <Plus className="h-4 w-4 mr-2" />
                Lisää auto
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}