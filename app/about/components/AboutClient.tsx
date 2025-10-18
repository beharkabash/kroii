'use client';

import React, { Component, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Heart, Award, Target, TrendingUp, Shield, Handshake } from 'lucide-react';
import { motion } from 'framer-motion';

// Error boundary component
class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('About page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Jotain meni vikaan</h2>
            <p className="text-slate-600">Yritä päivittää sivu.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="animate-pulse">
        <div className="bg-white shadow-sm h-20"></div>
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-60"></div>
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
          <div className="bg-white rounded-2xl h-64"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-40"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const slideInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

// Removed unused fadeInScale animation variant

export default function AboutClient() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-sm sticky top-0 z-50"
          >
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
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    KROI AUTO CENTER
                  </span>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Hero Section */}
          <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Meistä
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-purple-100 max-w-2xl mx-auto"
              >
                Yli 15 vuoden kokemus autojen myynnistä. Perheyritys, joka arvostaa
                asiakkaitaan ja tarjoaa henkilökohtaista palvelua.
              </motion.p>
            </div>
          </section>

          {/* Main Content */}
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Our Story */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Tarinaamme</h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="prose prose-slate max-w-none"
                >
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    Kroi Auto Center perustettiin intohimosta autoja ja halusta tarjoa asiakkaillemme
                    parasta mahdollista palvelua. Olemme perheyritys, joka ymmärtää, että auton ostaminen
                    on iso päätös ja investointi.
                  </p>

                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    Yli 15 vuoden kokemuksella olemme auttaneet satoja asiakkaita löytämään täydellisen
                    auton heidän tarpeisiinsa. Uskomme rehellisyyteen, läpinäkyvyyteen ja henkilökohtaiseen
                    palveluun - jokaisella asiakkaalla on ainutlaatuiset tarpeet, ja me kuuntelemme.
                  </p>

                  <p className="text-lg text-slate-700 leading-relaxed">
                    Erikoisalueemme ovat laadukkaat käytetyt autot merkityistä valmistajista kuten BMW,
                    Mercedes-Benz, Skoda, Volkswagen ja Audi. Jokainen myymämme auto on huolellisesti
                    tarkastettu ja valmisteltu uuteen kotiin.
                  </p>
                </motion.div>
              </div>
            </motion.section>

            {/* Our Values */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl font-bold text-slate-900 mb-8 text-center"
              >
                Arvomme
              </motion.h2>

              <motion.div
                className="grid md:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Value Card 1 - Luotettavuus */}
                <motion.div
                  variants={slideInUp}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-600 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Shield className="h-5 w-5 text-purple-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-900">Luotettavuus</h3>
                  </div>
                  <p className="text-slate-700">
                    Rehellisyys ja läpinäkyvyys kaikessa tekemisessämme. Kerromme auton todellisen
                    kunnon ja historian ilman kaunistelemista.
                  </p>
                </motion.div>

                {/* Value Card 2 - Asiakaslähtöisyys */}
                <motion.div
                  variants={slideInUp}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-pink-500 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Heart className="h-5 w-5 text-pink-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-900">Asiakaslähtöisyys</h3>
                  </div>
                  <p className="text-slate-700">
                    Jokainen asiakas on meille tärkeä. Autamme sinua löytämään juuri sinun tarpeisiisi
                    sopivan auton - ei vain myymme autoa.
                  </p>
                </motion.div>

                {/* Value Card 3 - Laatu */}
                <motion.div
                  variants={slideInUp}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-600 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Award className="h-5 w-5 text-purple-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-900">Laatu</h3>
                  </div>
                  <p className="text-slate-700">
                    Myymme vain tarkastettuja ja laadukkaita autoja. Jokainen auto käy läpi
                    perusteellisen tarkastuksen ennen myyntiä.
                  </p>
                </motion.div>

                {/* Value Card 4 - Pitkäaikaiset suhteet */}
                <motion.div
                  variants={slideInUp}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-pink-500 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Handshake className="h-5 w-5 text-pink-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-900">Pitkäaikaiset suhteet</h3>
                  </div>
                  <p className="text-slate-700">
                    Asiakassuhde ei pääty kaupantekoon. Olemme täällä myös kaupan jälkeen,
                    jos tarvitset apua tai neuvoja.
                  </p>
                </motion.div>
              </motion.div>
            </motion.section>

            {/* Why Choose Us */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Miksi valita meidät?</h2>
                </motion.div>

                <motion.div
                  className="grid md:grid-cols-2 gap-6"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      title: "Yli 15 vuoden kokemus",
                      description: "Pitkä kokemus autokaupasta ja asiakaspalvelusta"
                    },
                    {
                      title: "Henkilökohtainen palvelu",
                      description: "Aikaa ja huomiota jokaiselle asiakkaalle"
                    },
                    {
                      title: "Laadukkaat autot",
                      description: "Kaikki autot huolellisesti tarkastettu"
                    },
                    {
                      title: "Monikielinen palvelu",
                      description: "Palvelemme suomeksi, ruotsiksi ja englanniksi"
                    },
                    {
                      title: "Rahoitusapu",
                      description: "Autamme rahoituksen järjestämisessä"
                    },
                    {
                      title: "Vaihtoautot",
                      description: "Otamme vaihtoautoja kauppahyvityksenä"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={slideInUp}
                      whileHover={{ x: 10, transition: { duration: 0.2 } }}
                      className="flex items-start gap-4"
                    >
                      <motion.div
                        className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-white font-bold">✓</span>
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                        <p className="text-slate-700 text-sm">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.section>

            {/* Contact CTA */}
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 md:p-12 text-white text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center mb-6"
              >
                <motion.div
                  className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <TrendingUp className="h-8 w-8 text-white" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Haluatko tietää lisää?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto"
              >
                Olemme täällä auttamassa sinua. Ota yhteyttä ja kerro tarpeistasi!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
                  >
                    Ota yhteyttä
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/cars"
                    className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
                  >
                    Selaa autoja
                  </Link>
                </motion.div>
              </motion.div>
            </motion.section>
          </main>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}