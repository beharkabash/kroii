export interface Car {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  price: string;
  priceEur: number;
  year: string;
  fuel: string;
  transmission: string;
  km: string;
  kmNumber: number;
  image: string;
  description: string;
  detailedDescription: string[];
  features: string[];
  specifications: {
    label: string;
    value: string;
  }[];
  condition: string;
  category: string;
  status: string;
  featured: boolean;
  images: {
    url: string;
    altText: string;
    order: number;
    isPrimary: boolean;
  }[];
}

export const cars: Car[] = [
  {
    id: 'bmw-318-2017',
    slug: 'bmw-318-2017',
    name: 'BMW 318',
    brand: 'BMW',
    model: '318',
    price: '€14,100',
    priceEur: 14100,
    year: '2017',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '235,000 km',
    kmNumber: 235000,
    image: '/cars/OrderTitle-5.webp',
    description: 'Erinomainen BMW 318 vuodelta 2017 automaattivaihteistolla ja dieselkäyttöisellä moottorilla.',
    detailedDescription: [
      'Tämä BMW 318 vuodelta 2017 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta. Auto on varustettu automaattivaihteistolla, joka tekee ajamisesta sujuvaa ja miellyttävää kaikissa olosuhteissa.',
      'Dieselmoottori tarjoaa erinomaisen polttoainetalouden ja pitkän toimintasäteen. Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
      'BMW:n tunnettu laatu ja ajomukavuus yhdistyvät tässä autossa. Täydellinen valinta sekä kaupunkiajoon että pitkille matkoille.'
    ],
    features: [
      'Automaattivaihteisto',
      'Ilmastointi',
      'Sähköikkunat',
      'Peruutuskamera',
      'Bluetooth-yhteys',
      'Multifunktioratti',
      'Lohkolämmitin',
      'Sisäpistorasialla',
      'ABS-jarrut',
      'Vakautusvalvonta (ESP)',
      'Turvatyynyt',
      'LED-ajovalot'
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2017' },
      { label: 'Ajetut kilometrit', value: '235,000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automaatti' },
      { label: 'Väri', value: 'Harmaa' },
      { label: 'Vetotapa', value: 'Takavetävä' },
      { label: 'Omaisuus', value: 'Puhdas' },
      { label: 'Seuraava katsastus', value: 'Tarkistettu' }
    ],
    condition: 'Hyvä kunto, säännöllisesti huollettu. Katsastettu ja valmis toimitukseen.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/OrderTitle-5.webp',
        altText: 'BMW 318 2017',
        order: 1,
        isPrimary: true
      }
    ]
  },
  {
    id: 'skoda-octavia-tdi-2018',
    slug: 'skoda-octavia-tdi-2018',
    name: 'Skoda Octavia 2.0 TDI',
    brand: 'Skoda',
    model: 'Octavia 2.0 TDI',
    price: '€14,000',
    priceEur: 14000,
    year: '2018',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '235,000 km',
    kmNumber: 235000,
    image: '/cars/OrderTitle3.webp',
    description: 'Tilava ja luotettava Skoda Octavia 2.0 TDI automaattivaihteistolla.',
    detailedDescription: [
      'Skoda Octavia 2.0 TDI on tunnettu luotettavuudestaan ja tilavuudestaan. Tämä malli vuodelta 2018 tarjoaa erinomaisen yhdistelmän mukavuutta ja taloudellisuutta.',
      'Automaattivaihteisto tekee ajamisesta vaivatonta, ja voimakas dieselmoottori takaa riittävän tehon kaikissa tilanteissa. Octavia on täydellinen perheen tai työkäyttöön.',
      'Auto on huollettu säännöllisesti ja kaikki huollot on tehty valtuutetussa huollossa. Tämä on todella turvallinen valinta käytetylle autolle.'
    ],
    features: [
      'Automaattivaihteisto',
      'Dual-zone ilmastointi',
      'Navigointijärjestelmä',
      'Peruutuskamera ja -tutkat',
      'Bluetooth ja USB',
      'Isofix-kiinnikkeet',
      'Cruise control',
      'Lämmitettävät etuistuimet',
      'Sähkötoimiset ikkunat ja peilit',
      'ABS ja ESP',
      'Monimuotoinen turvatyynyjärjestelmä',
      'Valoautomatiikka'
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2018' },
      { label: 'Ajetut kilometrit', value: '235,000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automaatti' },
      { label: 'Moottori', value: '2.0 TDI' },
      { label: 'Väri', value: 'Sininen' },
      { label: 'Vetotapa', value: 'Etuvetävä' },
      { label: 'Omaisuus', value: 'Puhdas' }
    ],
    condition: 'Erinomainen kunto. Säännöllisesti huollettu, huoltokirja tallella.',
    category: 'family',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/OrderTitle3.webp',
        altText: 'Skoda Octavia 2.0 TDI 2018',
        order: 1,
        isPrimary: true
      }
    ]
  },
  {
    id: 'skoda-octavia-combi-2015',
    slug: 'skoda-octavia-combi-2015',
    name: 'Skoda Octavia Combi',
    brand: 'Skoda',
    model: 'Octavia Combi',
    price: '€7,500',
    priceEur: 7500,
    year: '2015',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '276,000 km',
    kmNumber: 276000,
    image: '/cars/OrderTitle2.webp',
    description: 'Käytännöllinen farmari-malli suurella tavaratilalla ja automaattivaihteistolla.',
    detailedDescription: [
      'Skoda Octavia Combi tarjoaa poikkeuksellisen suuren tavaratilan ja erinomaisen ajomukavuuden. Tämä on täydellinen auto perheille tai niille, jotka tarvitsevat tilaa tavaroille.',
      'Vuoden 2015 malli on varustettu luotettavalla dieselmoottorilla ja automaattivaihteistolla. Huolimatta korkeammasta kilometrimäärästä, auto on huollettu säännöllisesti ja on erinomaisessa kunnossa.',
      'Combissa on kaikki tarvittavat mukavuudet ja turvallisuusvarusteet. Tämä on todella hintalaatusuhteeltaan erinomainen vaihtoehto.'
    ],
    features: [
      'Automaattivaihteisto',
      'Ilmastointi',
      'Cruise control',
      'Bluetooth-yhteys',
      'Peruutustutkat',
      'Sähköikkunat',
      'Lohkolämmitin',
      'Valtava tavaratila',
      'Jaettava takaistuin',
      'ABS-jarrut',
      'Vakautusvalvonta',
      'Turvatyynyt'
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2015' },
      { label: 'Ajetut kilometrit', value: '276,000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automaatti' },
      { label: 'Väri', value: 'Valkoinen' },
      { label: 'Vetotapa', value: 'Etuvetävä' },
      { label: 'Tavaratila', value: '610 litraa' },
      { label: 'Omaisuus', value: 'Puhdas' }
    ],
    condition: 'Hyvä kunto ikään ja kilometreihin nähden. Säännöllisesti huollettu.',
    category: 'family',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/OrderTitle1.webp',
        altText: 'Skoda Octavia Combi 2015',
        order: 1,
        isPrimary: true
      }
    ]
  },
  {
    id: 'skoda-superb-4x4-2018',
    slug: 'skoda-superb-4x4-2018',
    name: 'Skoda Superb 2.0 TDI Style 4x4',
    brand: 'Skoda',
    model: 'Superb 2.0 TDI Style 4x4',
    price: '€20,000',
    priceEur: 20000,
    year: '2018',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '230,000 km',
    kmNumber: 230000,
    image: '/cars/OrderTitle1-1.webp',
    description: 'Premium-luokan Skoda Superb nelivedolla ja täysvarusteilla.',
    detailedDescription: [
      'Skoda Superb 2.0 TDI Style 4x4 on Skodan lippulaivamalli, joka tarjoaa luksusauton tason mukavuutta ja varustusta. Tämä vuoden 2018 malli on varustettu nelivetoisella järjestelmällä, joka takaa erinomaisen pidon kaikissa olosuhteissa.',
      'Voimakas 2.0 TDI dieselmoottori ja automaattivaihteisto takaavat sujuvan ajokokemuksen. Style-varustetaso sisältää kaikki mahdolliset mukavuudet, kuten nahkaverhoilun, navigoinnin, ja huippuluokan äänijärjestelmän.',
      'Auto on täysin huollettu ja valmiina toimitukseen. Tämä on poikkeuksellinen tilaisuus hankkia premium-luokan auto edullisesti.'
    ],
    features: [
      'Neliveto (4x4)',
      'Automaattivaihteisto',
      'Nahkaverhoilu',
      'Dual-zone ilmastointi',
      'Navigointijärjestelmä',
      'Peruutuskamera ja 360° näkymä',
      'Adaptiivinen vakionopeudensäädin',
      'Lämmitettävät etu- ja takaistunnot',
      'Panoraama-kattoluukku',
      'LED-ajovalot',
      'Keyless-järjestelmä',
      'Sähkötoiminen takaluukku',
      'Premium äänijärjestelmä',
      'Kaistavahti',
      'Perävaununvakain'
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2018' },
      { label: 'Ajetut kilometrit', value: '230,000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automaatti' },
      { label: 'Moottori', value: '2.0 TDI' },
      { label: 'Väri', value: 'Musta' },
      { label: 'Vetotapa', value: 'Neliveto (4x4)' },
      { label: 'Varustetaso', value: 'Style' },
      { label: 'Omaisuus', value: 'Puhdas' }
    ],
    condition: 'Erinomainen kunto. Täysi huoltohistoria. Premium-tason auto.',
    category: 'premium',
    status: 'available',
    featured: true,
    images: [
      {
        url: '/cars/OrderTitle2.webp',
        altText: 'Skoda Superb 2.0 TDI Style 4x4 2018',
        order: 1,
        isPrimary: true
      }
    ]
  },
  {
    id: 'skoda-karoq-tdi-2019',
    slug: 'skoda-karoq-tdi-2019',
    name: 'Skoda Karoq 1.6 TDI',
    brand: 'Skoda',
    model: 'Karoq 1.6 TDI',
    price: '€14,900',
    priceEur: 14900,
    year: '2019',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '235,000 km',
    kmNumber: 235000,
    image: '/cars/OrderTitle1.webp',
    description: 'Moderni kompakti SUV täydellä varustuksella ja automaattivaihteistolla.',
    detailedDescription: [
      'Skoda Karoq on täydellinen kaupunki-SUV, joka yhdistää maastoauton käytännöllisyyden ja henkilöauton ajettavuuden. Tämä vuoden 2019 malli on varustettu taloudellisella 1.6 TDI moottorilla.',
      'Automaattivaihteisto ja korkea maavara tekevät Karoqista erinomaisen valinnan Suomen olosuhteisiin. Auto on tilava ja mukava, ja siinä on kaikki modernit turvallisuusvarusteet.',
      'Karoq on täydellinen perheen ensimmäiseksi SUV:ksi tai vaikkapa aktiiviselle pariskunnalle. Luotettava ja turvallinen valinta.'
    ],
    features: [
      'Automaattivaihteisto',
      'Dual-zone ilmastointi',
      'Navigointijärjestelmä',
      'Peruutuskamera ja -tutkat',
      'LED-ajovalot',
      'Cruise control',
      'Apple CarPlay ja Android Auto',
      'Lämmitettävät etuistuimet',
      'Sähkötoiminen takaluukku',
      'Kaistavahti',
      'Kaupunkijarru',
      'Korkea maavara',
      'Panoraama-kattoluukku'
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2019' },
      { label: 'Ajetut kilometrit', value: '235,000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automaatti' },
      { label: 'Moottori', value: '1.6 TDI' },
      { label: 'Väri', value: 'Hopea' },
      { label: 'Vetotapa', value: 'Etuvetävä' },
      { label: 'Tyyppi', value: 'Kompakti SUV' },
      { label: 'Omaisuus', value: 'Puhdas' }
    ],
    condition: 'Erinomainen kunto. Säännöllisesti huollettu ja valmis toimitukseen.',
    category: 'suv',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/OrderTitle-5.webp',
        altText: 'Skoda Karoq 1.6 TDI 2019',
        order: 1,
        isPrimary: true
      }
    ]
  },
  {
    id: 'mercedes-e220d-2017',
    slug: 'mercedes-e220d-2017',
    name: 'Mercedes-Benz E220 d A',
    brand: 'Mercedes-Benz',
    model: 'E220 d A',
    price: '€14,000',
    priceEur: 14000,
    year: '2017',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '281,000 km',
    kmNumber: 281000,
    image: '/cars/OrderTitle-1-2.webp',
    description: 'Luksus-sedan Mercedes-Benz E-sarjasta automaattivaihteistolla.',
    detailedDescription: [
      'Mercedes-Benz E220 d edustaa aidosti premium-luokan ajoneuvoa. Tämä vuoden 2017 malli tarjoaa huippuluokan mukavuuden, turvallisuuden ja ajodynamiikan.',
      'E-sarjan tunnettu laatu ja kestävyys tekevät tästä autosta erinomaisen sijoituksen. Automaattivaihteisto on pehmeä ja responsiivinen, ja dieselmoottori tarjoaa erinomaisen yhdistelmän tehoa ja taloudellisuutta.',
      'Auto on huollettu valtuutetussa Mercedes-huollossa ja kaikki huollot on dokumentoitu. Tämä on oiva tilaisuus hankkia premium-merkki edullisesti.'
    ],
    features: [
      'Automaattivaihteisto',
      'Nahkaverhoilu',
      'Dual-zone ilmastointi',
      'Navigointijärjestelmä',
      'Peruutuskamera',
      'LED-ajovalot',
      'Adaptiivinen vakionopeudensäädin',
      'Lämmitettävät ja tuuletettavat istuimet',
      'Panoraama-kattoluukku',
      'Burmester-äänijärjestelmä',
      'Keyless-go',
      'Sähkötoiminen takaluukku',
      'Kaistavahti',
      'Aktiivinen jarruavustin',
      'Airmatic-ilmajousitus'
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2017' },
      { label: 'Ajetut kilometrit', value: '281,000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automaatti (9-vaihteinen)' },
      { label: 'Moottori', value: 'E220 d' },
      { label: 'Väri', value: 'Musta' },
      { label: 'Vetotapa', value: 'Takavetävä' },
      { label: 'Tyyppi', value: 'Sedan' },
      { label: 'Omaisuus', value: 'Puhdas' }
    ],
    condition: 'Hyvä kunto. Valtuutettu huoltohistoria. Premium-merkki.',
    category: 'premium',
    status: 'available',
    featured: true,
    images: [
      {
        url: '/cars/OrderTitle6.webp',
        altText: 'Mercedes-Benz E220 d A 2017',
        order: 1,
        isPrimary: true
      }
    ]
  },
  {
    id: 'volkswagen-troc-2019',
    slug: 'volkswagen-troc-2019',
    name: 'Volkswagen T-Roc',
    brand: 'Volkswagen',
    model: 'T-Roc',
    price: '€18,500',
    priceEur: 18500,
    year: '2019',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '178,000 km',
    kmNumber: 178000,
    image: '/cars/OrderTitle-2-3.webp',
    description: 'Tyylikäs kompakti-SUV Volkswagenilta modernilla muotoilulla.',
    detailedDescription: [
      'Volkswagen T-Roc on yksi markkinoiden suosituimmista kompakti-SUV:ista. Sen trendikäs muotoilu ja erinomainen ajettavuus tekevät siitä suositun valinnan kaiken ikäisten keskuudessa.',
      'Tämä vuoden 2019 malli on varustettu taloudellisella dieselmoottorilla ja sujuvalla automaattivaihteistolla. T-Roc on täydellinen yhdistelmä tyylikkyyttä, käytännöllisyyttä ja ajomukavuutta.',
      'Auto on huollettu säännöllisesti ja se on erinomaisessa kunnossa. Täydellinen valinta ensimmäiseksi SUV:ksi tai vaikka nuorekkaan perheenisän autoksi.'
    ],
    features: [
      'Automaattivaihteisto',
      'Ilmastointi',
      'Navigointijärjestelmä',
      'Peruutuskamera ja -tutkat',
      'LED-ajovalot',
      'Cruise control',
      'Apple CarPlay ja Android Auto',
      'Lämmitettävät etuistuimet',
      'Sähköikkunat ja peilit',
      'Multifunktioratti',
      'Bluetooth-yhteys',
      'USB-liitännät',
      'Sporttistuimet'
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2019' },
      { label: 'Ajetut kilometrit', value: '178,000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automaatti (7-vaihteinen DSG)' },
      { label: 'Väri', value: 'Punainen' },
      { label: 'Vetotapa', value: 'Etuvetävä' },
      { label: 'Tyyppi', value: 'Kompakti SUV' },
      { label: 'Omaisuus', value: 'Puhdas' }
    ],
    condition: 'Erinomainen kunto. Säännöllisesti huollettu. Siisti ja hyvin pidetty.',
    category: 'suv',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/OrderTitle-7-3.webp',
        altText: 'Volkswagen T-Roc 2019',
        order: 1,
        isPrimary: true
      }
    ]
  },
  {
    id: 'volkswagen-tiguan-2020',
    slug: 'volkswagen-tiguan-2020',
    name: 'Volkswagen Tiguan',
    brand: 'Volkswagen',
    model: 'Tiguan',
    price: '€31,000',
    priceEur: 31000,
    year: '2020',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '67,000 km',
    kmNumber: 67000,
    image: '/cars/OrderTitle-7-3.webp',
    description: 'Lähes uusi Volkswagen Tiguan matalalla kilometrimäärällä.',
    detailedDescription: [
      'Tämä Volkswagen Tiguan vuodelta 2020 on poikkeuksellisen hyvin säilynyt ja matalalla kilometrimäärällä varustettu SUV. Vain 67 000 kilometriä ajettu auto on käytännössä kuin uusi.',
      'Tiguan on Volkswagenin suosituin SUV-malli tunnetusta laadusta ja turvallisuudesta. Tämä malli on varustettu kattavasti ja sisältää kaikki nykyaikaiset turvallisuus- ja mukavuusvarusteet.',
      'Täydellinen valinta perheelle tai kenelle tahansa, joka arvostaa laatua, turvallisuutta ja luotettavuutta. Auto on käytännössä kuin uusi ja valmis pitkälle käyttöiälle.'
    ],
    features: [
      'Automaattivaihteisto (DSG)',
      'Dual-zone ilmastointi',
      'Navigointijärjestelmä',
      'Peruutuskamera ja 360° näkymä',
      'LED-ajovalot ja Matrix-tekniikka',
      'Adaptiivinen vakionopeudensäädin',
      'Apple CarPlay ja Android Auto',
      'Lämmitettävät ja tuuletettavat istuimet',
      'Panoraama-kattoluukku',
      'Sähkötoiminen takaluukku',
      'Keyless-järjestelmä',
      'Kaistavahti',
      'Kaupunkijarru',
      'Park Assist',
      'Digital Cockpit'
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2020' },
      { label: 'Ajetut kilometrit', value: '67,000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automaatti (7-vaihteinen DSG)' },
      { label: 'Väri', value: 'Sininen' },
      { label: 'Vetotapa', value: 'Neliveto (4Motion)' },
      { label: 'Tyyppi', value: 'SUV' },
      { label: 'Varustetaso', value: 'Highline' },
      { label: 'Omaisuus', value: 'Puhdas' }
    ],
    condition: 'Lähes uudenveroisessa kunnossa. Täysi huoltohistoria. Takuu voimassa.',
    category: 'suv',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/OrderTitle1.webp',
        altText: 'Volkswagen Tiguan 2020',
        order: 1,
        isPrimary: true
      }
    ]
  },
  {
    id: 'audi-q3-tdi-2018',
    slug: 'audi-q3-tdi-2018',
    name: 'Audi Q3 2.0 TDI',
    brand: 'Audi',
    model: 'Q3 2.0 TDI',
    price: '€27,250',
    priceEur: 27250,
    year: '2018',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '125,000 km',
    kmNumber: 125000,
    image: '/cars/OrderTitle-3-1.webp',
    description: 'Premium kompakti-SUV Audilta nelivedolla ja täysvarusteilla.',
    detailedDescription: [
      'Audi Q3 2.0 TDI on Audin suosittu kompakti-SUV, joka yhdistää premium-auton laadun, urheilullisen ajettavuuden ja käytännöllisyyden. Tämä vuoden 2018 malli on varustettu voimakkaalla 2.0 TDI dieselmoottorilla.',
      'Quattro-neliveto takaa erinomaisen pidon kaikissa olosuhteissa. Auto on varustettu kattavasti ja sisältää kaikki Audin uusimmat teknologiat ja turvallisuusvarusteet.',
      'Tämä Q3 on täydellisessä kunnossa ja valmis uuteen kotiin. Matala kilometrimäärä ja täysi huoltohistoria tekevät tästä erinomaisen valinnan.'
    ],
    features: [
      'Quattro-neliveto',
      'Automaattivaihteisto (S-tronic)',
      'Nahka-alcantara verhoilu',
      'Dual-zone ilmastointi',
      'MMI-navigointijärjestelmä',
      'Peruutuskamera ja -tutkat',
      'LED-ajovalot',
      'Adaptiivinen vakionopeudensäädin',
      'Lämmitettävät etuistuimet',
      'Panoraama-kattoluukku',
      'Audi Virtual Cockpit',
      'Bang & Olufsen -äänijärjestelmä',
      'Keyless-järjestelmä',
      'Sähkötoiminen takaluukku',
      'Sporttistuimet',
      'S-line ulko- ja sisustus'
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2018' },
      { label: 'Ajetut kilometrit', value: '125,000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automaatti (S-tronic)' },
      { label: 'Moottori', value: '2.0 TDI' },
      { label: 'Väri', value: 'Valkoinen' },
      { label: 'Vetotapa', value: 'Neliveto (Quattro)' },
      { label: 'Tyyppi', value: 'Kompakti SUV' },
      { label: 'Varustetaso', value: 'S-line' },
      { label: 'Omaisuus', value: 'Puhdas' }
    ],
    condition: 'Erinomainen kunto. Valtuutettu huoltohistoria. Premium-tason auto.',
    category: 'premium',
    status: 'available',
    featured: true,
    images: [
      {
        url: '/cars/OrderTitle2.webp',
        altText: 'Audi Q3 2.0 TDI 2018',
        order: 1,
        isPrimary: true
      }
    ]
  }
];

export function getCarById(id: string): Car | undefined {
  return cars.find(car => car.id === id || car.slug === id);
}

export function getCarsByBrand(brand: string): Car[] {
  return cars.filter(car => car.brand.toLowerCase() === brand.toLowerCase());
}

export function getCarsByCategory(category: string): Car[] {
  return cars.filter(car => car.category === category);
}

export function getRelatedCars(currentCarId: string, limit: number = 3): Car[] {
  const currentCar = getCarById(currentCarId);
  if (!currentCar) return [];

  // Get cars from same brand first
  let related = getCarsByBrand(currentCar.brand).filter(car => car.id !== currentCarId);

  // If not enough, add cars from same category
  if (related.length < limit) {
    const categoryMatches = getCarsByCategory(currentCar.category)
      .filter(car => car.id !== currentCarId && !related.find(r => r.id === car.id));
    related = [...related, ...categoryMatches];
  }

  // If still not enough, add any other cars
  if (related.length < limit) {
    const others = cars
      .filter(car => car.id !== currentCarId && !related.find(r => r.id === car.id));
    related = [...related, ...others];
  }

  return related.slice(0, limit);
}