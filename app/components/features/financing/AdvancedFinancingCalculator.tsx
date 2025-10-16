'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, CreditCard, Calendar, Percent, Info, Euro, Phone, MessageCircle, TrendingUp, PieChart, BarChart3, CheckCircle, AlertCircle, Sparkles, Target, Award, DollarSign } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Input } from '@/app/components/ui/forms/Input';
import { Button } from '@/app/components/ui/buttons/Button';

interface AdvancedFinancingCalculatorProps {
  vehiclePrice?: number;
  vehicleName?: string;
  className?: string;
}

interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface _LoanComparison {
  term: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export default function AdvancedFinancingCalculator({
  vehiclePrice = 15000,
  vehicleName = '',
  className = ''
}: AdvancedFinancingCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(vehiclePrice * 0.8);
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.2);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const [activeTab, setActiveTab] = useState<'calculator' | 'comparison' | 'schedule'>('calculator');
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showOptimalChoice, setShowOptimalChoice] = useState(false);

  // Validation
  const validateInputs = useCallback(() => {
    const errors: Record<string, string> = {};

    if (downPayment < 0) {
      errors.downPayment = 'Käsiraha ei voi olla negatiivinen';
    } else if (downPayment > vehiclePrice) {
      errors.downPayment = 'Käsiraha ei voi olla auton hintaa suurempi';
    } else if (downPayment < vehiclePrice * 0.1) {
      errors.downPayment = 'Suosittelemme vähintään 10% käsirahaa';
    }

    if (interestRate < 0) {
      errors.interestRate = 'Korko ei voi olla negatiivinen';
    } else if (interestRate > 25) {
      errors.interestRate = 'Korko vaikuttaa epärealistiselta';
    }

    if (loanAmount <= 0) {
      errors.loanAmount = 'Lainasumma on liian pieni';
    } else if (loanAmount < 1000) {
      errors.loanAmount = 'Minimi lainasumma on 1000€';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [downPayment, vehiclePrice, interestRate, loanAmount]);

  // Update loan amount when down payment changes
  useEffect(() => {
    const newLoanAmount = vehiclePrice - downPayment;
    setLoanAmount(Math.max(0, newLoanAmount));
    validateInputs();
  }, [downPayment, vehiclePrice, validateInputs]);

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      validateInputs();
    }, 300);
    return () => clearTimeout(timer);
  }, [validateInputs]);

  // Calculate financing details
  const financingDetails = useMemo(() => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      return {
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayment: 0,
        paymentSchedule: [],
        costBreakdown: {
          principal: 0,
          interest: 0,
          fees: 0,
          total: 0
        }
      };
    }

    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    // Monthly payment calculation
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;

    // Generate payment schedule
    let balance = loanAmount;
    const paymentSchedule: PaymentScheduleItem[] = [];

    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      paymentSchedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    // Cost breakdown including estimated fees
    const estimatedFees = loanAmount * 0.01; // 1% estimated fees
    const costBreakdown = {
      principal: loanAmount,
      interest: totalInterest,
      fees: estimatedFees,
      total: totalPayment + estimatedFees
    };

    return {
      monthlyPayment,
      totalInterest,
      totalPayment,
      paymentSchedule,
      costBreakdown
    };
  }, [loanAmount, interestRate, loanTerm]);

  // Generate loan comparisons for different terms
  const loanComparisons = useMemo(() => {
    const terms = [24, 36, 48, 60, 72, 84];
    return terms.map(term => {
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) /
                            (Math.pow(1 + monthlyRate, term) - 1);
      const totalPayment = monthlyPayment * term;
      const totalInterest = totalPayment - loanAmount;

      return {
        term,
        monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
        totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
        totalPayment: isNaN(totalPayment) ? 0 : totalPayment
      };
    });
  }, [loanAmount, interestRate]);

  const handleDownPaymentChange = (value: number) => {
    const newDownPayment = Math.min(Math.max(0, value), vehiclePrice);
    setDownPayment(newDownPayment);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const loanTermOptions = [
    { value: 12, label: '1 vuosi' },
    { value: 24, label: '2 vuotta' },
    { value: 36, label: '3 vuotta' },
    { value: 48, label: '4 vuotta' },
    { value: 60, label: '5 vuotta' },
    { value: 72, label: '6 vuotta' },
    { value: 84, label: '7 vuotta' },
  ];

  const whatsappMessage = `Hei! Haluaisin lisätietoja rahoituksesta${vehicleName ? ` autolle: ${vehicleName}` : ''}. Arvioitu laina-aika: ${loanTerm} kuukautta, käsiraha: ${formatCurrency(downPayment)}, kuukausierä: ${formatCurrency(financingDetails.monthlyPayment)}.`;

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Edistynyt rahoituslaskin</h2>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Laske kuukausierä, vertaile laina-aikoja ja tutki maksuerätaulukko. Saat kattavan analyysin rahoituksestasi.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'calculator' as const, label: 'Laskin', icon: Calculator },
            { id: 'comparison' as const, label: 'Vertailu', icon: BarChart3 },
            { id: 'schedule' as const, label: 'Maksuaikataulu', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {activeTab === 'calculator' && (
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Input Section */}
              <div className="p-8 space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Rahoitustiedot</h3>

                {/* Vehicle Price */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Auton hinta
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={formatCurrency(vehiclePrice)}
                      readOnly
                      className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Käsiraha ({((downPayment / vehiclePrice) * 100).toFixed(0)}%)
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                      max={vehiclePrice}
                      step="1000"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={vehiclePrice}
                    step="1000"
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                    className="w-full mt-2 accent-purple-600"
                  />
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Korko (vuosikorko %)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                      max="20"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Laina-aika
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {loanTermOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cost Breakdown Chart */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Kustannusjakauma
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lainapääoma:</span>
                      <span className="font-medium">{formatCurrency(financingDetails.costBreakdown.principal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Korot:</span>
                      <span className="font-medium text-orange-600">{formatCurrency(financingDetails.costBreakdown.interest)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Arviot kulut:</span>
                      <span className="font-medium text-gray-600">{formatCurrency(financingDetails.costBreakdown.fees)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-sm font-bold">
                      <span>Yhteensä:</span>
                      <span>{formatCurrency(financingDetails.costBreakdown.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-8 text-white">
                <h3 className="text-xl font-bold mb-6">Rahoitusarvio</h3>

                <div className="space-y-6">
                  {/* Monthly Payment */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="text-sm opacity-90 mb-2">Kuukausierä</div>
                    <div className="text-4xl font-bold mb-1">
                      {formatCurrency(financingDetails.monthlyPayment)}
                    </div>
                    <div className="text-sm opacity-75">
                      {loanTerm} kuukauden ajan
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="opacity-90">Käsiraha:</span>
                      <span className="font-semibold">{formatCurrency(downPayment)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-90">Lainasumma:</span>
                      <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-90">Korot yhteensä:</span>
                      <span className="font-semibold">{formatCurrency(financingDetails.totalInterest)}</span>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="opacity-90">Kokonaishinta:</span>
                        <span className="font-bold text-lg">{formatCurrency(downPayment + financingDetails.totalPayment)}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-4">
                    <a
                      href={`https://wa.me/358413188214?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Kysy rahoituksesta WhatsAppissa
                    </a>
                    <a
                      href="tel:+358413188214"
                      className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Phone className="h-5 w-5" />
                      Soita: +358 41 3188214
                    </a>
                    <Link
                      href={`/financing/apply${vehicleName ? `?vehicleId=${vehicleName}&price=${vehiclePrice}` : ''}`}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-5 w-5" />
                      Hae rahoitusta
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Laina-aikojen vertailu</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Laina-aika</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">Kuukausierä</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">Korot yhteensä</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">Kokonaismaksu</th>
                      <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Säästö</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanComparisons.map((comparison, _index) => {
                      const isSelected = comparison.term === loanTerm;
                      const shortestTermTotal = loanComparisons[0]?.totalPayment || 0;
                      const savings = comparison.totalPayment - shortestTermTotal;

                      return (
                        <tr
                          key={comparison.term}
                          className={`${isSelected ? 'bg-purple-50 border-purple-200' : 'hover:bg-gray-50'}`}
                        >
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            {comparison.term / 12} vuosi{comparison.term > 12 ? 'a' : ''}
                            {isSelected && <span className="ml-2 text-purple-600 text-xs">(valittu)</span>}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-right font-semibold">
                            {formatCurrency(comparison.monthlyPayment)}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-right">
                            {formatCurrency(comparison.totalInterest)}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-right">
                            {formatCurrency(comparison.totalPayment)}
                          </td>
                          <td className="border border-gray-200 px-4 py-3 text-center">
                            <span className={savings > 0 ? 'text-red-600' : savings < 0 ? 'text-green-600' : 'text-gray-500'}>
                              {savings > 0 ? '+' : ''}{formatCurrency(Math.abs(savings))}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <Info className="inline h-4 w-4 mr-1" />
                Säästö-sarakkeessa näkyy, kuinka paljon enemmän (+) tai vähemmän (-) maksat verrattuna lyhyimpään laina-aikaan.
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Maksuaikataulu (ensimmäiset 12 kuukautta)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Kuukausi</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">Kuukausierä</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">Pääoma</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">Korko</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-semibold">Jäljellä</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financingDetails.paymentSchedule.slice(0, 12).map((payment) => (
                      <tr key={payment.month} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-center font-medium">
                          {payment.month}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right font-semibold">
                          {formatCurrency(payment.payment)}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-green-600">
                          {formatCurrency(payment.principal)}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right text-orange-600">
                          {formatCurrency(payment.interest)}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-right">
                          {formatCurrency(payment.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {loanTerm > 12 && (
                <div className="mt-4 text-sm text-gray-600 text-center">
                  ... ja {loanTerm - 12} muuta kuukautta. Koko maksuaikataulu näytetään rahoitussopimuksessa.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-sm text-gray-600">
          <Info className="inline h-4 w-4 mr-1" />
          Kaikki arviot ovat suuntaa-antavia. Lopullinen korko ja ehdot määräytyvät luottotiedoista ja rahoittajasta.
        </div>
      </div>
    </section>
  );
}