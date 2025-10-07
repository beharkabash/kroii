import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Evästekäytäntö | Kroi Auto Center',
  description: 'Kroi Auto Center evästekäytäntö. Lue, miten käytämme evästeitä verkkosivustollamme.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Takaisin etusivulle
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
              <Cookie className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Evästekäytäntö
            </h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 text-lg mb-8">
              Päivitetty: 7.10.2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Mikä on eväste?</h2>
              <p className="text-slate-700">
                Evästeet (cookies) ovat pieniä tekstitiedostoja, jotka tallennetaan laitteellesi
                (tietokone, tabletti, älypuhelin) kun vierailet verkkosivustollamme. Evästeet auttavat
                meitä tarjoamaan paremman käyttökokemuksen ja analysoimaan sivuston käyttöä.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Miten käytämme evästeitä?</h2>
              <p className="text-slate-700 mb-4">
                Käytämme evästeitä seuraaviin tarkoituksiin:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Sivuston toiminnallisuuden varmistamiseen</li>
                <li>Käyttökokemuksen parantamiseen</li>
                <li>Sivuston käytön analysointiin</li>
                <li>Käyttäjien mieltymysten muistamiseen</li>
                <li>Markkinoinnin ja mainonnan kohdentamiseen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Evästeluokat</h2>

              <div className="bg-slate-50 border-l-4 border-purple-600 p-6 mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 Välttämättömät evästeet</h3>
                <p className="text-slate-700 mb-4">
                  <strong>Tarkoitus:</strong> Nämä evästeet ovat välttämättömiä sivuston toiminnalle.
                  Ilman niitä sivusto ei toimi oikein.
                </p>
                <p className="text-slate-700 mb-4">
                  <strong>Esimerkkejä:</strong>
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-1">
                  <li>Istunnon hallinta</li>
                  <li>Turvalli suus ja autentikointi</li>
                  <li>Ostoskorin toiminnot</li>
                </ul>
                <p className="text-slate-700 mt-4">
                  <strong>Suostumus:</strong> Ei vaadita (teknisesti välttämättömät)
                </p>
              </div>

              <div className="bg-slate-50 border-l-4 border-blue-600 p-6 mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Toiminnalliset evästeet</h3>
                <p className="text-slate-700 mb-4">
                  <strong>Tarkoitus:</strong> Parantavat käyttökokemusta muistamalla käyttäjän valintoja.
                </p>
                <p className="text-slate-700 mb-4">
                  <strong>Esimerkkejä:</strong>
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-1">
                  <li>Kielivalinta</li>
                  <li>Fonttikoko ja muut asetukset</li>
                  <li>Lomakkeiden täyttöapu</li>
                </ul>
                <p className="text-slate-700 mt-4">
                  <strong>Suostumus:</strong> Vaaditaan
                </p>
              </div>

              <div className="bg-slate-50 border-l-4 border-green-600 p-6 mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">3.3 Analytiikkaevästeet</h3>
                <p className="text-slate-700 mb-4">
                  <strong>Tarkoitus:</strong> Keräävät tietoa sivuston käytöstä auttaaksemme meitä
                  parantamaan sivustoa.
                </p>
                <p className="text-slate-700 mb-4">
                  <strong>Käytämme:</strong>
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-1">
                  <li>Google Analytics (kävijäseuranta)</li>
                  <li>Vercel Analytics (suorituskykymittaukset)</li>
                </ul>
                <p className="text-slate-700 mt-4">
                  <strong>Suostumus:</strong> Vaaditaan
                </p>
              </div>

              <div className="bg-slate-50 border-l-4 border-orange-600 p-6 mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">3.4 Markkinointievästeet</h3>
                <p className="text-slate-700 mb-4">
                  <strong>Tarkoitus:</strong> Seuraavat käyttäytymistä verkkosivuilla mainonnan
                  kohdentamiseksi.
                </p>
                <p className="text-slate-700 mb-4">
                  <strong>Käytämme:</strong>
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-1">
                  <li>Facebook Pixel (sosiaalisen median mainonta)</li>
                  <li>Google Ads (hakukonemainonta)</li>
                </ul>
                <p className="text-slate-700 mt-4">
                  <strong>Suostumus:</strong> Vaaditaan
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Evästeiden käyttöaika</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Istuntoevästeet</h3>
              <p className="text-slate-700">
                Poistuvat, kun suljet selaimen. Käytämme niitä istunnon hallintaan ja turvallisuuteen.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Pysyvät evästeet</h3>
              <p className="text-slate-700">
                Säilyvät laitteellasi määrätyn ajan (yleensä 1-24 kuukautta). Käytämme niitä
                mieltymysten muistamiseen ja analytiikkaan.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Kolmannen osapuolen evästeet</h2>
              <p className="text-slate-700 mb-4">
                Käytämme seuraavia kolmannen osapuolen palveluita, jotka voivat asettaa evästeitä:
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 my-6">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Palvelu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tarkoitus</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tietosuoja</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">Google Analytics</td>
                      <td className="px-6 py-4 text-sm text-slate-700">Kävijäseuranta</td>
                      <td className="px-6 py-4 text-sm">
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          Lue lisää
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">Vercel</td>
                      <td className="px-6 py-4 text-sm text-slate-700">Palvelun toiminta</td>
                      <td className="px-6 py-4 text-sm">
                        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          Lue lisää
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-900">Facebook</td>
                      <td className="px-6 py-4 text-sm text-slate-700">Sosiaalinen media</td>
                      <td className="px-6 py-4 text-sm">
                        <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                          Lue lisää
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Evästeiden hallinta</h2>
              <p className="text-slate-700 mb-4">
                Voit hallita evästeitä useilla tavoilla:
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Evästeasetukset sivustolla</h3>
              <p className="text-slate-700">
                Voit muuttaa evästeasetuksiasi milloin tahansa klikkaamalla &quot;Evästeasetukset&quot; -painiketta
                sivuston alareunassa.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Selaimen asetukset</h3>
              <p className="text-slate-700 mb-4">
                Useimmat selaimet sallivat evästeiden hallinnan. Voit:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Estää kaikki evästeet</li>
                <li>Hyväksyä vain tietyt evästeet</li>
                <li>Poistaa olemassa olevat evästeet</li>
                <li>Asettaa selaimen varoittamaan ennen evästeen asettamista</li>
              </ul>

              <p className="text-slate-700 mt-4 mb-4">
                <strong>Ohjeet eri selaimille:</strong>
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/fi/kb/evasteet-tiedot-joita-sivustot-tallentavat" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/fi-fi/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/fi-fi/microsoft-edge/evasteet-microsoft-edgessa-tietojen-poistaminen-niiden-salliminen-ja-hallinta-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                    Microsoft Edge
                  </a>
                </li>
              </ul>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mt-6">
                <p className="text-amber-900">
                  <strong>Huomio:</strong> Jos estät evästeet, osa sivuston toiminnoista ei välttämättä toimi oikein.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Muutokset evästekäytäntöön</h2>
              <p className="text-slate-700">
                Voimme päivittää tätä evästekäytäntöä aika ajoin. Suosittelemme tarkistamaan tämän
                sivun säännöllisesti päivitysten varalta. Merkittävistä muutoksista ilmoitamme sivustollamme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Lisätietoja</h2>
              <p className="text-slate-700 mb-4">
                Lisätietoja henkilötietojen käsittelystä löydät <Link href="/privacy" className="text-purple-600 hover:underline">tietosuojaselosteestamme</Link>.
              </p>
              <p className="text-slate-700">
                Jos sinulla on kysyttävää evästeistä, ota yhteyttä:
              </p>
              <p className="text-slate-700 mt-4">
                <strong>Kroi Auto Center Oy</strong><br />
                Sähköposti: <a href="mailto:kroiautocenter@gmail.com" className="text-purple-600 hover:underline">kroiautocenter@gmail.com</a><br />
                Puhelin: <a href="tel:+358413188214" className="text-purple-600 hover:underline">+358 41 3188214</a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
