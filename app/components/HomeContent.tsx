'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Car, Target, Heart, Users, TrendingUp, Phone, Mail, MapPin, Clock, Facebook, Instagram, Menu, X, Send, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getPlaceholder } from '../lib/image-placeholder';

interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: string;
  km: string;
  fuel: string;
  transmission: string;
  image?: string;
  slug: string;
  description: string;
}

interface HomeContentProps {
  cars: Car[];
}

export default function HomeContent({ cars }: HomeContentProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 1, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                KROI AUTO CENTER
              </span>
            </motion.div>

            <div className="hidden md:flex space-x-8">
              <a href="#cars" className="text-slate-700 hover:text-purple-600 transition font-medium">Autot</a>
              <a href="#about" className="text-slate-700 hover:text-purple-600 transition font-medium">Meistä</a>
              <a href="#contact" className="text-slate-700 hover:text-purple-600 transition font-medium">Ota yhteyttä</a>
            </div>

            <div className="flex items-center space-x-4">
              <a href="tel:+358413188214" className="hidden sm:flex text-purple-600 hover:text-purple-700 transition">
                <Phone className="h-5 w-5" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-slate-700 hover:text-purple-600 transition"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-md z-40 shadow-lg md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <a
                href="#cars"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-purple-600 transition font-medium py-2"
              >
                Autot
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-purple-600 transition font-medium py-2"
              >
                Meistä
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-purple-600 transition font-medium py-2"
              >
                Ota yhteyttä
              </a>
              <a
                href="tel:+358413188214"
                className="block text-purple-600 hover:text-purple-700 transition font-medium py-2"
              >
                <Phone className="h-5 w-5 inline mr-2" />
                Soita meille
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href="https://wa.me/358413188214"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                Me autamme sinua löytämään{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  juuri sinun tarpeisiisi sopivan auton
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8">
                Meiltä löydät suuren valikoiman laadukkaita käytettyjä autoja. Yli 15 vuoden kokemus takaa luotettavan palvelun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition text-center"
                >
                  Ota yhteyttä
                </motion.a>
                <motion.a
                  href="#cars"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition text-center"
                >
                  Myynnissä olevat autot
                </motion.a>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0.95, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <Car className="h-32 w-32 md:h-48 md:w-48 text-white opacity-30" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="cars" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Myynnissä olevat autot</h2>
            <p className="text-lg md:text-xl text-slate-600">Laadukkaita ja tarkastettuja käytettyjä autoja</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 1, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(168,85,168,0.2)' }}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-purple-300 transition-all duration-300 h-full flex flex-col"
                >
                  <Link href={`/cars/${car.slug}`} className="flex-1 block">
                    <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                      {car.image ? (
                        <Image
                          src={car.image}
                          alt={car.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading={index < 3 ? 'eager' : 'lazy'}
                          priority={index < 3}
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
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition">{car.name}</h3>
                      <p className="text-2xl md:text-3xl font-bold text-purple-600 mb-4">{car.price}</p>
                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                        {car.year && <p>📅 {car.year}</p>}
                        <p>⛽ {car.fuel}</p>
                        <p>⚙️ {car.transmission}</p>
                        <p>🛣️ {car.km}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-purple-600 font-semibold hover:text-purple-700 transition">
                          Lue lisää →
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="px-6 pb-6 pt-0">
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`https://wa.me/358413188214?text=Hei! Olen kiinnostunut autosta: ${car.name}`, '_blank');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition text-center"
                    >
                      💬 WhatsApp
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Meistä</h2>
            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Uuden auton ostaminen on iso päätös. Siksi on tärkeää valita luotettava jälleenmyyjä joka takaa
              myymänsä tuotteen laadun – juuri sellainen olemme me, kasvava perheyritys Kroi Auto Center.
              Pienen henkilöstömme ansiosta voimme tarjota joustavaa ja henkilökohtaista palvelua.
              Meillä on yli 15 vuoden kokemus autojen ostosta ja myynnistä. Palvelemme sinua suomeksi,
              ruotsiksi ja englanniksi.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: '100% Sitoutunut',
                desc: 'Työntekijöiden sitoutuminen on korkean asiakastyytyväisyyden salaisuus.',
              },
              {
                icon: Heart,
                title: 'Luotettava & rehellinen',
                desc: 'Myymme vain tarkastettuja ja laadukkaita autoja – rehellisyys ja läpinäkyvyys ovat toimintamme kulmakiviä.',
              },
              {
                icon: Users,
                title: 'Joustava palvelu',
                desc: 'Pienen ja tehokkaan tiimimme ansiosta voimme tarjota henkilökohtaista ja joustavaa palvelua.',
              },
              {
                icon: TrendingUp,
                title: 'Vankka kokemus',
                desc: 'Yli 15 vuoden kokemus takaa ammattitaitoisen palvelun ja asiantuntevat neuvot.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 1, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-sm md:text-base text-slate-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 1, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Yhteystiedot</h2>
              <p className="text-slate-300 mb-8">
                Ota meihin yhteyttä, niin autamme sinua löytämään unelmiesi auton!
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Puhelin</p>
                    <a href="tel:+358413188214" className="text-slate-300 hover:text-purple-400 transition">
                      +358 41 3188214
                    </a><br />
                    <a href="tel:+358442423508" className="text-slate-300 hover:text-purple-400 transition">
                      +358 44 2423508
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Sähköposti</p>
                    <a href="mailto:kroiautocenter@gmail.com" className="text-slate-300 hover:text-purple-400 transition">
                      kroiautocenter@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Osoite</p>
                    <p className="text-slate-300">
                      Läkkisepäntie 15 B 300620<br />
                      Helsinki, Finland
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Aukioloajat</p>
                    <p className="text-slate-300">MA-PE: 10:00 - 18:00</p>
                    <p className="text-slate-300">LA: 11:00 - 17:00</p>
                    <p className="text-slate-300">SU: Suljettu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <a
                    href="https://www.facebook.com/people/Kroi-Auto-Center-Oy/61561550627512/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/kroiautocenteroy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 1, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Nimi</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
                    placeholder="Nimesi"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Sähköposti</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
                    placeholder="sähköpostisi@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Puhelin</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
                    placeholder="+358 XX XXX XXXX"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Viesti</label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
                    placeholder="Kerro meille mitä autoa etsit..."
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {formStatus === 'sending' ? (
                    <span>Lähetetään...</span>
                  ) : formStatus === 'success' ? (
                    <span>✓ Lähetetty!</span>
                  ) : formStatus === 'error' ? (
                    <span>Virhe! Yritä uudelleen</span>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Lähetä viesti</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm md:text-base">&copy; 2025 Kroi Autocenter Oy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}