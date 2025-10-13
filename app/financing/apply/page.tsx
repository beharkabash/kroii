'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, User, Briefcase, FileText, Calculator, CheckCircle, Euro, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface CarOption {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  priceEur: number;
  slug: string;
}

interface CarApiResponse {
  id: string;
  brand: string;
  model: string;
  year: number;
  priceEur: number;
  slug: string;
}

export default function FinancingApplicationPage() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('vehicleId');
  const vehiclePrice = searchParams.get('price');

  const [cars, setCars] = useState<CarOption[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Personal Information
    customerName: '',
    customerEmail: '',
    customerPhone: '',

    // Financial Information
    annualIncome: '',
    employment: '',
    creditScore: '',

    // Loan Information
    vehicleId: vehicleId || '',
    loanAmount: vehiclePrice ? parseInt(vehiclePrice) * 0.8 : '',
    downPayment: vehiclePrice ? parseInt(vehiclePrice) * 0.2 : '',
    loanTerm: '60',

    // Additional Information
    notes: '',
  });

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
          priceEur: car.priceEur,
          slug: car.slug,
        })));
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleChange = (carId: string) => {
    const selectedCar = cars.find(car => car.id === carId);
    if (selectedCar) {
      setFormData(prev => ({
        ...prev,
        vehicleId: carId,
        loanAmount: Math.round(selectedCar.priceEur * 0.8).toString(),
        downPayment: Math.round(selectedCar.priceEur * 0.2).toString(),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        vehicleId: carId,
        loanAmount: '',
        downPayment: '',
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/finance-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          annualIncome: parseInt(String(formData.annualIncome)),
          loanAmount: parseInt(String(formData.loanAmount)),
          downPayment: parseInt(String(formData.downPayment)),
          loanTerm: parseInt(String(formData.loanTerm)),
          vehicleId: formData.vehicleId || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Hakemuksen lähettäminen epäonnistui');
      }
    } catch (_error) {
      setError('Verkkovirhe. Yritä uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Henkilötiedot', icon: User },
    { id: 2, title: 'Taloustiedot', icon: Briefcase },
    { id: 3, title: 'Lainatiedot', icon: Calculator },
  ];

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
              Kiitos hakemuksestasi!
            </h1>
            <p className="text-slate-600 mb-6">
              Rahoitushakemuksesi on vastaanotettu. Käsittelemme sen ja otamme sinuun yhteyttä 1-2 arkipäivän kuluessa.
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
                <CreditCard className="h-5 w-5 text-white" />
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
            Rahoitushakemus
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Täytä hakemus alle ja saat rahoitustarjouksen 1-2 arkipäivän kuluessa.
            Kaikki tiedot käsitellään luottamuksellisesti.
          </p>
        </div>
      </section>

      {/* Progress Indicator */}
      <div className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center h-12 w-12 rounded-full border-2 transition ${
                  currentStep >= step.id
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-slate-300 text-slate-400'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-purple-600' : 'text-slate-400'
                  }`}>
                    Vaihe {step.id}
                  </p>
                  <p className={`text-lg font-semibold ${
                    currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-8 h-1 w-24 ${
                    currentStep > step.id ? 'bg-purple-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Henkilötiedot</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nimi *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Etunimi Sukunimi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sähköposti *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="esimerkki@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Puhelinnumero *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="+358 40 123 4567"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Financial Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Taloustiedot</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vuositulot (brutto) *
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      required
                      value={formData.annualIncome}
                      onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="35000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Työsuhde *
                  </label>
                  <select
                    required
                    value={formData.employment}
                    onChange={(e) => handleInputChange('employment', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Valitse työsuhde</option>
                    <option value="PERMANENT">Vakinainen työsuhde</option>
                    <option value="TEMPORARY">Määräaikainen työsuhde</option>
                    <option value="ENTREPRENEUR">Yrittäjä</option>
                    <option value="PENSIONER">Eläkeläinen</option>
                    <option value="STUDENT">Opiskelija</option>
                    <option value="UNEMPLOYED">Työtön</option>
                    <option value="OTHER">Muu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Luottoluokitus (jos tiedossa)
                  </label>
                  <select
                    value={formData.creditScore}
                    onChange={(e) => handleInputChange('creditScore', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">En tiedä / En halua kertoa</option>
                    <option value="EXCELLENT">Erinomainen (750+)</option>
                    <option value="GOOD">Hyvä (650-749)</option>
                    <option value="FAIR">Kohtalainen (550-649)</option>
                    <option value="POOR">Huono (alle 550)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 3: Loan Information */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Lainatiedot</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Auto (valinnainen)
                  </label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => handleVehicleChange(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Valitse auto tai jätä tyhjäksi</option>
                    {cars.map(car => (
                      <option key={car.id} value={car.id}>
                        {car.name} - {car.priceEur.toLocaleString()}€
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lainasumma *
                    </label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="number"
                        required
                        value={formData.loanAmount}
                        onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="25000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Käsiraha
                    </label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="number"
                        value={formData.downPayment}
                        onChange={(e) => handleInputChange('downPayment', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="5000"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Laina-aika *
                  </label>
                  <select
                    required
                    value={formData.loanTerm}
                    onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="12">1 vuosi</option>
                    <option value="24">2 vuotta</option>
                    <option value="36">3 vuotta</option>
                    <option value="48">4 vuotta</option>
                    <option value="60">5 vuotta</option>
                    <option value="72">6 vuotta</option>
                    <option value="84">7 vuotta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lisätietoja (valinnainen)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Kerro meille lisätietoja rahoitustarpeistasi..."
                  />
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 mt-8 border-t border-slate-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edellinen
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Seuraava
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  {isSubmitting ? 'Lähetetään...' : 'Lähetä hakemus'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Tarvitsetko apua?</h3>
          <p className="text-purple-100 mb-6">
            Ota meihin yhteyttä, niin autamme sinua rahoitushakemuksen kanssa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/358413188214?text=Hei! Tarvitsen apua rahoitushakemuksen kanssa."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp
            </a>
            <a
              href="tel:+358413188214"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition"
            >
              <Phone className="h-5 w-5 mr-2" />
              +358 41 3188214
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}