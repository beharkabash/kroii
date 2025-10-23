'use client';

import { useState } from 'react';
import { Car, Calendar, Gauge, Wrench, TrendingUp } from 'lucide-react';

interface EstimateResult {
  lowEstimate: number;
  midEstimate: number;
  highEstimate: number;
  factors: string[];
}

export default function TradeInEstimatorLite() {
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [km, setKm] = useState<string>('');
  const [condition, setCondition] = useState<string>('good');
  const [result, setResult] = useState<EstimateResult | null>(null);

  const calculateEstimate = () => {
    const yearNum = parseInt(year);
    const kmNum = parseInt(km);

    if (!brand || !model || !yearNum || !kmNum) {
      alert('Täytä kaikki kentät');
      return;
    }

    // Simple estimation algorithm
    const currentYear = new Date().getFullYear();
    const age = currentYear - yearNum;
    
    // Base value calculation (simplified)
    let baseValue = 25000; // Starting point
    
    // Depreciation by age (20% first year, 15% next 2 years, 10% thereafter)
    if (age === 0) {
      baseValue *= 0.8;
    } else if (age <= 2) {
      baseValue *= 0.8 * Math.pow(0.85, age - 1);
    } else {
      baseValue *= 0.8 * Math.pow(0.85, 2) * Math.pow(0.9, age - 3);
    }
    
    // Adjust by kilometers (every 50k km = -10%)
    const kmFactor = Math.floor(kmNum / 50000);
    baseValue *= Math.pow(0.9, kmFactor);
    
    // Condition adjustment
    const conditionMultipliers: Record<string, number> = {
      excellent: 1.15,
      good: 1.0,
      fair: 0.85,
      poor: 0.7,
    };
    baseValue *= conditionMultipliers[condition] || 1.0;
    
    // Brand premium (simplified)
    const premiumBrands = ['bmw', 'mercedes', 'audi', 'lexus', 'porsche'];
    const midBrands = ['volkswagen', 'volvo', 'mazda', 'subaru'];
    
    if (premiumBrands.includes(brand.toLowerCase())) {
      baseValue *= 1.2;
    } else if (midBrands.includes(brand.toLowerCase())) {
      baseValue *= 1.1;
    }
    
    // Calculate range (±15%)
    const lowEstimate = Math.round(baseValue * 0.85);
    const midEstimate = Math.round(baseValue);
    const highEstimate = Math.round(baseValue * 1.15);
    
    // Generate factors
    const factors: string[] = [];
    
    if (age <= 3) {
      factors.push('✅ Suhteellisen uusi auto');
    } else if (age > 10) {
      factors.push('⚠️ Ikä vaikuttaa arvoon');
    }
    
    if (kmNum < 100000) {
      factors.push('✅ Alhainen kilometrimäärä');
    } else if (kmNum > 200000) {
      factors.push('⚠️ Korkea kilometrimäärä');
    }
    
    if (condition === 'excellent') {
      factors.push('✅ Erinomainen kunto');
    } else if (condition === 'poor') {
      factors.push('⚠️ Kunto vaatii huomiota');
    }
    
    if (premiumBrands.includes(brand.toLowerCase())) {
      factors.push('✅ Premium-merkki');
    }
    
    setResult({
      lowEstimate,
      midEstimate,
      highEstimate,
      factors,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 md:p-8 shadow-lg border border-green-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-600 rounded-xl">
          <Car className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vaihtoauton arviointi</h2>
          <p className="text-sm text-gray-600">Arvioi autosi nykyhinta</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Brand */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Merkki
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
            placeholder="esim. Volkswagen"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Malli
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
            placeholder="esim. Golf"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Vuosimalli
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
            placeholder="2020"
            min="1980"
            max={new Date().getFullYear() + 1}
          />
        </div>

        {/* Kilometers */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Kilometrit
          </label>
          <input
            type="number"
            value={km}
            onChange={(e) => setKm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
            placeholder="150000"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Kunto
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
          >
            <option value="excellent">Erinomainen - Kuin uusi</option>
            <option value="good">Hyvä - Hyvin huollettu</option>
            <option value="fair">Tyydyttävä - Pieniä kulumia</option>
            <option value="poor">Huono - Vaatii korjausta</option>
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateEstimate}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
        >
          Arvioi autoni arvo
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="bg-white rounded-xl p-5 shadow-md border-2 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Arvioitu arvo</span>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Välillä</p>
              <p className="text-3xl font-bold text-green-600 mb-1">
                {formatCurrency(result.lowEstimate)} - {formatCurrency(result.highEstimate)}
              </p>
              <p className="text-sm text-gray-600">
                Keskiarvo: <span className="font-bold">{formatCurrency(result.midEstimate)}</span>
              </p>
            </div>
          </div>

          {/* Factors */}
          {result.factors.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Arvoon vaikuttavat tekijät:</h3>
              <ul className="space-y-2">
                {result.factors.map((factor, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-lg leading-none">{factor.startsWith('✅') ? '✅' : '⚠️'}</span>
                    <span>{factor.replace(/^[✅⚠️]\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Huomio:</strong> Tämä on karkea arvio. Tarkka arvo määritetään tarkastuksen perusteella. 
              Ota yhteyttä saadaksesi tarkan arvion!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
