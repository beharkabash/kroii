'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Send, MessageCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface CarOption {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  slug: string;
}

interface CarApiResponse {
  id: string;
  brand: string;
  model: string;
  year: number;
  slug: string;
}

export default function SubmitTestimonialPage() {
  const [cars, setCars] = useState<CarOption[]>([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 5,
    title: '',
    content: '',
    vehicleId: '',
    location: '',
    purchaseDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars?limit=100');
      const result = await response.json();
      if (result.success) {
        setCars(result.data.cars.map((car: CarApiResponse) => ({
          id: car.id,
          name: `${car.brand} ${car.model} (${car.year})`,
          make: car.brand,
          model: car.model,
          year: car.year,
          slug: car.slug,
        })));
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.content.length < 10) {
      setError('Anna vähintään 10 merkkiä pitkä arvostelu');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/services/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          vehicleId: formData.vehicleId || undefined,
          purchaseDate: formData.purchaseDate || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Arvostelun lähettäminen epäonnistui');
      }
    } catch (_error) {
      setError('Verkkovirhe. Yritä uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Kiitos arvostelustasi!
            </h1>
            <p className="text-slate-600 mb-6">
              Arvosteluasi tarkistetaan ennen julkaisua. Se ilmestyy sivustolle pian hyväksynnän jälkeen.
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Takaisin etusivulle
              </Link>
              <Link
                href="/cars"
                className="block w-full bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                Selaa autoja
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Takaisin etusivulle
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                KROI AUTO CENTER
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Jaa kokemuksesi
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Kerro muille asiakkaille kokemuksestasi Kroi Auto Centerin kanssa.
            Arvosteluasi tarkistetaan ennen julkaisua.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Henkilötiedot</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 mb-2">
                    Nimi *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Nimesi"
                  />
                </div>
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-slate-700 mb-2">
                    Sähköposti
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="esimerkki@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Arvosana</h2>
              <div className="flex items-center space-x-2 mb-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRatingClick(index + 1)}
                    className="transition-colors hover:scale-110 transform"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        index < formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-slate-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-lg font-semibold text-slate-700">
                  {formData.rating}/5
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Klikkaa tähtiä antaaksesi arvosanan
              </p>
            </div>

            {/* Review Content */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Arvostelu</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                    Otsikko (valinnainen)
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Lyhyt otsikko arvostelulle..."
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
                    Arvostelu *
                  </label>
                  <textarea
                    id="content"
                    required
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Kerro kokemuksestasi Kroi Auto Centerin kanssa. Mitä pidit palvelusta? Kuinka auto on toiminut?"
                  />
                  <p className="mt-1 text-sm text-slate-500">
                    Vähintään 10 merkkiä ({formData.content.length}/10)
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Auton tiedot (valinnainen)</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="vehicleId" className="block text-sm font-medium text-slate-700 mb-2">
                    Mikä auto?
                  </label>
                  <select
                    id="vehicleId"
                    value={formData.vehicleId}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Valitse auto...</option>
                    {cars.map(car => (
                      <option key={car.id} value={car.id}>
                        {car.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="purchaseDate" className="block text-sm font-medium text-slate-700 mb-2">
                    Ostopäivä
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                  Paikkakunta
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Esim. Helsinki"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting || formData.content.length < 10}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                {isSubmitting ? 'Lähetetään...' : 'Lähetä arvostelu'}
              </button>
              <Link
                href="/"
                className="flex-1 bg-slate-100 text-slate-700 px-8 py-4 rounded-lg font-semibold hover:bg-slate-200 transition text-center"
              >
                Peruuta
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}