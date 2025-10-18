import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CreditCard, CheckCircle, Calculator, FileText, Users, Shield } from 'lucide-react';
import LazyFinancingCalculator from '../components/ui/LazyFinancingCalculator';

export const metadata: Metadata = {
  title: 'Autorahoitus | Kroi Auto Center',
  description: 'Tarvitsetko rahoitusta autoostokseen? Tarjoamme kilpailukykistä autorahoitusta joustavilla ehdoilla. Laske kuukausierä ja hae rahoitusta.',
};

export default function FinancingPage() {
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
                <CreditCard className="h-5 w-5 text-white" />
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
            Autorahoitus
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            Tee unelma-autostasi totta joustavalla rahoituksella.
            Tarjoamme kilpailukykistä autorahoitusta helposti ja nopeasti.
          </p>
          <Link
            href="/financing/apply"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition text-lg"
          >
            <FileText className="h-6 w-6 mr-2" />
            Hae rahoitusta
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Miksi valita meidän rahoituksemme?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tarjoamme asiakkaillemme parhaat mahdolliset rahoitusehdot ja henkilökohtaista palvelua.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Nopea käsittely</h3>
              <p className="text-slate-700">
                Saat rahoituspäätöksen 1-2 arkipäivän kuluessa. Ei pitkiä jonottamisia tai monimutkaisia prosesseja.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Kilpailukykyiset korot</h3>
              <p className="text-slate-700">
                Etsimme sinulle parhaat mahdolliset rahoitusehdot yhteistyökumppaneitamme hyödyntäen.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Henkilökohtainen palvelu</h3>
              <p className="text-slate-700">
                Kokenut tiimimme auttaa sinua löytämään sopivimman rahoitusratkaisun tilanteeseesi.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Turvallinen prosessi</h3>
              <p className="text-slate-700">
                Kaikki hakemukset käsitellään luottamuksellisesti ja turvallisesti. Tietojasi ei luovuteta kolmansille osapuolille.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Joustava laina-aika</h3>
              <p className="text-slate-700">
                Voit valita laina-ajan 1-7 vuotta. Räätälöimme maksuohjelman sopimaan taloudelliseen tilanteeseesi.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Matala käsiraha</h3>
              <p className="text-slate-700">
                Aloita jo pienellä käsirahalla. Voit rahoittaa jopa 90% auton hinnasta luottotiedoistasi riippuen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Näin rahoitushakemus etenee
            </h2>
            <p className="text-lg text-slate-600">
              Yksinkertainen 4-vaiheinen prosessi unelma-autosi hankkimiseen
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Täytä hakemus</h3>
                <p className="text-slate-700">
                  Täytä rahoitushakemus verkkosivuillamme. Tarvitset vain perustiedot itsestäsi ja taloudellisesta tilanteestasi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Käsittely ja arviointi</h3>
                <p className="text-slate-700">
                  Käsittelemme hakemuksesi 1-2 arkipäivän kuluessa. Tarkistamme luottotietosi ja arvioimme rahoitusmahdollisuudet.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Rahoitustarjous</h3>
                <p className="text-slate-700">
                  Saat henkilökohtaisen rahoitustarjouksen korko- ja maksuehtoineen. Käymme tarjouksen läpi kanssasi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 h-12 w-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sopimusten allekirjoitus</h3>
                <p className="text-slate-700">
                  Kun olet tyytyväinen tarjoukseen, allekirjoitamme sopimukset ja voit hakea autosi. Yksinkertaista!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financing Calculator */}
      <LazyFinancingCalculator variant="inline" className="py-16 bg-white" />

      {/* Required Documents Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Tarvittavat dokumentit
            </h2>
            <p className="text-lg text-slate-600">
              Valmistele nämä dokumentit rahoitushakemusta varten
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Henkilötiedot</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Henkilötodistus tai ajokortti
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Luottotiedot (voimme hakea puolestasi)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Tulotiedot</h3>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Palkkaselvitys tai työtodistus
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Viimeisimmät verotiedot
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Tiliotteet (2-3 kuukautta)
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Huom:</strong> Kaikki dokumentit voidaan toimittaa sähköisesti. Autamme sinua tarvittavien
                dokumenttien hankkimisessa ja ohjaamme prosessin läpi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Valmis hakemaan rahoitusta?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Aloita rahoitushakemus nyt ja saat henkilökohtaisen tarjouksen 1-2 arkipäivän kuluessa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/financing/apply"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition text-lg"
            >
              <FileText className="h-6 w-6 mr-2" />
              Hae rahoitusta
            </Link>
            <Link
              href="/cars"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition text-lg"
            >
              Selaa autoja
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}