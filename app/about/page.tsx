import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, Heart, Award, Target, TrendingUp, Shield, Handshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Meistä | Kroi Auto Center',
  description: 'Kroi Auto Center - Yli 15 vuoden kokemus autojen myynnistä. Luotettava perheyritys Helsingissä. Lue lisää meistä.',
};

export default function AboutPage() {
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
                <Users className="h-5 w-5 text-white" />
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
            Meistä
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Yli 15 vuoden kokemus autojen myynnistä. Perheyritys, joka arvostaa
            asiakkaitaan ja tarjoaa henkilökohtaista palvelua.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Tarinaamme</h2>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Kroi Auto Center perustettiin intohimosta autoja ja halusta tarjota asiakkaillemme
                parasta mahdollista palvelua. Olemme perheyritys, joka ymmärtää, että auton ostaminen
                on iso päätös ja investointi.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Yli 15 vuoden kokemuksella olemme auttaneet satoja asiakkaita löytämään täydellisen
                auton heidän tarpeisiinsa. Uskomme rehellisyyteen, läpinäkyvyyteen ja henkilökohtaiseen
                palveluun - jokaisella asiakkaalla on ainutlaatuiset tarpeet, ja me kuuntelemme.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                Erikoisalueemme ovat laadukkaat käytetyt autot merkityistä valmistajista kuten BMW,
                Mercedes-Benz, Skoda, Volkswagen ja Audi. Jokainen myymämme auto on huolellisesti
                tarkastettu ja valmisteltu uuteen kotiin.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Arvomme</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Luotettavuus</h3>
              </div>
              <p className="text-slate-700">
                Rehellisyys ja läpinäkyvyys kaikessa tekemisessämme. Kerromme auton todellisen
                kunnon ja historian ilman kaunistelemista.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-pink-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Asiakaslähtöisyys</h3>
              </div>
              <p className="text-slate-700">
                Jokainen asiakas on meille tärkeä. Autamme sinua löytämään juuri sinun tarpeisiisi
                sopivan auton - ei vain myymme autoa.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Laatu</h3>
              </div>
              <p className="text-slate-700">
                Myymme vain tarkastettuja ja laadukkaita autoja. Jokainen auto käy läpi
                perusteellisen tarkastuksen ennen myyntiä.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-pink-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Handshake className="h-5 w-5 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Pitkäaikaiset suhteet</h3>
              </div>
              <p className="text-slate-700">
                Asiakassuhde ei pääty kaupantekoon. Olemme täällä myös kaupan jälkeen,
                jos tarvitset apua tai neuvoja.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Miksi valita meidät?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Yli 15 vuoden kokemus</h3>
                  <p className="text-slate-700 text-sm">
                    Pitkä kokemus autokaupasta ja asiakaspalvelusta
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Henkilökohtainen palvelu</h3>
                  <p className="text-slate-700 text-sm">
                    Aikaa ja huomiota jokaiselle asiakkaalle
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Laadukkaat autot</h3>
                  <p className="text-slate-700 text-sm">
                    Kaikki autot huolellisesti tarkastettu
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Monikielinen palvelu</h3>
                  <p className="text-slate-700 text-sm">
                    Palvelemme suomeksi, ruotsiksi ja englanniksi
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Rahoitusapu</h3>
                  <p className="text-slate-700 text-sm">
                    Autamme rahoituksen järjestämisessä
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Vaihtoautot</h3>
                  <p className="text-slate-700 text-sm">
                    Otamme vaihtoautoja kauppahyvityksenä
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 md:p-12 text-white text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Haluatko tietää lisää?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Olemme täällä auttamassa sinua. Ota yhteyttä ja kerro tarpeistasi!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              Ota yhteyttä
            </Link>
            <Link
              href="/cars"
              className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition"
            >
              Selaa autoja
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
