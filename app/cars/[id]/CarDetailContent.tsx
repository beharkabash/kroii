'use client';

import { motion } from 'framer-motion';
import { Car, ArrowLeft, Phone, MessageCircle, Share2, Facebook, Check, MapPin, Calendar, Gauge, Fuel, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getPlaceholder } from '@/app/lib/features/image-placeholder';
import { Testimonials } from '@/app/components/features/testimonials';
import { TestDriveScheduler } from '@/app/components/features/cars';

interface CarImage {
  url: string;
  altText: string;
  order: number;
  isPrimary: boolean;
}

interface CarData {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  year: string | number;
  priceEur: number;
  fuel: string;
  transmission: string;
  kmNumber: number;
  color?: string;
  driveType?: string;
  engineSize?: string;
  power?: number;
  status: string;
  condition: string;
  category: string;
  featured: boolean;
  description: string;
  detailedDescription?: string[];
  images: CarImage[];
  features?: { feature: string }[];
  specifications?: { label: string; value: string }[];
}

interface CarDetailContentProps {
  car: CarData | null;
  relatedCars: CarData[];
}

/**
 * Client Component - Car Detail Content
 * Renders car details with interactive features (sharing, animations)
 */
export function CarDetailContent({ car, relatedCars }: CarDetailContentProps) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Car className="h-24 w-24 text-slate-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Autoa ei löytynyt</h1>
          <p className="text-slate-600 mb-8">Etsimääsi autoa ei valitettavasti löytynyt.</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Takaisin etusivulle
          </Link>
        </div>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/358413188214?text=Hei! Olen kiinnostunut autosta: ${encodeURIComponent(car.name)} (${encodeURIComponent('€' + car.priceEur.toLocaleString())})`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${car.name} - Kroi Auto Center`,
          text: `Katso tämä auto: ${car.name} hintaan €${car.priceEur.toLocaleString()}`,
          url: shareUrl,
        });
      } catch {
        // Share cancelled or failed silently
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      } catch {
        // Clipboard access denied silently
      }
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Katso tämä auto: ${car.name} hintaan €${car.priceEur.toLocaleString()} - ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                KROI AUTO CENTER
              </span>
            </Link>

            <Link
              href="/"
              className="flex items-center space-x-2 text-slate-700 hover:text-purple-600 transition font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Takaisin</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="pt-20 pb-4 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-slate-600">
            <Link href="/" className="hover:text-purple-600 transition">Etusivu</Link>
            <span className="mx-2">/</span>
            <Link href="/#cars" className="hover:text-purple-600 transition">Autot</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-medium">{car.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section with Image */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-100 to-pink-100"
            >
              {car.images?.[0]?.url ? (
                <Image
                  src={car.images[0].url}
                  alt={car.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  placeholder="blur"
                  blurDataURL={getPlaceholder(700, 500)}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Car className="h-32 w-32 text-purple-400" />
                </div>
              )}
            </motion.div>

            {/* Title and Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">{car.name}</h1>
                <p className="text-xl text-slate-600">{car.description}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="text-5xl font-bold text-purple-600 mb-4">€{car.priceEur.toLocaleString()}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="text-slate-700">{car.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-5 w-5 text-purple-600" />
                    <span className="text-slate-700">{car.kmNumber.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-5 w-5 text-purple-600" />
                    <span className="text-slate-700">{car.fuel}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    <span className="text-slate-700">{car.transmission}</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-3 w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition text-lg"
                >
                  <MessageCircle className="h-6 w-6" />
                  <span>Kysy lisää WhatsAppissa</span>
                </motion.a>

                <motion.a
                  href="tel:+358413188214"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-3 w-full px-8 py-4 bg-white border-2 border-purple-300 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
                >
                  <Phone className="h-6 w-6" />
                  <span>Soita: +358 41 3188214</span>
                </motion.a>

                {/* Share Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition flex items-center justify-center space-x-2"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>{shareStatus === 'copied' ? 'Kopioitu!' : 'Jaa'}</span>
                  </motion.button>
                  <motion.button
                    onClick={handleWhatsAppShare}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                    aria-label="Jaa WhatsAppissa"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    onClick={handleFacebookShare}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    aria-label="Jaa Facebookissa"
                  >
                    <Facebook className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Condition Badge */}
              <div className="flex items-center space-x-2 text-sm text-slate-600 bg-green-50 border border-green-200 rounded-lg p-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>{car.condition}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Kuvaus</h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              {Array.isArray(car.detailedDescription) ? (
                car.detailedDescription.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>{car.detailedDescription || car.description}</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specifications Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Tekniset tiedot</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {car.specifications?.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg p-4 shadow-sm border border-slate-200"
                >
                  <div className="text-sm text-slate-600 mb-1">{spec.label}</div>
                  <div className="text-lg font-semibold text-slate-900">{spec.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Varusteet</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {car.features?.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100"
                >
                  <Check className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span className="text-slate-700">{typeof feature === 'string' ? feature : feature.feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vehicle-Specific Testimonials */}
      <Testimonials vehicleId={car.id} limit={3} showTitle={true} className="py-16 bg-slate-50" />

      {/* Test Drive Scheduler */}
      <TestDriveScheduler
        vehicleId={car.id}
        vehicleInfo={{
          make: car.brand,
          model: car.model,
          year: typeof car.year === 'string' ? parseInt(car.year) : car.year,
          image: car.images?.[0]?.url
        }}
        className="py-16 bg-slate-50"
      />

      {/* Contact Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kiinnostuitko?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Ota meihin yhteyttä, niin kerromme lisää tästä autosta ja sovimme koeajon!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-lg transition flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-6 w-6" />
                <span>WhatsApp</span>
              </motion.a>
              <motion.a
                href="tel:+358413188214"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition flex items-center justify-center space-x-2"
              >
                <Phone className="h-6 w-6" />
                <span>+358 41 3188214</span>
              </motion.a>
            </div>
            <div className="mt-6 flex items-center justify-center space-x-2 text-slate-400">
              <MapPin className="h-5 w-5" />
              <span>Läkkisepäntie 15 B, Helsinki</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Cars */}
      {relatedCars.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Muita autoja</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCars.map((relatedCar, index) => (
                  <motion.div
                    key={relatedCar.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/cars/${relatedCar.slug}`}
                      className="block bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl group"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                        {relatedCar.images?.[0]?.url ? (
                          <Image
                            src={relatedCar.images[0].url}
                            alt={relatedCar.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            placeholder="blur"
                            blurDataURL={getPlaceholder(400, 192)}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <Car className="h-24 w-24 text-purple-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition">
                          {relatedCar.name}
                        </h3>
                        <p className="text-2xl font-bold text-purple-600 mb-3">€{relatedCar.priceEur.toLocaleString()}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{relatedCar.year}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Gauge className="h-4 w-4" />
                            <span>{relatedCar.kmNumber.toLocaleString()} km</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm md:text-base">&copy; 2025 Kroi Autocenter Oy. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}