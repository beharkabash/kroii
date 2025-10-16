import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Car, Clock, MapPin, Shield, CheckCircle } from 'lucide-react';
import { TestDriveScheduler } from '../components/features/cars';

export const metadata: Metadata = {
  title: 'Varaa koeajo | Kroi Auto Center',
  description: 'Varaa maksuton koeajo ja koe auto itse. Nopea ja helppo varausjärjestelmä. Varaa koeajo nyt!',
};

export default function TestDrivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Takaisin etusivulle
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                KROI AUTO CENTER
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Varaa koeajo
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Koe auto itse ennen ostopäätöstä. Maksuton koeajo, ammattitaitoinen
            henkilökunta ja turvallinen kokemus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#scheduler"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-lg"
            >
              <Car className="h-6 w-6 mr-2" />
              Varaa koeajo nyt
            </Link>
            <Link
              href="/cars"
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition text-lg"
            >
              Selaa autoja
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Miksi varata koeajo meiltä?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tarjoamme turvallisen ja stressittömän koeajo-kokemuksen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Turvallista</h3>
              <p className="text-slate-700">
                Kaikki autot on tarkastettu ja vakuutettu. Ammattitaitoinen henkilökunta mukana.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Joustavaa</h3>
              <p className="text-slate-700">
                Varaa sopiva aika verkossa. Koeajo kestää 30 minuuttia tai pidempään tarpeen mukaan.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Helppoa</h3>
              <p className="text-slate-700">
                Koeajo liikkeestämme tai tulemme luoksesi. Hoitamme kaikki käytännön järjestelyt.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Ilmaista</h3>
              <p className="text-slate-700">
                Koeajo on täysin maksuton. Ei piilokustannuksia tai yllätyksiä.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scheduler Section */}
      <div id="scheduler" className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestDriveScheduler />
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Näin koeajo toimii
            </h2>
            <p className="text-lg text-slate-600">
              Yksinkertainen 4-vaiheinen prosessi
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Varaa aika</h3>
                <p className="text-slate-700">
                  Täytä varauslomake ja valitse sopiva aika. Saat välittömän vahvistuksen sähköpostitse.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Saavu paikalle</h3>
                <p className="text-slate-700">
                  Tule liikkeeseen sovittuna aikana ajokortti mukana. Esittelemme auton ja käymme turvallisuusasiat läpi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Koe auto</h3>
                <p className="text-slate-700">
                  Aja autoa rauhassa eri olosuhteissa. Myyjämme on mukana vastaamassa kysymyksiin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Tee päätös</h3>
                <p className="text-slate-700">
                  Palaamme liikkeeseen ja keskustelemme kokemuksistasi. Ei paineita - päätös on sinun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Mitä tarvitset koeajoon?
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-green-600">✓ Vaatimukset</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Voimassa oleva ajokortti (vähintään B-luokka)
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Henkilöllisyystodistus
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Vähintään 18 vuoden ikä
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    Ajokortti voimassa ollut vähintään 1 vuoden
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-blue-600">ℹ️ Hyvä tietää</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    Koeajo kestää yleensä 30-45 minuuttia
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    Myyjämme on mukana koeajossa
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    Auto on täysin vakuutettu
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    Voit perua varauksen 24h ennen aikaa
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Valmis varaamaan koeajon?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Aloita varaus nyt ja koe unelmiesi auto. Prosessi on nopea ja vaivaton.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#scheduler"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-lg"
            >
              <Car className="h-6 w-6 mr-2" />
              Varaa koeajo nyt
            </Link>
            <Link
              href="/cars"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition text-lg"
            >
              Selaa autoja ensin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}