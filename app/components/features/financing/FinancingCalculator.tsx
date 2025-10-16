'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, CreditCard, Calendar, Percent, Info, Euro, Phone, MessageCircle, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Input } from '@/app/components/ui/forms/Input';
import { Button } from '@/app/components/ui/buttons/Button';

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
  const [loanAmount, setLoanAmount] = useState(vehiclePrice * 0.8);
  const [downPayment, setDownPayment] = useState(vehiclePrice * 0.2);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [lastCalculation, setLastCalculation] = useState<any>(null);

  // Debounced validation
  const validateInputs = useCallback(() => {
    const errors: Record<string, string> = {};

    if (downPayment < 0) {
      errors.downPayment = 'Käsiraha ei voi olla negatiivinen';
    } else if (downPayment > vehiclePrice) {
      errors.downPayment = 'Käsiraha ei voi olla auton hintaa suurempi';
    } else if (downPayment < vehiclePrice * 0.1) {
      errors.downPayment = 'Suositellaan vähintään 10% käsirahaa';
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

  // Calculate monthly payment with animation
  const calculatePayment = useCallback(async () => {
    setIsCalculating(true);

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalPayment(0);
      setIsCalculating(false);
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    // Monthly payment formula
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                   (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPaid = payment * numPayments;
    const totalInt = totalPaid - loanAmount;

    // Store last calculation for comparison
    const newCalculation = {
      monthlyPayment: payment,
      totalPayment: totalPaid,
      totalInterest: totalInt,
      timestamp: Date.now()
    };

    // Show comparison if values changed significantly
    if (lastCalculation && Math.abs(payment - lastCalculation.monthlyPayment) > 50) {
      setShowComparison(true);
      setTimeout(() => setShowComparison(false), 3000);
    }

    setMonthlyPayment(payment);
    setTotalPayment(totalPaid);
    setTotalInterest(totalInt);
    setLastCalculation(newCalculation);
    setIsCalculating(false);

    // Celebrate good deal
    if (payment < vehiclePrice * 0.03) { // Less than 3% of vehicle price monthly
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#16a34a', '#15803d']
      });
    }
  }, [loanAmount, interestRate, loanTerm, vehiclePrice, lastCalculation]);

  // Debounced calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (validateInputs()) {
        calculatePayment();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [loanAmount, interestRate, loanTerm, calculatePayment, validateInputs]);

  const handleDownPaymentChange = (value: number) => {
    const newDownPayment = Math.min(Math.max(0, value), vehiclePrice);
    setDownPayment(newDownPayment);
  };

  const getPaymentTrend = () => {
    if (!lastCalculation) return null;
    if (monthlyPayment > lastCalculation.monthlyPayment) return 'up';
    if (monthlyPayment < lastCalculation.monthlyPayment) return 'down';
    return 'same';
  };

  const getPaymentColor = () => {
    const ratio = monthlyPayment / vehiclePrice;
    if (ratio < 0.02) return 'text-green-600'; // Great deal
    if (ratio < 0.04) return 'text-blue-600'; // Good deal
    if (ratio < 0.06) return 'text-orange-600'; // Fair deal
    return 'text-red-600'; // Expensive
  };

  const getAffordabilityMessage = () => {
    const ratio = monthlyPayment / vehiclePrice;
    if (ratio < 0.02) return { text: 'Erinomainen tarjous!', emoji: '🎉', color: 'text-green-600' };
    if (ratio < 0.04) return { text: 'Hyvä tarjous', emoji: '👍', color: 'text-blue-600' };
    if (ratio < 0.06) return { text: 'Kohtuullinen', emoji: '👌', color: 'text-orange-600' };
    return { text: 'Kallis vaihtoehto', emoji: '⚠️', color: 'text-red-600' };
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 overflow-hidden ${className}`}
      >
        <motion.div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg"
            >
              <Calculator className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Rahoituslaskin</h3>
              {!isExpanded && monthlyPayment > 0 && (
                <p className="text-sm text-purple-600 font-semibold">
                  {formatCurrency(monthlyPayment)}/kk
                </p>
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-4"
            >

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Käsiraha"
                      type="number"
                      value={downPayment}
                      onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                      error={validationErrors.downPayment}
                      leftIcon={<Euro className="h-4 w-4" />}
                      min={0}
                      max={vehiclePrice}
                      inputSize="sm"
                      helperText={`${((downPayment / vehiclePrice) * 100).toFixed(0)}% auton hinnasta`}
                    />
                    <motion.input
                      type="range"
                      min="0"
                      max={vehiclePrice}
                      step="1000"
                      value={downPayment}
                      onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                      className="w-full mt-2 accent-purple-600"
                      whileHover={{ scale: 1.02 }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Laina-aika
                    </label>
                    <motion.select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      whileFocus={{ scale: 1.02 }}
                    >
                      {loanTermOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </motion.select>
                  </div>
                </div>

                <motion.div
                  className="bg-white rounded-lg p-4 border border-purple-200 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  {isCalculating && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-500/10"
                      animate={{ x: [-300, 300] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  <div className="text-center relative z-10">
                    <motion.div
                      className={`text-2xl font-bold mb-1 ${getPaymentColor()}`}
                      animate={isCalculating ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.5, repeat: isCalculating ? Infinity : 0 }}
                    >
                      {isCalculating ? '...' : formatCurrency(monthlyPayment)}
                    </motion.div>
                    <div className="text-sm text-slate-600 flex items-center justify-center gap-2">
                      <span>kuukaudessa</span>
                      {getPaymentTrend() === 'up' && <TrendingUp className="h-3 w-3 text-red-500" />}
                      {getPaymentTrend() === 'down' && <TrendingDown className="h-3 w-3 text-green-500" />}
                    </div>
                    {monthlyPayment > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-xs mt-1 ${getAffordabilityMessage().color} flex items-center justify-center gap-1`}
                      >
                        <span>{getAffordabilityMessage().emoji}</span>
                        <span>{getAffordabilityMessage().text}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    leftIcon={<MessageCircle className="h-4 w-4" />}
                    className="flex-1 bg-green-500 hover:bg-green-600 border-green-500"
                    onClick={() => window.open(`https://wa.me/358413188214?text=${encodeURIComponent(whatsappMessage)}`, '_blank')}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    leftIcon={<Phone className="h-4 w-4" />}
                    className="flex-1"
                    onClick={() => window.open('tel:+358413188214', '_self')}
                  >
                    Soita
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <section className={`py-8 md:py-16 bg-white ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg"
            >
              <Calculator className="h-6 w-6 text-white" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">Rahoituslaskin</h2>
          </div>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Laske kuukausierä ja tutki eri rahoitusvaihtoehtoja. Arviot ovat suuntaa-antavia.
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.15)" }}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Input Section */}
            <div className="p-4 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Rahoitustiedot</h3>
                {Object.keys(validationErrors).length === 0 && monthlyPayment > 0 && (
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

              {/* Vehicle Price */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Input
                  label="Auton hinta"
                  value={formatCurrency(vehiclePrice)}
                  readOnly
                  leftIcon={<Euro className="h-5 w-5" />}
                  className="bg-slate-50 font-semibold text-slate-700"
                  success={vehiclePrice > 0 ? "Hinta asetettu" : undefined}
                />
              </motion.div>

              {/* Down Payment */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  label={`Käsiraha (${((downPayment / vehiclePrice) * 100).toFixed(0)}%)`}
                  type="number"
                  value={downPayment}
                  onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                  error={validationErrors.downPayment}
                  leftIcon={<Euro className="h-5 w-5" />}
                  min={0}
                  max={vehiclePrice}
                  step={1000}
                  helperText="Suosittelemme vähintään 10% käsirahaa"
                />
                <motion.div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>0€</span>
                    <span>50%</span>
                    <span>{formatCurrency(vehiclePrice)}</span>
                  </div>
                  <motion.input
                    type="range"
                    min="0"
                    max={vehiclePrice}
                    step="1000"
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                    className="w-full accent-purple-600"
                    whileHover={{ scale: 1.02 }}
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Min</span>
                    <span className="font-medium text-purple-600">
                      {((downPayment / vehiclePrice) * 100).toFixed(0)}%
                    </span>
                    <span>Max</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Loan Amount */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  label="Lainasumma"
                  value={formatCurrency(loanAmount)}
                  readOnly
                  leftIcon={<CreditCard className="h-5 w-5" />}
                  className="bg-slate-50 font-semibold text-slate-700"
                  error={validationErrors.loanAmount}
                  success={loanAmount > 1000 && !validationErrors.loanAmount ? "Lainasumma hyväksyttävä" : undefined}
                />
              </motion.div>

              {/* Interest Rate */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Input
                  label="Korko (vuosikorko %)"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  error={validationErrors.interestRate}
                  leftIcon={<Percent className="h-5 w-5" />}
                  min={0}
                  max={20}
                  step={0.1}
                  helperText="Arvioitu korko. Todellinen korko määräytyy luottotiedoista."
                />
                <motion.div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>0%</span>
                    <span>10%</span>
                    <span>20%</span>
                  </div>
                  <motion.input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-purple-600"
                    whileHover={{ scale: 1.02 }}
                  />
                  <div className="flex items-center justify-center mt-2">
                    <motion.div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        interestRate < 3 ? 'bg-green-100 text-green-800' :
                        interestRate < 6 ? 'bg-blue-100 text-blue-800' :
                        interestRate < 10 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {interestRate < 3 && <Sparkles className="h-3 w-3 mr-1" />}
                      {interestRate.toFixed(1)}% korko
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Loan Term */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Laina-aika
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {loanTermOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setLoanTerm(option.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        loanTerm === option.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300 text-gray-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Calendar className="h-4 w-4 mx-auto mb-1" />
                      {option.label}
                    </motion.button>
                  ))}
                </div>
                <div className="text-xs text-center text-gray-500">
                  Pidempi laina-aika = pienempi kuukausierä, mutta enemmän korkoja
                </div>
              </motion.div>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-4 md:p-8 text-white relative overflow-hidden">
              {/* Background Animation */}
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 80%, white 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 20%, white 0%, transparent 50%)',
                    'radial-gradient(circle at 40% 40%, white 0%, transparent 50%)'
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />

              <div className="relative z-10">
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-bold mb-6 flex items-center gap-2"
                >
                  <Calculator className="h-5 w-5" />
                  Rahoitusarvio
                </motion.h3>

                <div className="space-y-6">
                  {/* Monthly Payment */}
                  <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {isCalculating && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                    <div className="text-sm opacity-90 mb-2 flex items-center justify-center gap-2">
                      <span>Kuukausierä</span>
                      {getPaymentTrend() === 'up' && <TrendingUp className="h-3 w-3" />}
                      {getPaymentTrend() === 'down' && <TrendingDown className="h-3 w-3" />}
                    </div>
                    <motion.div
                      className="text-3xl md:text-4xl font-bold mb-2"
                      animate={isCalculating ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.5, repeat: isCalculating ? Infinity : 0 }}
                    >
                      {isCalculating ? '...' : formatCurrency(monthlyPayment)}
                    </motion.div>
                    <div className="text-sm opacity-75 mb-2">
                      {loanTerm} kuukauden ajan
                    </div>
                    {monthlyPayment > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full"
                      >
                        <span>{getAffordabilityMessage().emoji}</span>
                        <span>{getAffordabilityMessage().text}</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Summary */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <motion.div
                        className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4 opacity-70" />
                          <span className="opacity-90">Käsiraha:</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(downPayment)}</span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 opacity-70" />
                          <span className="opacity-90">Lainasumma:</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4 opacity-70" />
                          <span className="opacity-90">Korot yhteensä:</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                      </motion.div>
                    </div>
                    <motion.div
                      className="border-t border-white/20 pt-4"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          <span className="opacity-90 font-medium">Kokonaishinta:</span>
                        </div>
                        <span className="font-bold text-xl">{formatCurrency(downPayment + totalPayment)}</span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    className="space-y-3 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      leftIcon={<MessageCircle className="h-5 w-5" />}
                      className="bg-green-500 hover:bg-green-600 border-green-500 shadow-lg hover:shadow-green-500/30"
                      onClick={() => window.open(`https://wa.me/358413188214?text=${encodeURIComponent(whatsappMessage)}`, '_blank')}
                    >
                      <span className="hidden sm:inline">Kysy rahoituksesta WhatsAppissa</span>
                      <span className="sm:hidden">WhatsApp</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      fullWidth
                      leftIcon={<Phone className="h-5 w-5" />}
                      className="bg-white/20 hover:bg-white/30 border-white/30 text-white hover:text-white"
                      onClick={() => window.open('tel:+358413188214', '_self')}
                    >
                      <span className="hidden sm:inline">Soita: +358 41 3188214</span>
                      <span className="sm:hidden">Soita</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      leftIcon={<CreditCard className="h-5 w-5" />}
                      className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-slate-900 hover:text-slate-900 shadow-lg hover:shadow-yellow-500/30"
                      onClick={() => window.open(`/financing/apply${vehicleName ? `?vehicleId=${vehicleName}&price=${vehiclePrice}` : ''}`, '_self')}
                    >
                      Hae rahoitusta
                    </Button>
                  </motion.div>

                  <motion.div
                    className="text-sm opacity-75 text-center pt-4 border-t border-white/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.75 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Info className="h-4 w-4" />
                      <span>Tärkeää tietää</span>
                    </div>
                    <p>Arviot ovat suuntaa-antavia. Lopullinen korko määräytyy luottotiedoista ja pankista.</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}