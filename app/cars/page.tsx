import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Car as CarIcon, Search, SlidersHorizontal } from 'lucide-react';
import { getAllCars, convertToLegacyFormat } from '../lib/db/cars';
import Image from 'next/image';
import InventoryAlerts from '../components/InventoryAlerts';

export const metadata: Metadata = {
  title: 'Kaikki Autot | Kroi Auto Center',
  description: 'Selaa kaikkia myynnissä olevia autoja. BMW, Skoda, Mercedes, Volkswagen, Audi. Laadukkaita käytettyjä autoja Helsingissä.',
};

export const dynamic = 'force-dynamic';

export default async function AllCarsPage() {
  let cars: ReturnType<typeof convertToLegacyFormat>[] = [];

  try {
    if (process.env.DATABASE_URL) {
      const { cars: dbCars } = await getAllCars({}, { limit: 100, sortBy: 'createdAt', sortOrder: 'desc' });
      cars = dbCars.map(convertToLegacyFormat);
    }
  } catch (error) {
    console.warn('Database not available, using empty car list:', error);
    cars = [];
  }

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
                <CarIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                KROI AUTO CENTER
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Kaikki Autot
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Selaa koko valikoimaamme. Meillä on {cars.length} laadukasta käytettyä autoa.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Hae merkin, mallin tai ominaisuuden mukaan..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-medium">
              <SlidersHorizontal className="h-5 w-5" />
              Suodattimet
            </button>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cars.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CarIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Ei autoja saatavilla
            </h2>
            <p className="text-slate-600">
              Autoja ei ole tällä hetkellä myynnissä. Tarkista myöhemmin uudelleen!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {cars.length} autoa myynnissä
              </h2>
              <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                <option value="newest">Uusimmat ensin</option>
                <option value="price-low">Halvin ensin</option>
                <option value="price-high">Kallein ensin</option>
                <option value="mileage-low">Vähiten kilometrejä</option>
                <option value="year-new">Uusin vuosimalli</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.slug}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={car.image || '/placeholder-car.jpg'}
                      alt={car.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-purple-600">
                        {car.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition">
                      {car.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {car.description}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 block">Vuosi</span>
                        <span className="font-semibold text-slate-900">{car.year}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Mittarilukema</span>
                        <span className="font-semibold text-slate-900">{car.km}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Polttoaine</span>
                        <span className="font-semibold text-slate-900">{car.fuel}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-purple-600 font-medium group-hover:underline">
                        Katso lisätietoja →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Etkö löytänyt sopivaa autoa?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Kerro meille mitä etsit, niin autamme sinua löytämään täydellisen auton!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InventoryAlerts className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition" />
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
            >
              Ota yhteyttä
            </Link>
            <a
              href="tel:+358413188214"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
            >
              Soita meille
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
