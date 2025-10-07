'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, CreditCard, Calendar, Percent, Info, Euro, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface FinancingCalculatorProps {
  vehiclePrice?: number;
  vehicleName?: string;
  className?: string;
  compact?: boolean;
}

export default function FinancingCalculator({
  vehiclePrice = 15000,
  vehicleName = '',
  className = '',
  compact = false
}: FinancingCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(vehiclePrice * 0.8); // 80% financing by default
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.2); // 20% down payment
  const [interestRate, setInterestRate] = useState(4.5); // 4.5% default rate
  const [loanTerm, setLoanTerm] = useState(60); // 5 years default
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // Update loan amount when down payment changes
  useEffect(() => {
    const newLoanAmount = vehiclePrice - downPayment;
    setLoanAmount(Math.max(0, newLoanAmount));
  }, [downPayment, vehiclePrice]);

  // Calculate monthly payment when values change
  useEffect(() => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalPayment(0);
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    // Monthly payment formula: P * [r(1 + r)^n] / [(1 + r)^n - 1]
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                   (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPaid = payment * numPayments;
    const totalInt = totalPaid - loanAmount;

    setMonthlyPayment(payment);
    setTotalPayment(totalPaid);
    setTotalInterest(totalInt);
  }, [loanAmount, interestRate, loanTerm]);

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

  const whatsappMessage = `Hei! Haluaisin lisätietoja rahoituksesta${vehicleName ? ` autolle: ${vehicleName}` : ''}. Arvioitu laina-aika: ${loanTerm} kuukautta, käsiraha: ${formatCurrency(downPayment)}, kuukausierä: ${formatCurrency(monthlyPayment)}.`;

  if (compact) {
    return (
      <div className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Rahoituslaskin</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Käsiraha
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  min="0"
                  max={vehiclePrice}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Laina-aika
              </label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                {loanTermOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {formatCurrency(monthlyPayment)}
              </div>
              <div className="text-sm text-slate-600">kuukaudessa</div>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={`https://wa.me/358413188214?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition text-center text-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href="tel:+358413188214"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition text-center text-sm flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Soita
            </a>
          </div>
        </div>
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
            <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Rahoituslaskin</h2>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Laske kuukausierä ja tutki eri rahoitusvaihtoehtoja. Arviot ovat suuntaa-antavia.
          </p>
        </motion.div>

        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
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

              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lainasumma
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={formatCurrency(loanAmount)}
                    readOnly
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-semibold"
                  />
                </div>
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
                <div className="mt-2 text-sm text-slate-500 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Arvioitu korko. Todellinen korko määräytyy luottotiedoista.
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
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Rahoitusarvio</h3>

              <div className="space-y-6">
                {/* Monthly Payment */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                  <div className="text-sm opacity-90 mb-2">Kuukausierä</div>
                  <div className="text-4xl font-bold mb-1">
                    {formatCurrency(monthlyPayment)}
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
                    <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="opacity-90">Kokonaishinta:</span>
                      <span className="font-bold text-lg">{formatCurrency(downPayment + totalPayment)}</span>
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

                <div className="text-sm opacity-75 text-center pt-4">
                  Arviot ovat suuntaa-antavia. Lopullinen korko määräytyy luottotiedoista ja pankista.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}