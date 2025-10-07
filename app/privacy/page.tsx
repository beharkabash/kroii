import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tietosuojaseloste | Kroi Auto Center',
  description: 'Kroi Auto Center tietosuojaseloste. Lue, miten käsittelemme henkilötietojasi.',
};

export default function PrivacyPolicyPage() {
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
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Tietosuojaseloste
            </h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 text-lg mb-8">
              Päivitetty: 7.10.2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Rekisterinpitäjä</h2>
              <p className="text-slate-700">
                <strong>Kroi Auto Center Oy</strong><br />
                Läkkisepäntie 15 B 300620<br />
                00620 Helsinki<br />
                Y-tunnus: [Y-tunnus]<br />
                Puhelin: +358 41 3188214<br />
                Sähköposti: kroiautocenter@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Rekisterin nimi</h2>
              <p className="text-slate-700">
                Kroi Auto Center asiakasrekisteri ja yhteydenottolomakkeen tietorekisteri.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Henkilötietojen käsittelyn tarkoitus</h2>
              <p className="text-slate-700 mb-4">
                Käsittelemme henkilötietoja seuraaviin tarkoituksiin:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Asiakassuhteiden hoitaminen ja ylläpito</li>
                <li>Yhteydenottojen käsittely ja vastaaminen</li>
                <li>Autokaupan ja niihin liittyvien palveluiden tarjoaminen</li>
                <li>Markkinointi ja uutiskirjeet (suostumuksen perusteella)</li>
                <li>Asiakastyytyväisyyden kehittäminen</li>
                <li>Lakisääteisten velvoitteiden täyttäminen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Rekisterin sisältö</h2>
              <p className="text-slate-700 mb-4">
                Rekisteriin tallennettavia tietoja voivat olla:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Nimi</li>
                <li>Yhteystiedot (sähköposti, puhelinnumero, osoite)</li>
                <li>Kiinnostuksen kohteet (ajoneuvot)</li>
                <li>Asiakasviestintä ja yhteydenottopyynnöt</li>
                <li>Ostotapahtumat ja niiden tiedot</li>
                <li>Verkkosivuston käyttötiedot (evästeiden kautta)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Säännönmukaiset tietolähteet</h2>
              <p className="text-slate-700">
                Henkilötiedot kerätään:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Verkkosivuston yhteydenottolomakkeista</li>
                <li>Sähköpostitse, puhelimitse tai henkilökohtaisesti saadut tiedot</li>
                <li>Asiakkaan itse antamat tiedot autokauppaa tehtäessä</li>
                <li>Julkisista rekistereistä (esim. kaupparekisteri, ajoneuvohallinnon rekisteri)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Tietojen luovutus ja siirto</h2>
              <p className="text-slate-700 mb-4">
                Emme myy, vuokraa tai luovuta henkilötietojasi kolmansille osapuolille ilman suostumustasi, paitsi:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Lain edellyttämissä tilanteissa viranomaisille</li>
                <li>Palveluntarjoajille, jotka toimivat meidän lukuumme (esim. IT-palvelut, isännöinti)</li>
                <li>Rahoitus- ja vakuutusyhtiöille autokaupan yhteydessä (suostumuksella)</li>
              </ul>
              <p className="text-slate-700 mt-4">
                Käytämme EU:n sisällä sijaitsevia palveluntarjoajia. Jos tietoja siirretään EU:n ulkopuolelle,
                varmistamme, että siirto tapahtuu GDPR:n mukaisesti.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Tietojen säilytysaika</h2>
              <p className="text-slate-700">
                Säilytämme henkilötietoja vain niin kauan kuin se on tarpeellista käsittelyn tarkoitusten
                toteuttamiseksi tai lakisääteisten velvoitteiden täyttämiseksi. Tyypillisesti:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Yhteydenottolomakkeiden tiedot: 2 vuotta</li>
                <li>Asiakastiedot: Asiakassuhteen ajan + 2 vuotta</li>
                <li>Kauppakirjat ja sopimukset: Kirjanpitolain mukaisesti (6 vuotta)</li>
                <li>Markkinointilupa: Kunnes lupa peruutetaan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Tietoturva</h2>
              <p className="text-slate-700 mb-4">
                Suojaamme henkilötietoja asiattomalta pääsyltä, muuttamiselta ja hävittämiseltä
                seuraavilla toimenpiteillä:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>SSL-suojattu verkkosivusto (HTTPS)</li>
                <li>Tietokannat suojatuilla palvelimilla</li>
                <li>Rajoitettu pääsy henkilötietoihin (vain valtuutettu henkilöstö)</li>
                <li>Säännölliset varmuuskopiot</li>
                <li>Henkilökunnan tietosuojakoulutus</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Rekisteröidyn oikeudet</h2>
              <p className="text-slate-700 mb-4">
                Sinulla on seuraavat oikeudet henkilötietojesi käsittelyyn liittyen:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong>Oikeus tarkastaa tietosi:</strong> Voit pyytää tietoa siitä, mitä henkilötietoja sinusta on tallennettu</li>
                <li><strong>Oikeus oikaista tietoja:</strong> Voit pyytää virheellisten tietojen korjaamista</li>
                <li><strong>Oikeus poistaa tiedot:</strong> Voit pyytää tietojesi poistamista ("oikeus tulla unohdetuksi")</li>
                <li><strong>Oikeus rajoittaa käsittelyä:</strong> Voit pyytää tietojesi käsittelyn rajoittamista</li>
                <li><strong>Vastustamisoikeus:</strong> Voit vastustaa tietojesi käsittelyä markkinointitarkoituksiin</li>
                <li><strong>Oikeus siirtää tiedot:</strong> Voit pyytää tietojesi siirtämistä toiselle palveluntarjoajalle</li>
              </ul>
              <p className="text-slate-700 mt-4">
                Käytä oikeuksiasi ottamalla yhteyttä: <a href="mailto:kroiautocenter@gmail.com" className="text-purple-600 hover:underline">kroiautocenter@gmail.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Evästeet (Cookies)</h2>
              <p className="text-slate-700">
                Verkkosivustomme käyttää evästeitä käyttökokemuksen parantamiseksi ja analytiikkaan.
                Lue lisää <Link href="/cookies" className="text-purple-600 hover:underline">evästekäytännöstämme</Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Muutokset tietosuojaselosteeseen</h2>
              <p className="text-slate-700">
                Pidätämme oikeuden päivittää tätä tietosuojaselostetta. Merkittävistä muutoksista
                ilmoitamme verkkosivustollamme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Yhteydenotot</h2>
              <p className="text-slate-700">
                Jos sinulla on kysyttävää tietosuojasta tai haluat käyttää oikeuksiasi, ota yhteyttä:
              </p>
              <p className="text-slate-700 mt-4">
                <strong>Kroi Auto Center Oy</strong><br />
                Sähköposti: <a href="mailto:kroiautocenter@gmail.com" className="text-purple-600 hover:underline">kroiautocenter@gmail.com</a><br />
                Puhelin: <a href="tel:+358413188214" className="text-purple-600 hover:underline">+358 41 3188214</a>
              </p>
              <p className="text-slate-700 mt-4">
                Voit tehdä valituksen myös <a href="https://tietosuoja.fi/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  tietosuojavaltuutetulle
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
