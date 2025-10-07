import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Käyttöehdot | Kroi Auto Center',
  description: 'Kroi Auto Center käyttöehdot ja myyntiehdot.',
};

export default function TermsPage() {
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
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Käyttöehdot ja Myyntiehdot
            </h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 text-lg mb-8">
              Päivitetty: 7.10.2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Yleistä</h2>
              <p className="text-slate-700">
                Nämä käyttöehdot koskevat Kroi Auto Center Oy:n (jäljempänä "yritys")
                verkkosivuston käyttöä sekä yritykseltä tehtäviä ajoneuvon ostoja ja muita palveluita.
                Käyttämällä sivustoa tai asioimalla kanssamme hyväksyt nämä ehdot.
              </p>
              <p className="text-slate-700 mt-4">
                <strong>Kroi Auto Center Oy</strong><br />
                Läkkisepäntie 15 B 300620<br />
                00620 Helsinki<br />
                Y-tunnus: [Y-tunnus]<br />
                Puhelin: +358 41 3188214<br />
                Sähköposti: kroiautocenter@gmail.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Verkkosivuston käyttö</h2>
              <p className="text-slate-700 mb-4">
                Verkkosivustomme tarjoaa tietoa myynnissä olevista ajoneuvoista ja yrityksen palveluista.
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Sivuston sisältö on tarkoitettu henkilökohtaiseen, ei-kaupalliseen käyttöön</li>
                <li>Kaikki oikeudet sivuston sisältöön kuuluvat Kroi Auto Center Oy:lle</li>
                <li>Sivuston sisällön kopioiminen tai levittäminen ilman lupaa on kielletty</li>
                <li>Pidätämme oikeuden muuttaa sivuston sisältöä ilman ennakkoilmoitusta</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Ajoneuvojen myynti</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.1 Hinnat ja saatavuus</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Kaikki hinnat ovat voimassa ilmoitushetkellä ja sisältävät arvonlisäveron (ALV 25,5%)</li>
                <li>Pidätämme oikeuden hinnanmuutoksiin ilman ennakkoilmoitusta</li>
                <li>Ajoneuvot myydään "ensimmäinen maksaa, ensimmäinen omistaa" -periaatteella</li>
                <li>Emme takaa ajoneuvon saatavuutta ennen kaupan vahvistamista</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.2 Varaus ja kauppa</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Ajoneuvo voidaan varata maksamalla varausmaksu (tyypillisesti 500-1000 €)</li>
                <li>Varausmaksu hyvitetään kauppahinnasta</li>
                <li>Varaus on voimassa sovitun ajan (tyypillisesti 3-7 päivää)</li>
                <li>Jos kauppaa ei synny ostajan syystä, varausmaksua ei palauteta</li>
                <li>Kauppa syntyy kauppakirjan allekirjoittamisella ja kauppahinnan maksamisella</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.3 Ajoneuvon luovutus</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Ajoneuvo luovutetaan ostajalle, kun kauppahinta on maksettu kokonaan</li>
                <li>Ostaja vastaa ajoneuvon rekisteröinnistä ja vakuuttamisesta</li>
                <li>Myyjä ilmoittaa kaupasta Liikenne- ja viestintävirastolle</li>
                <li>Omistusoikeus siirtyy ostajalle kauppahinnan maksun yhteydessä</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Ajoneuvon kunto ja takuu</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.1 Ajoneuvon tarkastus</h3>
              <p className="text-slate-700">
                Ostajalla on oikeus ja velvollisuus tarkastaa ajoneuvo ennen kauppaa.
                Suosittelemme ammattimaisen katsastajan käyttöä.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.2 Takuu</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Käytettyihin ajoneuvoihin ei ole lakisääteistä takuuta</li>
                <li>Tarjoamme vaihtoehtoisia takuupaketteja erikseen sovittuna</li>
                <li>Lakisääteiset virhevastuut ovat voimassa kuluttajansuojalain mukaisesti</li>
                <li>Ajoneuvon tunnettuja vikoja ja puutteita on selostettu kauppakirjassa</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.3 Virheet ja reklamaatiot</h3>
              <p className="text-slate-700">
                Jos ajoneuvo on virheellinen, ostajan tulee:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Reklamoida viasta kohtuullisessa ajassa (enintään 2 kuukautta havaitsemisesta)</li>
                <li>Ilmoittaa virheestä kirjallisesti sähköpostitse tai kirjeellä</li>
                <li>Säilyttää ajoneuvo ja sen osat näyttöä varten</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Peruutusoikeus</h2>
              <p className="text-slate-700 mb-4">
                <strong>Huomio kuluttaja-asiakkaille:</strong>
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Käytettyjen ajoneuvojen ostoihin ei sovelleta kuluttajansuojalain mukaista 14 päivän peruutusoikeutta</li>
                <li>Peruutusoikeutta ei ole, kun kauppa tehdään liikkeessä tai paikan päällä</li>
                <li>Kauppa on sitova, kun kauppakirja on allekirjoitettu</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Rahoitus ja vaihtoauto</h2>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">6.1 Rahoitus</h3>
              <p className="text-slate-700">
                Autamme rahoituksen järjestämisessä yhteistyökumppaneidemme kautta. Rahoituspäätös
                tehdään rahoitusyhtiön toimesta, ja niihin sovelletaan rahoitusyhtiön ehtoja.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">6.2 Vaihtoauto</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Otamme vaihtoautoja vastaan kauppahyvityksenä</li>
                <li>Vaihtoauton arvo määritellään kuntonsa ja markkinatilanteen mukaan</li>
                <li>Vaihtoauto tulee olla omistajan nimissä ja veloista vapaa</li>
                <li>Vaihtoauton hinta-arvio on voimassa 7 päivää</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Yhteydenotto ja tietosuoja</h2>
              <p className="text-slate-700">
                Kun otat meihin yhteyttä verkkolomakkeen tai muiden kanavien kautta,
                käsittelemme tietojasi <Link href="/privacy" className="text-purple-600 hover:underline">tietosuojaselosteen</Link> mukaisesti.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Vastuunrajoitukset</h2>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Emme vastaa verkkosivuston mahdollisista teknisistä häiriöistä tai virheistä</li>
                <li>Emme vastaa kolmansien osapuolien linkkien sisällöstä</li>
                <li>Ajoneuvotiedot perustuvat saatavilla oleviin tietoihin, jotka voivat sisältää virheitä</li>
                <li>Kuvat ovat suuntaa-antavia, ja todellinen ajoneuvo voi poiketa kuvista</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Riitojen ratkaisu</h2>
              <p className="text-slate-700">
                Pyrimme ratkaisemaan kaikki erimielisyydet ensisijaisesti neuvottelemalla.
                Kuluttaja-asiakkaat voivat kääntyä myös kuluttajariitalautakunnan puoleen.
              </p>
              <p className="text-slate-700 mt-4">
                <strong>Kuluttajariitalautakunta</strong><br />
                <a href="https://www.kuluttajariita.fi/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  www.kuluttajariita.fi
                </a>
              </p>
              <p className="text-slate-700 mt-4">
                Näihin ehtoihin sovelletaan Suomen lakia. Riidat ratkaistaan Helsingin käräjäoikeudessa.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Ehtojen muutokset</h2>
              <p className="text-slate-700">
                Pidätämme oikeuden muuttaa näitä ehtoja. Muutoksista ilmoitetaan verkkosivustolla.
                Jatkamalla sivuston käyttöä hyväksyt päivitetyt ehdot.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Yhteystiedot</h2>
              <p className="text-slate-700">
                Kysymyksiä käyttöehdoista? Ota yhteyttä:
              </p>
              <p className="text-slate-700 mt-4">
                <strong>Kroi Auto Center Oy</strong><br />
                Sähköposti: <a href="mailto:kroiautocenter@gmail.com" className="text-purple-600 hover:underline">kroiautocenter@gmail.com</a><br />
                Puhelin: <a href="tel:+358413188214" className="text-purple-600 hover:underline">+358 41 3188214</a><br />
                Osoite: Läkkisepäntie 15 B 300620, 00620 Helsinki
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
