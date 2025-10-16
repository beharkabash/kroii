'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle, Facebook, Instagram, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as confetti from 'canvas-confetti';
import {
  ContactFormData,
  FormState,
  initialFormState,
  validateField,
  validateForm,
  formatPhoneNumber
} from '../lib/features/form-validation';
import { cn } from '../lib/core/utils';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 }
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Update field value and validate
  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value: field === 'phone' ? formatPhoneNumber(value) : value,
        touched: true,
        isValidating: true
      }
    }));

    // Debounced validation
    const timeoutId = setTimeout(() => {
      const error = validateField(field, field === 'phone' ? formatPhoneNumber(value) : value);
      setFormState(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          error,
          isValidating: false
        }
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  // Fire confetti animation
  const fireConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  // Get form data from state
  const getFormData = useCallback((): ContactFormData => ({
    name: formState.name.value,
    email: formState.email.value,
    phone: formState.phone.value,
    message: formState.message.value
  }), [formState]);

  // Check if form has errors
  const hasErrors = useCallback(() => {
    return Object.values(formState).some(field => field.error !== null);
  }, [formState]);

  // Check if form is filled
  const isFormFilled = useCallback(() => {
    const data = getFormData();
    return data.name.trim() !== '' && data.email.trim() !== '' && data.message.trim() !== '';
  }, [getFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = getFormData();
    const validation = validateForm(formData);

    if (!validation.isValid) {
      // Update all fields with errors
      setFormState(prev => {
        const newState = { ...prev };
        Object.keys(validation.errors).forEach(field => {
          if (field in newState) {
            newState[field as keyof FormState] = {
              ...newState[field as keyof FormState],
              error: validation.errors[field] || null,
              touched: true
            };
          }
        });
        return newState;
      });
      return;
    }

    setFormStatus('sending');

    try {
      const response = await fetch('/api/communications/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus('success');
        fireConfetti();

        // Reset form
        setFormState(initialFormState);

        // Reset status after 5 seconds
        successTimeoutRef.current = setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "KROI AUTO CENTER",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Läkkisepäntie 15 B 300620",
              "addressLocality": "Helsinki",
              "postalCode": "00620",
              "addressCountry": "FI"
            },
            "telephone": "+358413188214",
            "email": "kroiautocenter@gmail.com",
            "url": "https://kroiautocenter.fi",
            "openingHours": [
              "Mo-Fr 10:00-18:00",
              "Sa 11:00-17:00"
            ],
            "priceRange": "€€",
            "description": "Autokauppa Helsingissä. Laaja valikoima käytettyjä autoja edulliseen hintaan.",
            "sameAs": [
              "https://www.facebook.com/people/Kroi-Auto-Center-Oy/61561550627512/",
              "https://www.instagram.com/kroiautocenteroy"
            ]
          })
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Header */}
        <motion.header
          className="bg-white shadow-sm sticky top-0 z-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg px-2 py-1"
                aria-label="Takaisin etusivulle"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Takaisin etusivulle
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  KROI AUTO CENTER
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16 md:py-20 overflow-hidden relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Ota yhteyttä
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-purple-100 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Olemme täällä auttamassa sinua. Ota yhteyttä, niin autamme sinua löytämään
              juuri sinun tarpeisiisi sopivan auton!
            </motion.p>
          </div>

          {/* Floating elements */}
          <motion.div
            className="absolute top-20 left-4 md:left-10 w-16 md:w-20 h-16 md:h-20 bg-white/10 rounded-full"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-32 right-4 md:right-20 w-12 md:w-16 h-12 md:h-16 bg-pink-300/20 rounded-full"
            animate={{
              y: [0, 15, 0],
              x: [0, 10, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 lg:p-12"
              initial="initial"
              animate="animate"
              variants={fadeInLeft}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-slate-900 mb-6"
                variants={fadeInUp}
                transition={{ delay: 0.3 }}
              >
                Lähetä meille viesti
              </motion.h2>

              <motion.form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {/* Name Field */}
                <motion.div variants={fadeInUp}>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Nimi *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={formState.name.value}
                      onChange={(e) => updateField('name', e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className={cn(
                        "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent",
                        "placeholder:text-slate-400",
                        formState.name.error && formState.name.touched
                          ? "border-red-300 bg-red-50"
                          : focusedField === 'name'
                          ? "border-purple-300 bg-purple-50/30"
                          : "border-slate-300 hover:border-slate-400"
                      )}
                      placeholder="Nimesi"
                      aria-describedby={formState.name.error ? "name-error" : undefined}
                      aria-invalid={formState.name.error ? "true" : "false"}
                    />
                    {formState.name.isValidating && (
                      <div className="absolute right-3 top-3">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                      </div>
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    {formState.name.error && formState.name.touched && (
                      <motion.p
                        id="name-error"
                        className="mt-2 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        role="alert"
                      >
                        {formState.name.error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Email Field */}
                <motion.div variants={fadeInUp}>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Sähköposti *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formState.email.value}
                      onChange={(e) => updateField('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={cn(
                        "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent",
                        "placeholder:text-slate-400",
                        formState.email.error && formState.email.touched
                          ? "border-red-300 bg-red-50"
                          : focusedField === 'email'
                          ? "border-purple-300 bg-purple-50/30"
                          : "border-slate-300 hover:border-slate-400"
                      )}
                      placeholder="esimerkki@email.com"
                      aria-describedby={formState.email.error ? "email-error" : undefined}
                      aria-invalid={formState.email.error ? "true" : "false"}
                    />
                    {formState.email.isValidating && (
                      <div className="absolute right-3 top-3">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                      </div>
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    {formState.email.error && formState.email.touched && (
                      <motion.p
                        id="email-error"
                        className="mt-2 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        role="alert"
                      >
                        {formState.email.error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Phone Field */}
                <motion.div variants={fadeInUp}>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Puhelinnumero
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      value={formState.phone.value}
                      onChange={(e) => updateField('phone', e.target.value)}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className={cn(
                        "w-full px-4 py-3 border rounded-lg transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent",
                        "placeholder:text-slate-400",
                        formState.phone.error && formState.phone.touched
                          ? "border-red-300 bg-red-50"
                          : focusedField === 'phone'
                          ? "border-purple-300 bg-purple-50/30"
                          : "border-slate-300 hover:border-slate-400"
                      )}
                      placeholder="+358 40 123 4567"
                      aria-describedby={formState.phone.error ? "phone-error" : undefined}
                      aria-invalid={formState.phone.error ? "true" : "false"}
                    />
                    {formState.phone.isValidating && (
                      <div className="absolute right-3 top-3">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                      </div>
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    {formState.phone.error && formState.phone.touched && (
                      <motion.p
                        id="phone-error"
                        className="mt-2 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        role="alert"
                      >
                        {formState.phone.error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Message Field */}
                <motion.div variants={fadeInUp}>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Viesti *
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      value={formState.message.value}
                      onChange={(e) => updateField('message', e.target.value)}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      rows={6}
                      className={cn(
                        "w-full px-4 py-3 border rounded-lg transition-all duration-200 resize-none",
                        "focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent",
                        "placeholder:text-slate-400",
                        formState.message.error && formState.message.touched
                          ? "border-red-300 bg-red-50"
                          : focusedField === 'message'
                          ? "border-purple-300 bg-purple-50/30"
                          : "border-slate-300 hover:border-slate-400"
                      )}
                      placeholder="Kerro meille, miten voimme auttaa sinua..."
                      aria-describedby={formState.message.error ? "message-error" : undefined}
                      aria-invalid={formState.message.error ? "true" : "false"}
                    />
                    {formState.message.isValidating && (
                      <div className="absolute right-3 top-3">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                      </div>
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    {formState.message.error && formState.message.touched && (
                      <motion.p
                        id="message-error"
                        className="mt-2 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        role="alert"
                      >
                        {formState.message.error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={fadeInUp}>
                  <motion.button
                    type="submit"
                    disabled={formStatus === 'sending' || hasErrors() || !isFormFilled()}
                    className={cn(
                      "w-full px-8 py-4 rounded-lg font-semibold text-white",
                      "flex items-center justify-center gap-2 transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                      "disabled:cursor-not-allowed touch-manipulation",
                      formStatus === 'sending' || hasErrors() || !isFormFilled()
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 hover:scale-[1.02] active:scale-[0.98]"
                    )}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: formStatus !== 'sending' && !hasErrors() && isFormFilled() ? 1.02 : 1 }}
                    aria-label={formStatus === 'sending' ? 'Lähetetään viestiä' : 'Lähetä viesti'}
                  >
                    <AnimatePresence mode="wait">
                      {formStatus === 'sending' ? (
                        <motion.div
                          key="sending"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Lähetetään...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="send"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <Send className="h-5 w-5" />
                          Lähetä viesti
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                  {formStatus === 'success' && (
                    <motion.div
                      className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      role="alert"
                      aria-live="polite"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Kiitos viestistäsi! Otamme sinuun yhteyttä pian.
                    </motion.div>
                  )}

                  {formStatus === 'error' && (
                    <motion.div
                      className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      role="alert"
                      aria-live="assertive"
                    >
                      Viestin lähetys epäonnistui. Yritä uudelleen tai ota yhteyttä puhelimitse.
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-6 lg:space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {/* Contact Details */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                variants={fadeInRight}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.h2
                  className="text-2xl font-bold text-slate-900 mb-6"
                  variants={fadeInUp}
                >
                  Yhteystiedot
                </motion.h2>

                <motion.div
                  className="space-y-6"
                  variants={staggerContainer}
                >
                  <motion.div
                    className="flex items-start gap-4 group"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Puhelin</h3>
                      <a
                        href="tel:+358413188214"
                        className="text-purple-600 hover:text-purple-700 hover:underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded px-1"
                        aria-label="Soita numeroon +358 41 3188214"
                      >
                        +358 41 3188214
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4 group"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Sähköposti</h3>
                      <a
                        href="mailto:kroiautocenter@gmail.com"
                        className="text-purple-600 hover:text-purple-700 hover:underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded px-1 break-all"
                        aria-label="Lähetä sähköposti osoitteeseen kroiautocenter@gmail.com"
                      >
                        kroiautocenter@gmail.com
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4 group"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Osoite</h3>
                      <address className="text-slate-700 not-italic">
                        Läkkisepäntie 15 B 300620<br />
                        00620 Helsinki
                      </address>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-4 group"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Aukioloajat</h3>
                      <div className="text-slate-700">
                        <time>Ma-Pe: 10:00 - 18:00</time><br />
                        <time>La: 11:00 - 17:00</time><br />
                        <span>Su: Suljettu</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* WhatsApp CTA */}
              <motion.div
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 md:p-8 text-white overflow-hidden relative"
                variants={scaleIn}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-4 -translate-x-4" />

                <div className="relative z-10">
                  <motion.div
                    className="flex items-center gap-3 mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold">Lähetä WhatsApp-viesti</h3>
                  </motion.div>

                  <motion.p
                    className="text-green-50 mb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Saat nopean vastauksen viesteihin WhatsAppin kautta. Olemme täällä auttamassa!
                  </motion.p>

                  <motion.a
                    href="https://wa.me/358413188214"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-green-500 touch-manipulation"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Avaa WhatsApp keskustelu"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Avaa WhatsApp
                  </motion.a>
                </div>
              </motion.div>

              {/* Social Media */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                variants={scaleIn}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.h3
                  className="text-xl font-bold text-slate-900 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Seuraa meitä
                </motion.h3>

                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.a
                    href="https://www.facebook.com/people/Kroi-Auto-Center-Oy/61561550627512/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation"
                    aria-label="Seuraa meitä Facebookissa"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Facebook className="h-6 w-6" />
                  </motion.a>

                  <motion.a
                    href="https://www.instagram.com/kroiautocenteroy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 touch-manipulation"
                    aria-label="Seuraa meitä Instagramissa"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Instagram className="h-6 w-6" />
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            className="mt-12 lg:mt-16"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              whileHover={{ scale: 1.005 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="h-80 md:h-96 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1985.32!2d24.928487!3d60.205532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjDCsDEyJzE5LjkiTiAyNMKwNTUnNDIuNiJF!5e0!3m2!1sfi!2sfi!4v1650000000000!5m2!1sfi!2sfi&q=Läkkisepäntie+15+B+300620,+00620+Helsinki,+Finland"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="KROI AUTO CENTER sijainti kartalla: Läkkisepäntie 15 B 300620, 00620 Helsinki"
                  aria-label="Interaktiivinen kartta KROI AUTO CENTER sijainnista Helsingissä"
                  className="rounded-2xl"
                />

                {/* Map overlay with contact info */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-slate-900">KROI AUTO CENTER</h4>
                  </div>
                  <address className="text-sm text-slate-600 not-italic">
                    Läkkisepäntie 15 B 300620<br />
                    00620 Helsinki
                  </address>
                  <div className="mt-2 text-sm text-slate-600">
                    <time>Ma-Pe: 10:00-18:00</time><br />
                    <time>La: 11:00-17:00</time>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
}