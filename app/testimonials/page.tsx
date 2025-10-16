import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Star, Plus } from 'lucide-react';
import { Testimonials } from '../components/features/testimonials';

export const metadata: Metadata = {
  title: 'Asiakkaiden arvostelut | Kroi Auto Center',
  description: 'Lue mitä tyytyväiset asiakkaamme kertovat kokemuksistaan Kroi Auto Centeristä. Laadukkaita autoja ja luotettavaa palvelua.',
};

export default function TestimonialsPage() {
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
                <Star className="h-5 w-5 text-white" />
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
            Asiakkaiden arvostelut
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            Lue mitä tyytyväiset asiakkaamme kertovat kokemuksistaan kanssamme.
            Jokaisella arvostelulla on merkitystä!
          </p>
          <Link
            href="/testimonials/submit"
            className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Jaa oma kokemuksesi
          </Link>
        </div>
      </section>

      {/* Testimonials Grid */}
      <main>
        <Testimonials limit={50} showTitle={false} className="py-16 bg-white" />
      </main>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Haluatko jakaa oman kokemuksesi?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Arvosteluasi auttaa muita asiakkaita tekemään parempia päätöksiä.
            Kerro meille kokemuksestasi!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/testimonials/submit"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              <Plus className="h-5 w-5 mr-2" />
              Kirjoita arvostelu
            </Link>
            <Link
              href="/cars"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
            >
              Selaa autoja
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}