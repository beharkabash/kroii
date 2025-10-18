'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Calculator, Zap, Clock, FileText, Phone, MessageCircle, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Input } from '@/app/components/ui/forms/Input';
import { Button } from '@/app/components/ui/buttons/Button';
import { cars } from '@/app/data/cars';

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
    condition: string;
    strengths: string[];
    weaknesses: string[];
  } | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Extract car makes from actual car data
  const carMakes = useMemo(() => {
    const makes = Array.from(new Set(cars.map(car => car.brand))).sort();
    return [...makes, 'Toyota', 'Honda', 'Ford', 'Opel', 'Peugeot', 'Renault', 'Nissan', 'Mazda', 'Hyundai', 'Kia', 'Citroën', 'SEAT', 'Fiat', 'Muu'];
  }, []);

  // Get models for selected make from car data
  const availableModels = useMemo(() => {
    if (!formData.vehicleMake) return [];
    const modelsFromData = cars
      .filter(car => car.brand === formData.vehicleMake)
      .map(car => car.model)
      .filter((model, index, arr) => arr.indexOf(model) === index)
      .sort();
    return modelsFromData;
  }, [formData.vehicleMake]);

  const conditions = [
    { value: 'EXCELLENT', label: 'Erinomainen', description: 'Ei naarmuja, täydellinen kunto' },
    { value: 'VERY_GOOD', label: 'Erittäin hyvä', description: 'Pieniä naarmuja, hyvä kunto' },
    { value: 'GOOD', label: 'Hyvä', description: 'Normaalia kulumaa, toimintakuntoinen' },
    { value: 'FAIR', label: 'Tyydyttävä', description: 'Näkyviä kulumisen merkkejä' },
    { value: 'POOR', label: 'Huono', description: 'Huomattavia vaurioita tai korjaustarpeita' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.vehicleMake) {
      errors.vehicleMake = 'Valitse auton merkki';
    }
    if (!formData.vehicleModel) {
      errors.vehicleModel = 'Syötä auton malli';
    }
    if (formData.vehicleYear < 1990 || formData.vehicleYear > new Date().getFullYear()) {
      errors.vehicleYear = 'Vuosimalli ei ole kelvollinen';
    }
    if (formData.vehicleMileage < 0 || formData.vehicleMileage > 1000000) {
      errors.vehicleMileage = 'Mittarilukema ei ole kelvollinen';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateEstimate = () => {
    if (!validateForm()) return;

    setIsCalculating(true);
    setCurrentStep(1);

    // Multi-step calculation animation
    const steps = [
      { step: 1, message: 'Analysoidaan markkinatietoja...', duration: 800 },
      { step: 2, message: 'Lasketaan arvonalennusta...', duration: 600 },
      { step: 3, message: 'Arvioidaan kuntoa...', duration: 500 },
      { step: 4, message: 'Viimeistellään arviota...', duration: 400 }
    ];

    let currentStepIndex = 0;
    const stepInterval = setInterval(() => {
      currentStepIndex++;
      if (currentStepIndex < steps.length) {
        setCurrentStep(steps[currentStepIndex].step);
      } else {
        clearInterval(stepInterval);
      }
    }, 600);

    setTimeout(() => {
      clearInterval(stepInterval);
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

      // Calculate strengths and weaknesses
      const strengths: string[] = [];
      const weaknesses: string[] = [];

      if (formData.vehicleCondition === 'EXCELLENT' || formData.vehicleCondition === 'VERY_GOOD') {
        strengths.push('Erinomainen kunto');
      }
      if (formData.hasServiceHistory) {
        strengths.push('Täydellinen huoltohistoria');
      }
      if (!formData.hasAccidents) {
        strengths.push('Ei onnettomuushistoriaa');
      }
      if (formData.vehicleMileage < (currentYear - formData.vehicleYear) * 12000) {
        strengths.push('Matala kilometrimäärä');
      }
      if (['BMW', 'Mercedes-Benz', 'Audi'].includes(formData.vehicleMake)) {
        strengths.push('Premium-merkki');
      }

      if (formData.vehicleCondition === 'FAIR' || formData.vehicleCondition === 'POOR') {
        weaknesses.push('Kunto vaatii korjausta');
      }
      if (formData.hasAccidents) {
        weaknesses.push('Onnettomuushistoria');
      }
      if (!formData.hasServiceHistory) {
        weaknesses.push('Puutteellinen huoltohistoria');
      }
      if (formData.vehicleMileage > (currentYear - formData.vehicleYear) * 18000) {
        weaknesses.push('Korkea kilometrimäärä');
      }

      const conditionText =
        formData.vehicleCondition === 'EXCELLENT' ? 'Erinomainen' :
        formData.vehicleCondition === 'VERY_GOOD' ? 'Erittäin hyvä' :
        formData.vehicleCondition === 'GOOD' ? 'Hyvä' :
        formData.vehicleCondition === 'FAIR' ? 'Tyydyttävä' : 'Huono';

      setEstimate({
        marketValue,
        offerValue,
        range,
        condition: conditionText,
        strengths: strengths.slice(0, 3),
        weaknesses: weaknesses.slice(0, 2)
      });
      setIsCalculating(false);
      setShowSuccess(true);

      // Celebration for good estimate
      if (offerValue > 15000) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#3b82f6', '#1d4ed8', '#1e40af']
        });
      }

      setTimeout(() => setShowSuccess(false), 3000);
    }, 2300);
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
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
      <motion.div
        className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 ${className}`}
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <Car className="h-5 w-5 text-white" />
          </motion.div>
          <h3 className="text-xl font-bold text-slate-900">Vaihtoauton arvo</h3>
        </div>
        <p className="text-slate-600 mb-4">
          Saat välittömän arvion vaihtoautosi arvosta.
        </p>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<Calculator className="h-5 w-5" />}
          className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:shadow-lg hover:shadow-blue-500/30 border-blue-600"
          onClick={() => window.open('/trade-in', '_self')}
        >
          Laske vaihtoauton arvo
        </Button>
      </motion.div>
    );
  }

  return (
    <section className={`py-8 md:py-16 bg-white ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-3 rounded-full shadow-lg max-w-sm mx-auto"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                <span>Arvio valmis! 🎉</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <Car className="h-6 w-6 text-white" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">Vaihtoauton arviointi</h2>
          </div>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Saat välittömän arvion vaihtoautosi arvosta. Tarkka hinta-arvio vaatii auton tarkastusta.
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.15)" }}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Input Section */}
            <div className="p-4 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Auton tiedot</h3>
                {Object.keys(validationErrors).length === 0 && formData.vehicleMake && formData.vehicleModel && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-green-600 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Tiedot OK</span>
                  </motion.div>
                )}
              </div>

              {/* Make */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Merkki
                </label>
                <motion.select
                  value={formData.vehicleMake}
                  onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                  className={`w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.vehicleMake ? 'border-red-500' : ''
                  }`}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">Valitse merkki</option>
                  {carMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </motion.select>
                {validationErrors.vehicleMake && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {validationErrors.vehicleMake}
                  </motion.p>
                )}
              </motion.div>

              {/* Model */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Malli
                </label>
                {availableModels.length > 0 ? (
                  <motion.select
                    value={formData.vehicleModel}
                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    className={`w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.vehicleModel ? 'border-red-500' : ''
                    }`}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="">Valitse malli</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </motion.select>
                ) : (
                  <Input
                    type="text"
                    value={formData.vehicleModel}
                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    error={validationErrors.vehicleModel}
                    placeholder="Esim. A4, Golf, C-Class"
                    leftIcon={<Car className="h-4 w-4" />}
                  />
                )}
                {formData.vehicleMake && availableModels.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 text-xs mt-1 flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Mallit meidän valikoimastamme
                  </motion.p>
                )}
              </motion.div>

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
        </motion.div>
      </div>
    </section>
  );
}