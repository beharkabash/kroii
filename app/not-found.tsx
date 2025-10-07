import Link from 'next/link';
import { Home, Search, Car, ArrowLeft, MessageCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-[150px] md:text-[200px] font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent leading-none">
              404
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="h-24 w-24 md:h-32 md:w-32 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <Car className="h-12 w-12 md:h-16 md:w-16 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Sivua ei löytynyt
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          Oops! Etsimäsi sivu on kadonnut tien päällä. Se on ehkä ajanut jo pois,
          tai sitten se ei koskaan ollutkaan olemassa.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            Palaa etusivulle
          </Link>
          <Link
            href="/cars"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            <Search className="h-5 w-5" />
            Selaa autoja
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Ehkä etsit jotain näistä?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/cars"
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-slate-50 transition text-left group"
            >
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                <Car className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 group-hover:text-purple-600 transition">
                  Kaikki autot
                </div>
                <div className="text-sm text-slate-600">
                  Selaa valikoimaamme
                </div>
              </div>
            </Link>

            <Link
              href="/about"
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-slate-50 transition text-left group"
            >
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                <Home className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 group-hover:text-purple-600 transition">
                  Meistä
                </div>
                <div className="text-sm text-slate-600">
                  Tutustu yritykseemme
                </div>
              </div>
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-slate-50 transition text-left group"
            >
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 group-hover:text-purple-600 transition">
                  Ota yhteyttä
                </div>
                <div className="text-sm text-slate-600">
                  Autamme sinua
                </div>
              </div>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-slate-50 transition text-left group"
            >
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                <ArrowLeft className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 group-hover:text-purple-600 transition">
                  Etusivu
                </div>
                <div className="text-sm text-slate-600">
                  Aloita alusta
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-slate-500 mt-8">
          Jos uskot, että tämä on virhe, ota yhteyttä:{' '}
          <a href="mailto:kroiautocenter@gmail.com" className="text-purple-600 hover:underline">
            kroiautocenter@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}