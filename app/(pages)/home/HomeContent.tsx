'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Car, Target, Heart, Users, TrendingUp, Phone, Mail, MapPin, Clock, Facebook, Instagram, Send, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getPlaceholder } from '../../lib/features/image-placeholder';
import Testimonials from '../../components/features/testimonials/Testimonials';
import FinancingCalculator from '../../components/features/financing/FinancingCalculator';

import type { Car } from '@/app/data/cars';

interface HomeContentProps {
  cars: Car[];
}

export default function HomeContent({ cars }: HomeContentProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    // Create mailto link with form data
    const subject = encodeURIComponent(`Yhteydenotto - ${formData.name}`);
    const body = encodeURIComponent(
      `Hei,\n\nNimi: ${formData.name}\nSähköposti: ${formData.email}\nPuhelin: ${formData.phone || 'Ei annettu'}\n\nViesti:\n${formData.message}\n\nYstävällisin terveisin,\n${formData.name}`
    );
    const mailtoLink = `mailto:kroiautocenter@gmail.com?subject=${subject}&body=${body}`;

    // Create WhatsApp link as backup
    const whatsappMessage = encodeURIComponent(
      `Hei! Olen kiinnostunut ottamaan yhteyttä.\n\nNimi: ${formData.name}\nSähköposti: ${formData.email}\nPuhelin: ${formData.phone || 'Ei annettu'}\n\nViesti: ${formData.message}`
    );
    const whatsappLink = `https://wa.me/358413188214?text=${whatsappMessage}`;

    // Try to open mailto first, with WhatsApp as fallback
    try {
      window.location.href = mailtoLink;

      // Show success message after a short delay
      setTimeout(() => {
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      }, 500);

      // Offer WhatsApp alternative after mailto
      setTimeout(() => {
        if (confirm('Haluatko vaihtoehtoisesti lähettää viestin WhatsAppissa?')) {
          window.open(whatsappLink, '_blank');
        }
      }, 2000);
    } catch {
      // If mailto fails, open WhatsApp
      window.open(whatsappLink, '_blank');
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen">{/* Header and nav are now handled by PageLayout */}

      <a
        href="https://wa.me/358413188214"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Me autamme sinua löytämään{' '}
                <motion.span
                  className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  juuri sinun tarpeisiisi sopivan auton
                </motion.span>
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-slate-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Meiltä löydät suuren valikoiman laadukkaita käytettyjä autoja. Yli 15 vuoden kokemus takaa luotettavan palvelun.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    href="/contact"
                    className="block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-purple-500/50 transition text-center"
                  >
                    Ota yhteyttä
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    href="/cars"
                    className="block px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition text-center"
                  >
                    Myynnissä olevat autot
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center"
                animate={{
                  background: [
                    "linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 100%)",
                    "linear-gradient(135deg, rgb(219, 39, 119) 0%, rgb(147, 51, 234) 100%)",
                    "linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 100%)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 0.95, 1]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Car className="h-32 w-32 md:h-48 md:w-48 text-white opacity-30" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="cars" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Myynnissä olevat autot
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-slate-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Laadukkaita ja tarkastettuja käytettyjä autoja
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {cars?.length > 0 ? cars.map((car, index) => (
              <motion.div
                key={car.id}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut"
                    }
                  }
                }}
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
            )) : (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="col-span-full text-center py-12"
              >
                <p className="text-slate-600">Ei autoja saatavilla tällä hetkellä.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Meistä
            </motion.h2>
            <motion.p
              className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Uuden auton ostaminen on iso päätös. Siksi on tärkeää valita luotettava jälleenmyyjä joka takaa
              myymänsä tuotteen laadun – juuri sellainen olemme me, kasvava perheyritys Kroi Auto Center.
              Pienen henkilöstömme ansiosta voimme tarjota joustavaa ja henkilökohtaista palvelua.
              Meillä on yli 15 vuoden kokemus autojen ostosta ja myynnistä. Palvelemme sinua suomeksi,
              ruotsiksi ja englanniksi.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
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
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut"
                    }
                  }
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-sm md:text-base text-slate-600">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Testimonials limit={6} showTitle={true} />

      <FinancingCalculator className="py-16 bg-slate-50" />

      <section id="contact" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle at 30% 40%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)",
                "radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.4) 0%, transparent 50%)",
                "radial-gradient(circle at 30% 40%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)"
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Yhteystiedot
              </motion.h2>
              <motion.p
                className="text-slate-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Ota meihin yhteyttä, niin autamme sinua löytämään unelmiesi auton!
              </motion.p>

              <motion.div
                className="space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.15,
                      delayChildren: 0.6
                    }
                  }
                }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                  }}
                  className="flex items-start space-x-4"
                >
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
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                  }}
                  className="flex items-start space-x-4"
                >
                  <Mail className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Sähköposti</p>
                    <a href="mailto:kroiautocenter@gmail.com" className="text-slate-300 hover:text-purple-400 transition">
                      kroiautocenter@gmail.com
                    </a>
                  </div>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                  }}
                  className="flex items-start space-x-4"
                >
                  <MapPin className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Osoite</p>
                    <p className="text-slate-300">
                      Läkkisepäntie 15 B 300620<br />
                      Helsinki, Finland
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                  }}
                  className="flex items-start space-x-4"
                >
                  <Clock className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Aukioloajat</p>
                    <p className="text-slate-300">MA-PE: 10:00 - 18:00</p>
                    <p className="text-slate-300">LA: 11:00 - 17:00</p>
                    <p className="text-slate-300">SU: Suljettu</p>
                  </div>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className="flex items-center space-x-4 pt-4"
                >
                  <motion.a
                    href="https://www.facebook.com/people/Kroi-Auto-Center-Oy/61561550627512/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-10 w-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </motion.a>
                  <motion.a
                    href="https://www.instagram.com/kroiautocenteroy"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-10 w-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.5
                    }
                  }
                }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                >
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
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                >
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
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                >
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Puhelin</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 transition text-white"
                    placeholder="+358 XX XXX XXXX"
                  />
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                >
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
                </motion.div>
                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
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
              </motion.form>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}