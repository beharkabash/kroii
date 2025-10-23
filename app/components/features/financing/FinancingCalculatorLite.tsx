'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface CalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}

export default function FinancingCalculatorLite() {
  const [carPrice, setCarPrice] = useState<string>('15000');
  const [downPayment, setDownPayment] = useState<string>('3000');
  const [interestRate, setInterestRate] = useState<string>('5.5');
  const [loanTerm, setLoanTerm] = useState<string>('60');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateFinancing = () => {
    const price = parseFloat(carPrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) || 0;
    const term = parseInt(loanTerm) || 0;

    if (price <= 0 || term <= 0) {
      alert('Anna kelvolliset arvot');
      return;
    }

    const loanAmount = price - down;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term;

    // Monthly payment formula: P * [r(1 + r)^n] / [(1 + r)^n - 1]
    const monthlyPayment = monthlyRate === 0 
      ? loanAmount / numPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      loanAmount,
      interestRate: rate,
      loanTerm: term,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 md:p-8 shadow-lg border border-purple-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-600 rounded-xl">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rahoituslaskuri</h2>
          <p className="text-sm text-gray-600">Laske kuukausimaksusi</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Car Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Auton hinta (€)
          </label>
          <input
            type="number"
            value={carPrice}
            onChange={(e) => setCarPrice(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
            placeholder="15000"
          />
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Käsiraha (€)
          </label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
            placeholder="3000"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Korko (% vuodessa)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            step="0.1"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
            placeholder="5.5"
          />
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Laina-aika (kuukautta)
          </label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
          >
            <option value="12">12 kuukautta (1 vuosi)</option>
            <option value="24">24 kuukautta (2 vuotta)</option>
            <option value="36">36 kuukautta (3 vuotta)</option>
            <option value="48">48 kuukautta (4 vuotta)</option>
            <option value="60">60 kuukautta (5 vuotta)</option>
            <option value="72">72 kuukautta (6 vuotta)</option>
            <option value="84">84 kuukautta (7 vuotta)</option>
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateFinancing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
        >
          Laske rahoitus
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="bg-white rounded-xl p-5 shadow-md border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Kuukausierä</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(result.monthlyPayment)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-600">Kokonaismaksu</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(result.totalPayment)}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-600">Korot yhteensä</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(result.totalInterest)}
              </p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Lainan määrä:</strong> {formatCurrency(result.loanAmount)} • 
              <strong className="ml-2">Korko:</strong> {result.interestRate}% • 
              <strong className="ml-2">Maksuaika:</strong> {result.loanTerm} kk
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-xs text-gray-600 text-center">
          💡 Tämä on suuntaa antava laskuri. Tarkat lainaehdot sovitaan erikseen.
        </p>
      </div>
    </div>
  );
}
