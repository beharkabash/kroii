'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, Upload, Camera, CheckCircle, User, Cog, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TradeInValuationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Personal Information
    customerName: '',
    customerEmail: '',
    customerPhone: '',

    // Vehicle Information
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear() - 5,
    vehicleMileage: '',
    vehicleCondition: 'GOOD',
    hasAccidents: false,
    hasServiceHistory: true,
    notes: '',

    // Photos
    vehiclePhotos: '',
  });

  const carMakes = [
    'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Skoda', 'Toyota',
    'Honda', 'Ford', 'Opel', 'Peugeot', 'Renault', 'Nissan', 'Volvo',
    'Mazda', 'Hyundai', 'Kia', 'Citroën', 'SEAT', 'Fiat', 'Muu'
  ];

  const conditions = [
    { value: 'EXCELLENT', label: 'Erinomainen', description: 'Ei naarmuja, täydellinen kunto' },
    { value: 'VERY_GOOD', label: 'Erittäin hyvä', description: 'Pieniä naarmuja, hyvä kunto' },
    { value: 'GOOD', label: 'Hyvä', description: 'Normaalia kulumaa, toimintakuntoinen' },
    { value: 'FAIR', label: 'Tyydyttävä', description: 'Näkyviä kulumisen merkkejä' },
    { value: 'POOR', label: 'Huono', description: 'Huomattavia vaurioita tai korjaustarpeita' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      const response = await fetch('/api/trade-in-valuations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          vehicleYear: parseInt(formData.vehicleYear.toString()),
          vehicleMileage: parseInt(formData.vehicleMileage),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'Arvioinnin pyytäminen epäonnistui');
      }
    } catch (_error) {
      setError('Verkkovirhe. Yritä uudelleen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Henkilötiedot', icon: User },
    { id: 2, title: 'Auton tiedot', icon: Cog },
    { id: 3, title: 'Kuvat & lisätiedot', icon: Camera },
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
              Kiitos pyynnöstäsi!
            </h1>
            <p className="text-slate-600 mb-6">
              Olemme vastaanottaneet vaihtoautosi tiedot. Lähetämme sinulle tarkan hinta-arvion
              sähköpostitse 1-2 arkipäivän kuluessa.
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
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
              href="/trade-in"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Takaisin arvioijaan
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                KROI AUTO CENTER
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Vaihtoauton tarkka arviointi
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Täytä lomake alla ja saat tarkan hinta-arvion autostasi.
            Käsittelemme kaikki tiedot luottamuksellisesti.
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
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 text-slate-400'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'
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
                    currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'
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
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Yhteystiedot</h2>

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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="esimerkki@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Puhelinnumero
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="+358 40 123 4567"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Vehicle Information */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Auton tiedot</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Merkki *
                    </label>
                    <select
                      required
                      value={formData.vehicleMake}
                      onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Valitse merkki</option>
                      {carMakes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Malli *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vehicleModel}
                      onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Esim. A4, Golf, C-Class"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Vuosimalli *
                    </label>
                    <select
                      required
                      value={formData.vehicleYear}
                      onChange={(e) => handleInputChange('vehicleYear', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mittarilukema (km) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.vehicleMileage}
                      onChange={(e) => handleInputChange('vehicleMileage', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="125000"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Auton kunto *
                  </label>
                  <div className="space-y-3">
                    {conditions.map(condition => (
                      <label key={condition.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                        <input
                          type="radio"
                          name="condition"
                          value={condition.value}
                          checked={formData.vehicleCondition === condition.value}
                          onChange={(e) => handleInputChange('vehicleCondition', e.target.value)}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium text-slate-900">{condition.label}</div>
                          <div className="text-sm text-slate-600">{condition.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <label className="flex items-center space-x-3 cursor-pointer p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                    <input
                      type="checkbox"
                      checked={formData.hasAccidents}
                      onChange={(e) => handleInputChange('hasAccidents', e.target.checked)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-slate-900">Kolarihistoria</div>
                      <div className="text-sm text-slate-600">Auto on ollut kolarissa</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                    <input
                      type="checkbox"
                      checked={formData.hasServiceHistory}
                      onChange={(e) => handleInputChange('hasServiceHistory', e.target.checked)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-slate-900">Huoltohistoria</div>
                      <div className="text-sm text-slate-600">Täydellinen huoltokirja</div>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Step 3: Photos and Additional Info */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Kuvat ja lisätiedot</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Auton kuvat (valinnainen)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-400 transition">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">
                      Lataa auton kuvia paremman arvion saamiseksi
                    </p>
                    <p className="text-sm text-slate-500">
                      PNG, JPG tai HEIC. Maksimi 10MB per kuva.
                    </p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Valitse tiedostot
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Suositeltavia kuvia: edestä, takaa, sisältä, mittarilukema, mahdolliset vauriot
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lisätietoja (valinnainen)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Kerro lisää autosta: varusteet, huollot, vauriot, erityispiirteet..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Mitä tapahtuu seuraavaksi?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Lähetämme sinulle sähköpostitse alustavan hinta-arvion 1-2 arkipäivässä</li>
                    <li>• Sovimme auton tarkastuksesta tarkemman arvion tekemistä varten</li>
                    <li>• Lopullinen tarjous auton näkemisen ja testauksen jälkeen</li>
                    <li>• Kaupat voidaan tehdä saman tien, jos hinta sopii</li>
                  </ul>
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Seuraava
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FileText className="h-5 w-5" />
                  {isSubmitting ? 'Lähetetään...' : 'Pyydä arvio'}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}