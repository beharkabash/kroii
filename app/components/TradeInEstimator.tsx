'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Calculator, Zap, Clock, FileText, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface TradeInEstimatorProps {
  className?: string;
  compact?: boolean;
}

export default function TradeInEstimator({
  className = '',
  compact = false
}: TradeInEstimatorProps) {
  const [formData, setFormData] = useState({
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear() - 5,
    vehicleMileage: 100000,
    vehicleCondition: 'GOOD',
    hasAccidents: false,
    hasServiceHistory: true,
  });

  const [estimate, setEstimate] = useState<{
    marketValue: number;
    offerValue: number;
    range: { min: number; max: number };
  } | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);

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

  const calculateEstimate = () => {
    setIsCalculating(true);

    // Simulate calculation time
    setTimeout(() => {
      // Simplified estimation algorithm (matches the server-side logic)
      const makeValues: { [key: string]: number } = {
        'BMW': 35000,
        'Mercedes-Benz': 40000,
        'Audi': 35000,
        'Volkswagen': 25000,
        'Skoda': 20000,
        'Toyota': 25000,
        'Honda': 22000,
        'Ford': 20000,
        'Opel': 18000,
        'Peugeot': 18000,
        'Renault': 17000,
        'Nissan': 20000,
        'Volvo': 30000,
      };

      const baseValue = makeValues[formData.vehicleMake] || 20000;
      const vehicleAge = currentYear - formData.vehicleYear;

      // Depreciation
      const depreciationRate = vehicleAge <= 5 ? 0.15 : 0.10;
      const depreciation = Math.min(vehicleAge * depreciationRate, 0.80);
      let estimatedValue = baseValue * (1 - depreciation);

      // Mileage adjustment
      const averageMileagePerYear = 15000;
      const expectedMileage = vehicleAge * averageMileagePerYear;
      const mileageDifference = formData.vehicleMileage - expectedMileage;

      if (mileageDifference > 0) {
        const mileagePenalty = (mileageDifference / 10000) * 0.05;
        estimatedValue *= (1 - Math.min(mileagePenalty, 0.30));
      } else {
        const mileageBonus = Math.abs(mileageDifference / 10000) * 0.03;
        estimatedValue *= (1 + Math.min(mileageBonus, 0.15));
      }

      // Condition adjustments
      const conditionMultipliers = {
        'EXCELLENT': 1.10,
        'VERY_GOOD': 1.05,
        'GOOD': 1.00,
        'FAIR': 0.85,
        'POOR': 0.65,
      };
      estimatedValue *= conditionMultipliers[formData.vehicleCondition as keyof typeof conditionMultipliers] || 1.00;

      // Accident and service history
      if (formData.hasAccidents) estimatedValue *= 0.85;
      if (formData.hasServiceHistory) estimatedValue *= 1.05;

      const marketValue = Math.round(estimatedValue);

      // Our offer range
      const offerPercentage = formData.vehicleCondition === 'EXCELLENT' ? 0.90 :
                             formData.vehicleCondition === 'VERY_GOOD' ? 0.85 :
                             formData.vehicleCondition === 'GOOD' ? 0.80 :
                             formData.vehicleCondition === 'FAIR' ? 0.70 : 0.60;

      const offerValue = Math.round(marketValue * offerPercentage);
      const range = {
        min: Math.round(offerValue * 0.9),
        max: Math.round(offerValue * 1.1),
      };

      setEstimate({ marketValue, offerValue, range });
      setIsCalculating(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (estimate) setEstimate(null); // Clear estimate when inputs change
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (compact) {
    return (
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Vaihtoauton arvo</h3>
        </div>
        <p className="text-slate-600 mb-4">
          Saat välittömän arvion vaihtoautosi arvosta.
        </p>
        <Link
          href="/trade-in"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition text-center block"
        >
          Laske vaihtoauton arvo
        </Link>
      </div>
    );
  }

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Vaihtoauton arviointi</h2>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Saat välittömän arvion vaihtoautosi arvosta. Tarkka hinta-arvio vaatii auton tarkastusta.
          </p>
        </motion.div>

        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Input Section */}
            <div className="p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Auton tiedot</h3>

              {/* Make */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Merkki
                </label>
                <select
                  value={formData.vehicleMake}
                  onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Valitse merkki</option>
                  {carMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Malli
                </label>
                <input
                  type="text"
                  value={formData.vehicleModel}
                  onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Esim. A4, Golf, C-Class"
                />
              </div>

              {/* Year and Mileage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vuosimalli
                  </label>
                  <select
                    value={formData.vehicleYear}
                    onChange={(e) => handleInputChange('vehicleYear', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mittarilukema (km)
                  </label>
                  <input
                    type="number"
                    value={formData.vehicleMileage}
                    onChange={(e) => handleInputChange('vehicleMileage', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kunto
                </label>
                <div className="space-y-2">
                  {conditions.map(condition => (
                    <label key={condition.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="condition"
                        value={condition.value}
                        checked={formData.vehicleCondition === condition.value}
                        onChange={(e) => handleInputChange('vehicleCondition', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-slate-900">{condition.label}</div>
                        <div className="text-sm text-slate-600">{condition.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Factors */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Lisätiedot</h4>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasAccidents}
                    onChange={(e) => handleInputChange('hasAccidents', e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">Auto on ollut kolarissa</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasServiceHistory}
                    onChange={(e) => handleInputChange('hasServiceHistory', e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">Täydellinen huoltohistoria</span>
                </label>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-500 p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Arvio</h3>

              {!estimate && !isCalculating && (
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 text-white/50 mx-auto mb-4" />
                  <p className="text-blue-100 mb-6">
                    Täytä auton tiedot saadaksesi välittömän arvion
                  </p>
                  <button
                    onClick={calculateEstimate}
                    disabled={!formData.vehicleMake || !formData.vehicleModel}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Laske arvio
                  </button>
                </div>
              )}

              {isCalculating && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                  <p className="text-blue-100">Lasketaan arvio...</p>
                </div>
              )}

              {estimate && (
                <div className="space-y-6">
                  {/* Market Value */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="text-sm opacity-90 mb-2">Markkinaarvo</div>
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(estimate.marketValue)}
                    </div>
                    <div className="text-sm opacity-75">
                      Arvioitu markkina-arvo
                    </div>
                  </div>

                  {/* Our Offer */}
                  <div className="bg-yellow-400 text-slate-900 rounded-xl p-6 text-center">
                    <div className="text-sm font-medium mb-2">Meidän tarjouksemme</div>
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(estimate.offerValue)}
                    </div>
                    <div className="text-sm">
                      Vaihteluväli: {formatCurrency(estimate.range.min)} - {formatCurrency(estimate.range.max)}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">Välitön käteismaksu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">Hoitamme paperityöt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">Nopea prosessi</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-4">
                    <Link
                      href="/trade-in/valuation"
                      className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center block"
                    >
                      Pyydä tarkan arvio
                    </Link>
                    <a
                      href={`https://wa.me/358413188214?text=Hei! Haluaisin myydä autoni: ${formData.vehicleMake} ${formData.vehicleModel} (${formData.vehicleYear}). Arvioitu arvo: ${formatCurrency(estimate.offerValue)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </a>
                    <a
                      href="tel:+358413188214"
                      className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Phone className="h-5 w-5" />
                      +358 41 3188214
                    </a>
                  </div>

                  <div className="text-sm opacity-75 text-center pt-4">
                    Arvio on voimassa 7 päivää. Lopullinen hinta määräytyy auton tarkastuksessa.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}