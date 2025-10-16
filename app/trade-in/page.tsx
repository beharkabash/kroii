import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Car, CheckCircle, Clock, Euro, FileText, Zap } from 'lucide-react';
import { TradeInEstimator } from '../components/features/trade-in';

export const metadata: Metadata = {
  title: 'Vaihtoauton arviointi | Kroi Auto Center',
  description: 'Saat välittömän arvion vaihtoautosi arvosta. Ostamme autoja käteisellä ja hoidamme kaikki paperityöt. Pyydä ilmainen arvio!',
};

export default function TradeInPage() {
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
            Myy autosi meille
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Saat reilun hinnan autostasi nopeasti ja helposti. Hoidamme kaikki paperityöt
            ja maksamme käteisellä.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#calculator"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-lg"
            >
              <Car className="h-6 w-6 mr-2" />
              Laske arvio
            </Link>
            <Link
              href="/trade-in/valuation"
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition text-lg"
            >
              <FileText className="h-6 w-6 mr-2" />
              Pyydä tarkka arvio
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Miksi myydä autosi meille?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tarjoamme reilun hinnan ja helpon prosessin. Ei stressiä, ei piilokustannuksia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Euro className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Reilu hinta</h3>
              <p className="text-slate-700">
                Maksamme markkinahintaa vastaavan summan autostasi. Ei alihinnoittelua.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Nopea prosessi</h3>
              <p className="text-slate-700">
                Voit saada rahasi samana päivänä. Ei viikkojen odottelua.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Hoidamme paperityöt</h3>
              <p className="text-slate-700">
                Omistajuuden siirto, vakuutukset ja muut muodollisuudet hoituvat meiltä.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Luotettava toimija</h3>
              <p className="text-slate-700">
                Yli 15 vuoden kokemus autokaupasta. Tuhannet tyytyväiset asiakkaat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <div id="calculator">
        <TradeInEstimator className="py-16 bg-slate-50" />
      </div>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Näin autosi myynti toimii
            </h2>
            <p className="text-lg text-slate-600">
              Yksinkertainen 4-vaiheinen prosessi autosi myymiseen
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Saat alustavan arvion</h3>
                <p className="text-slate-700">
                  Käytä arvioijaamme tai pyydä tarkempi arvio lomakkeella. Saat alustavan hinnan välittömästi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sovimme tapaamisen</h3>
                <p className="text-slate-700">
                  Otamme sinuun yhteyttä ja sovimme auton tarkastuksesta. Voimme tulla luoksesi tai tapaamme liikkeessämme.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Tarkastamme auton</h3>
                <p className="text-slate-700">
                  Käymme auton läpi ja annamme lopullisen tarjouksen. Kaikki avoimesti ja rehellisesti.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Kaupat ja maksu</h3>
                <p className="text-slate-700">
                  Jos hinta sopii, teemme kaupat saman tien. Maksamme käteisellä ja hoidamme paperityöt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Buy Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Mitä autoja ostamme?
            </h2>
            <p className="text-lg text-slate-600">
              Ostamme lähes kaikki automerkit ja -mallit
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-green-600">✓ Ostamme</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Premium-merkit (BMW, Mercedes, Audi)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Suositut merkit (Volkswagen, Toyota, Honda)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Sähköautot ja hybridit
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Korkealaatuiset käytetyt autot
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Hyväkuntoiset autot (vuosimallit 2010+)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-amber-600">⚠ Tapauskohtaisesti</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    Vanhat autot (alle vuosi 2010)
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    Korkeamittareiset autot (yli 300 000 km)
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    Kolarivaurioituneet autot
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    Harvinaiset merkit ja mallit
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Huom:</strong> Vaikka autosi ei olisi &quot;suosittujen&quot; joukossa, kannattaa aina kysyä!
                Meillä on laaja verkosto ja löydämme useimmille autoille ostajan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Valmis myymään autosi?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Aloita arvioinnilla ja saat tarjouksen autostasi. Prosessi on nopea ja vaivaton.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#calculator"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-lg"
            >
              <Car className="h-6 w-6 mr-2" />
              Laske arvio nyt
            </Link>
            <Link
              href="/trade-in/valuation"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition text-lg"
            >
              <FileText className="h-6 w-6 mr-2" />
              Pyydä tarkka arvio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}