'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
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
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
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
                <Mail className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                KROI AUTO CENTER
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ota yhteyttä
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Olemme täällä auttamassa sinua. Ota yhteyttä, niin autamme sinua löytämään
            juuri sinun tarpeisiisi sopivan auton!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Lähetä meille viesti
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Nimi *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Nimesi"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Sähköposti *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="esimerkki@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Puhelinnumero
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="+358 40 123 4567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Viesti *
                </label>
                <textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Kerro meille, miten voimme auttaa sinua..."
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                {formStatus === 'sending' ? 'Lähetetään...' : 'Lähetä viesti'}
              </button>

              {formStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                  Kiitos viestistäsi! Otamme sinuun yhteyttä pian.
                </div>
              )}

              {formStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  Viestin lähetys epäonnistui. Yritä uudelleen tai ota yhteyttä puhelimitse.
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Yhteystiedot
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Puhelin</h3>
                    <a href="tel:+358413188214" className="text-purple-600 hover:underline">
                      +358 41 3188214
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Sähköposti</h3>
                    <a href="mailto:kroiautocenter@gmail.com" className="text-purple-600 hover:underline">
                      kroiautocenter@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Osoite</h3>
                    <p className="text-slate-700">
                      Läkkisepäntie 15 B 300620<br />
                      00620 Helsinki
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Aukioloajat</h3>
                    <p className="text-slate-700">
                      Ma-Pe: 10:00 - 18:00<br />
                      La: 11:00 - 17:00<br />
                      Su: Suljettu
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Lähetä WhatsApp-viesti</h3>
              </div>
              <p className="text-green-50 mb-6">
                Saat nopean vastauksen viesteihin WhatsAppin kautta. Olemme täällä auttamassa!
              </p>
              <a
                href="https://wa.me/358413188214"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Avaa WhatsApp
              </a>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Seuraa meitä
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/people/Kroi-Auto-Center-Oy/61561550627512/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/kroiautocenteroy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg transition"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-96 bg-slate-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">
                  Kartta tulossa pian
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
