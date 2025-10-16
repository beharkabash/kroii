'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUp
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const socialIcons = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700' },
  ];

  const quickLinks = [
    { name: 'Etusivu', href: '/' },
    { name: 'Autot', href: '/cars' },
    { name: 'Rahoitus', href: '/financing' },
    { name: 'Vakuutukset', href: '/insurance' },
  ];

  const services = [
    { name: 'Autokauppa', href: '/cars' },
    { name: 'Huolto', href: '/services/maintenance' },
    { name: 'Varaosapalvelu', href: '/services/parts' },
    { name: 'Asiakaspalvelu', href: '/customer-service' },
  ];

  const legal = [
    { name: 'Tietosuoja', href: '/privacy' },
    { name: 'Käyttöehdot', href: '/terms' },
    { name: 'Evästeet', href: '/cookies' },
    { name: 'Takuuehdot', href: '/warranty' },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-pink-500 to-transparent rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600 to-transparent rounded-full blur-3xl opacity-20"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10"
      >
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Kroi Auto Center</span>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Luotettava kumppanisi autokaupassa jo yli 15 vuotta. Tarjoamme laadukkaita käytettyjä
                autoja, huoltopalveluja ja rahoitusratkaisuja.
              </p>

              {/* Social Media */}
              <div className="flex space-x-4">
                {socialIcons.map(({ icon: Icon, href, label, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-slate-400 ${color} transition-all duration-300 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50`}
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-6 text-white">Pikalinkit</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-6 text-white">Palvelut</h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link
                      href={service.href}
                      className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-semibold mb-6 text-white">Yhteystiedot</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-300">Teollisuuskatu 15</p>
                    <p className="text-slate-300">00510 Helsinki</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <a
                    href="tel:+358401234567"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    +358 40 123 4567
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <a
                    href="mailto:info@kroiautocenter.fi"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    info@kroiautocenter.fi
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-slate-300">
                    <p>Ma-Pe: 9:00-18:00</p>
                    <p>La: 10:00-15:00</p>
                    <p>Su: Suljettu</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            variants={itemVariants}
            className="border-t border-slate-700 mt-12 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} Kroi Auto Center. Kaikki oikeudet pidätetään.
              </p>

              {/* Legal Links */}
              <div className="flex flex-wrap gap-6">
                {legal.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Back to Top Button */}
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Takaisin ylös"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      </motion.div>
    </footer>
  );
}