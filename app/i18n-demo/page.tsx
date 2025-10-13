'use client';

import { useTranslation } from '@/app/lib/i18n/provider';
import TranslatedHeader from '@/app/components/TranslatedHeader';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import { Car, Target, Heart, Users, Search, ArrowRight, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function I18nDemoPage() {
  const { t, locale } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50">
      <TranslatedHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {t('homepage.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-8">
                {t('homepage.hero.subtitle')}
              </p>

              {/* Search Box */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t('homepage.hero.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition">
                    {t('common.search')}
                  </button>
                </div>
              </div>

              <Link
                href="/cars"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-900 rounded-2xl hover:bg-purple-50 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl"
              >
                {t('homepage.hero.browseAll')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {locale === 'fi' ? 'Miksi valita meidät?' : 'Why choose us?'}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {locale === 'fi'
                ? 'Yli 15 vuoden kokemus autojen myynnistä ja luotettava palvelu asiakkaillemme'
                : 'Over 15 years of experience in car sales and reliable service for our customers'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: t('homepage.features.quality.title'),
                description: t('homepage.features.quality.description'),
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Heart,
                title: t('homepage.features.financing.title'),
                description: t('homepage.features.financing.description'),
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Users,
                title: t('homepage.features.service.title'),
                description: t('homepage.features.service.description'),
                color: 'from-green-500 to-green-600'
              },
              {
                icon: Car,
                title: t('homepage.features.warranty.title'),
                description: t('homepage.features.warranty.description'),
                color: 'from-pink-500 to-pink-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-all"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-4`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Demo Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            {locale === 'fi' ? '🌍 Monikielisyys Demo' : '🌍 Multi-language Demo'}
          </h2>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <p className="text-lg text-slate-600 mb-6">
              {locale === 'fi'
                ? 'Sivusto tukee nyt suomea ja englantia. Vaihda kieltä käyttämällä kielivalitsinta.'
                : 'The website now supports Finnish and English. Change language using the language switcher.'
              }
            </p>

            <div className="flex justify-center mb-6">
              <LanguageSwitcher />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t('common.navigation')}:
                </h3>
                <ul className="space-y-1 text-slate-600">
                  <li>• {t('navigation.home')}</li>
                  <li>• {t('navigation.inventory')}</li>
                  <li>• {t('navigation.financing')}</li>
                  <li>• {t('navigation.about')}</li>
                  <li>• {t('navigation.contact')}</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t('common.common')}:
                </h3>
                <ul className="space-y-1 text-slate-600">
                  <li>• {t('common.search')}</li>
                  <li>• {t('common.price')}</li>
                  <li>• {t('common.contact')}</li>
                  <li>• {t('common.save')}</li>
                  <li>• {t('common.loading')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('homepage.cta.title')}
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            {t('homepage.cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-900 rounded-2xl hover:bg-purple-50 transition-all font-semibold shadow-xl hover:shadow-2xl"
            >
              <Phone className="mr-2 h-5 w-5" />
              {t('homepage.cta.contact')}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-2xl hover:bg-white hover:text-purple-900 transition-all font-semibold"
            >
              <MapPin className="mr-2 h-5 w-5" />
              {t('homepage.cta.visit')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Kroi Auto Center</span>
              </div>
              <p className="text-slate-300 mb-4">
                {t('footer.tagline')}
              </p>
              <p className="text-slate-400 text-sm">
                {t('footer.copyright', { year: new Date().getFullYear() })}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2 text-slate-300">
                <li><Link href="/cars" className="hover:text-white transition">{t('navigation.inventory')}</Link></li>
                <li><Link href="/financing" className="hover:text-white transition">{t('navigation.financing')}</Link></li>
                <li><Link href="/about" className="hover:text-white transition">{t('navigation.about')}</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">{t('navigation.contact')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.contact')}</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+358 41 318 8214</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>info@kroiautocenter.fi</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{t('footer.address')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{t('footer.hours')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}