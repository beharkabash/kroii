'use client';

import React, { useState } from 'react';
import { Bell, Check, AlertCircle, X } from 'lucide-react';
import { cn } from '@/app/lib/core/utils';

interface AlertFormData {
  email: string;
  name: string;
  vehicleMake: string;
  vehicleModel: string;
  maxPrice: string;
  minYear: string;
  maxMileage: string;
  bodyType: string;
  fuelType: string;
}

const VEHICLE_MAKES = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Skoda', 'Toyota', 'Honda',
  'Ford', 'Opel', 'Volvo', 'Nissan', 'Mazda', 'Peugeot', 'Renault', 'Kia',
  'Hyundai', 'Seat', 'Fiat', 'Citroen', 'Mitsubishi', 'Subaru', 'Lexus'
];

const BODY_TYPES = [
  'Sedan', 'Hatchback', 'Station Wagon', 'SUV', 'Coupe', 'Convertible',
  'Pickup', 'Van', 'Crossover', 'Minivan'
];

const FUEL_TYPES = [
  'Bensiini', 'Diesel', 'Hybridi', 'Sähkö', 'Plug-in hybridi', 'CNG', 'LPG'
];

interface InventoryAlertsProps {
  className?: string;
}

export default function InventoryAlerts({ className }: InventoryAlertsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<AlertFormData>({
    email: '',
    name: '',
    vehicleMake: '',
    vehicleModel: '',
    maxPrice: '',
    minYear: '',
    maxMileage: '',
    bodyType: '',
    fuelType: '',
  });

  const handleInputChange = (field: keyof AlertFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const criteria = {
        vehicleMake: formData.vehicleMake || undefined,
        vehicleModel: formData.vehicleModel || undefined,
        maxPrice: formData.maxPrice ? parseInt(formData.maxPrice) : undefined,
        minYear: formData.minYear ? parseInt(formData.minYear) : undefined,
        maxMileage: formData.maxMileage ? parseInt(formData.maxMileage) : undefined,
        bodyType: formData.bodyType || undefined,
        fuelType: formData.fuelType || undefined,
      };

      const response = await fetch('/api/cars/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name || undefined,
          criteria,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          email: '',
          name: '',
          vehicleMake: '',
          vehicleModel: '',
          maxPrice: '',
          minYear: '',
          maxMileage: '',
          bodyType: '',
          fuelType: '',
        });
        setTimeout(() => {
          setIsOpen(false);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Jokin meni pieleen');
      }
    } catch (error) {
      console.error('Error submitting alert:', error);
      setSubmitStatus('error');
      setErrorMessage('Verkkoyhteysongelma. Yritä uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      vehicleMake: '',
      vehicleModel: '',
      maxPrice: '',
      minYear: '',
      maxMileage: '',
      bodyType: '',
      fuelType: '',
    });
    setSubmitStatus(null);
    setErrorMessage('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors",
          className
        )}
      >
        <Bell className="h-5 w-5" />
        <span>Saa ilmoitus uusista autoista</span>
      </button>
    );
  }

  return (
    <div className={cn("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", className)}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Varoitus uusista autoista
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Saat sähköpostiin ilmoituksen, kun kriteerisi täyttävä auto tulee myyntiin.
          </p>

          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-800">
                Ilmoitushälytys luotu onnistuneesti! Saat sähköpostiin ilmoituksen sopivista autoista.
              </span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sähköpostiosoite *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="oma@email.fi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nimi (valinnainen)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Etunimi Sukunimi"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merkki
                </label>
                <select
                  value={formData.vehicleMake}
                  onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Kaikki merkit</option>
                  {VEHICLE_MAKES.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Malli
                </label>
                <input
                  type="text"
                  value={formData.vehicleModel}
                  onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="esim. A4, Golf, X5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enimmäishinta (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.maxPrice}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vähimmäisvuosimalli
                </label>
                <input
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={formData.minYear}
                  onChange={(e) => handleInputChange('minYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="2020"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enimmäiskilometrit
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.maxMileage}
                  onChange={(e) => handleInputChange('maxMileage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="100000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Korimalli
                </label>
                <select
                  value={formData.bodyType}
                  onChange={(e) => handleInputChange('bodyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Kaikki korimallit</option>
                  {BODY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Polttoaine
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Kaikki polttoaineet</option>
                  {FUEL_TYPES.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !formData.email}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Luodaan...' : 'Luo hälytys'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Tyhjennä
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}