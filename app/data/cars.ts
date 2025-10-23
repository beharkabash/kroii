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
    id: 'audi-q5-2-0',
    slug: 'audi-q5-2-0',
    name: 'Audi Q5 2.0',
    brand: 'Audi',
    model: 'Q5',
    price: '€22.400',
    priceEur: 22400,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/audi-q5-2-0.jpeg',
    description: 'Audi Q5 vuodelta 2024.',
    detailedDescription: [
      'Tämä Audi Audi Q5 2.0 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Brake Calipers Silver Painted',
      'Heated And Ventilated Front Seats',
      'Heated Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Silver' },
      { label: 'Vetotapa', value: 'ALL WHEEL DRIVE AWD 4WD' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Suv' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'suv',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/audi-q5-2-0.jpeg',
        altText: 'audi-q5-2-0',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/audi-q5-2-0-1.jpeg',
        altText: 'audi-q5-2-0',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/audi-q5-2-0-2.jpeg',
        altText: 'audi-q5-2-0',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/audi-q5-2-0-3.jpeg',
        altText: 'audi-q5-2-0',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/audi-q5-2-0-4.jpeg',
        altText: 'audi-q5-2-0',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/audi-q5-2-0-5.jpeg',
        altText: 'audi-q5-2-0',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/audi-q5-2-0-6.jpeg',
        altText: 'audi-q5-2-0',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/audi-q5-2-0-7.jpeg',
        altText: 'audi-q5-2-0',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/audi-q5-2-0-8.jpeg',
        altText: 'audi-q5-2-0',
        order: 9,
        isPrimary: false
      },
    ]
  },
  {
    id: 'bmw-x5',
    slug: 'bmw-x5',
    name: 'BMW X5',
    brand: 'Bmw',
    model: 'X5',
    price: '€59.000',
    priceEur: 59000,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/bmw-x5.jpeg',
    description: 'Bmw X5 vuodelta 2024.',
    detailedDescription: [
      'Tämä Bmw BMW X5 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Brake Calipers Silver Painted',
      'Center Console',
      'Heated And Ventilated Front Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Black' },
      { label: 'Vetotapa', value: 'ALL WHEEL DRIVE AWD 4WD' },
      { label: 'Ovet', value: 'N/A' },
      { label: 'Tyyppi', value: 'Suv' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'suv',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/bmw-x5.jpeg',
        altText: 'bmw-x5',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/bmw-x5-1.jpeg',
        altText: 'bmw-x5',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/bmw-x5-2.jpeg',
        altText: 'bmw-x5',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/bmw-x5-3.jpeg',
        altText: 'bmw-x5',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/bmw-x5-4.jpeg',
        altText: 'bmw-x5',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/bmw-x5-5.jpeg',
        altText: 'bmw-x5',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/bmw-x5-6.jpeg',
        altText: 'bmw-x5',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/bmw-x5-7.jpeg',
        altText: 'bmw-x5',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/bmw-x5-8.jpeg',
        altText: 'bmw-x5',
        order: 9,
        isPrimary: false
      },
    ]
  },
  {
    id: 'audi-a4-allroad-2-0',
    slug: 'audi-a4-allroad-2-0',
    name: 'Audi A4 Allroad 2.0',
    brand: 'Audi',
    model: 'A4',
    price: '€21.430',
    priceEur: 21430,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/audi-a4-allroad-2-0.jpeg',
    description: 'Audi A4 vuodelta 2024.',
    detailedDescription: [
      'Tämä Audi Audi A4 Allroad 2.0 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Brake Calipers Silver Painted',
      'Center Console',
      'Heated And Ventilated Front Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Black' },
      { label: 'Vetotapa', value: 'ALL WHEEL DRIVE AWD 4WD' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Compact' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'family',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/audi-a4-allroad-2-0.jpeg',
        altText: 'audi-a4-allroad-2-0',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/audi-a4-allroad-2-0-1.jpeg',
        altText: 'audi-a4-allroad-2-0',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/audi-a4-allroad-2-0-2.jpeg',
        altText: 'audi-a4-allroad-2-0',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/audi-a4-allroad-2-0-3.jpeg',
        altText: 'audi-a4-allroad-2-0',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/audi-a4-allroad-2-0-4.jpeg',
        altText: 'audi-a4-allroad-2-0',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/audi-a4-allroad-2-0-5.jpeg',
        altText: 'audi-a4-allroad-2-0',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/audi-a4-allroad-2-0-6.jpeg',
        altText: 'audi-a4-allroad-2-0',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/audi-a4-allroad-2-0-7.jpeg',
        altText: 'audi-a4-allroad-2-0',
        order: 9,
        isPrimary: false
      },
    ]
  },
  {
    id: 'skoda-octavia-1-6-diesel-automaatti-2020',
    slug: 'skoda-octavia-1-6-diesel-automaatti-2020',
    name: 'Skoda Octavia 1.6 diesel automaatti 2020',
    brand: 'Skoda',
    model: 'Octavia',
    price: '€9.500',
    priceEur: 9500,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/skoda-octavia-1-6-diesel-automaatti-2020.jpeg',
    description: 'Skoda Octavia vuodelta 2024.',
    detailedDescription: [
      'Tämä Skoda Skoda Octavia 1.6 diesel automaatti 2020 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Center Console',
      'Heated And Ventilated Front Seats',
      'Heated Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Gray' },
      { label: 'Vetotapa', value: 'FRONT WHEEL DRIVE' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Sedan' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/skoda-octavia-1-6-diesel-automaatti-2020.jpeg',
        altText: 'skoda-octavia-1-6-diesel-automaatti-2020',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/skoda-octavia-1-6-diesel-automaatti-2020-1.jpeg',
        altText: 'skoda-octavia-1-6-diesel-automaatti-2020',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/skoda-octavia-1-6-diesel-automaatti-2020-2.jpeg',
        altText: 'skoda-octavia-1-6-diesel-automaatti-2020',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/skoda-octavia-1-6-diesel-automaatti-2020-3.jpeg',
        altText: 'skoda-octavia-1-6-diesel-automaatti-2020',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/skoda-octavia-1-6-diesel-automaatti-2020-4.jpeg',
        altText: 'skoda-octavia-1-6-diesel-automaatti-2020',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/skoda-octavia-1-6-diesel-automaatti-2020-5.jpeg',
        altText: 'skoda-octavia-1-6-diesel-automaatti-2020',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/skoda-octavia-1-6-diesel-automaatti-2020-6.jpeg',
        altText: 'skoda-octavia-1-6-diesel-automaatti-2020',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/skoda-octavia-1-6-diesel-automaatti-2020-7.jpeg',
        altText: 'skoda-octavia-1-6-diesel-automaatti-2020',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/skoda-octavia-1-6-diesel-automaatti-2020-8.jpeg',
        altText: 'skoda-octavia-1-6-diesel-automaatti-2020',
        order: 9,
        isPrimary: false
      },
    ]
  },
  {
    id: 'seat-tarraco-2-0',
    slug: 'seat-tarraco-2-0',
    name: 'Seat Tarraco 2.0',
    brand: 'Seat',
    model: 'Tarraco',
    price: '€19.900',
    priceEur: 19900,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/seat-tarraco-2-0.jpeg',
    description: 'Seat Tarraco vuodelta 2024.',
    detailedDescription: [
      'Tämä Seat Seat Tarraco 2.0 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Center Console',
      'Heated And Ventilated Front Seats',
      'Heated Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'White' },
      { label: 'Vetotapa', value: 'ALL WHEEL DRIVE AWD 4WD' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Suv' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'suv',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/seat-tarraco-2-0.jpeg',
        altText: 'seat-tarraco-2-0',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/seat-tarraco-2-0-1.jpeg',
        altText: 'seat-tarraco-2-0',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/seat-tarraco-2-0-2.jpeg',
        altText: 'seat-tarraco-2-0',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/seat-tarraco-2-0-3.jpeg',
        altText: 'seat-tarraco-2-0',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/seat-tarraco-2-0-4.jpeg',
        altText: 'seat-tarraco-2-0',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/seat-tarraco-2-0-5.jpeg',
        altText: 'seat-tarraco-2-0',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/seat-tarraco-2-0-6.jpeg',
        altText: 'seat-tarraco-2-0',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/seat-tarraco-2-0-7.jpeg',
        altText: 'seat-tarraco-2-0',
        order: 9,
        isPrimary: false
      },
      {
        url: '/cars/seat-tarraco-2-0-8.jpeg',
        altText: 'seat-tarraco-2-0',
        order: 10,
        isPrimary: false
      },
      {
        url: '/cars/seat-tarraco-2-0-9.jpeg',
        altText: 'seat-tarraco-2-0',
        order: 11,
        isPrimary: false
      },
    ]
  },
  {
    id: 'vw-passat-1-6',
    slug: 'vw-passat-1-6',
    name: 'VW Passat 1.6',
    brand: 'Volkswagen',
    model: 'Passat',
    price: '€8.000',
    priceEur: 8000,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/vw-passat-1-6.jpeg',
    description: 'Volkswagen Passat vuodelta 2024.',
    detailedDescription: [
      'Tämä Volkswagen VW Passat 1.6 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Anti Lock Braking System',
      'Bluetooth',
      'Brake Assist',
      'Center Console',
      'Heated And Ventilated Front Seats',
      'Heated Seats',
      'Heated Steering Wheel',
      'Tyre Pressure Monitoring System',
      'Windows Electric Front',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Gray' },
      { label: 'Vetotapa', value: 'FRONT WHEEL DRIVE' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Compact' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'family',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/vw-passat-1-6.jpeg',
        altText: 'vw-passat-1-6',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/vw-passat-1-6-1.jpeg',
        altText: 'vw-passat-1-6',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/vw-passat-1-6-2.jpeg',
        altText: 'vw-passat-1-6',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/vw-passat-1-6-3.jpeg',
        altText: 'vw-passat-1-6',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/vw-passat-1-6-4.jpeg',
        altText: 'vw-passat-1-6',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/vw-passat-1-6-5.jpeg',
        altText: 'vw-passat-1-6',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/vw-passat-1-6-6.jpeg',
        altText: 'vw-passat-1-6',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/vw-passat-1-6-7.jpeg',
        altText: 'vw-passat-1-6',
        order: 9,
        isPrimary: false
      },
      {
        url: '/cars/vw-passat-1-6-8.jpeg',
        altText: 'vw-passat-1-6',
        order: 10,
        isPrimary: false
      },
      {
        url: '/cars/vw-passat-1-6-9.jpeg',
        altText: 'vw-passat-1-6',
        order: 11,
        isPrimary: false
      },
      {
        url: '/cars/vw-passat-1-6-10.jpeg',
        altText: 'vw-passat-1-6',
        order: 12,
        isPrimary: false
      },
      {
        url: '/cars/vw-passat-1-6-11.jpeg',
        altText: 'vw-passat-1-6',
        order: 13,
        isPrimary: false
      },
    ]
  },
  {
    id: 'audi-a6',
    slug: 'audi-a6',
    name: 'Audi A6',
    brand: 'Audi',
    model: 'A6',
    price: '€16.800',
    priceEur: 16800,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/audi-a6.jpeg',
    description: 'Audi A6 vuodelta 2024.',
    detailedDescription: [
      'Tämä Audi Audi A6 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Brake Calipers Silver Painted',
      'Center Console',
      'Heated And Ventilated Front Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'White' },
      { label: 'Vetotapa', value: 'FRONT WHEEL DRIVE' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Sedan' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/audi-a6.jpeg',
        altText: 'Audi A6',
        order: 1,
        isPrimary: true
      },
    ]
  },
  {
    id: 'mercedes-benz-e220-amg-paketti',
    slug: 'mercedes-benz-e220-amg-paketti',
    name: 'Mercedes Benz E220 AMG Paketti',
    brand: 'Mercedes Benz',
    model: 'E Class',
    price: '€20.500',
    priceEur: 20500,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/mercedes-benz-e220-amg-paketti.jpeg',
    description: 'Mercedes Benz E Class vuodelta 2024.',
    detailedDescription: [
      'Tämä Mercedes Benz Mercedes Benz E220 AMG Paketti on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Brake Calipers Silver Painted',
      'Center Console',
      'Heated And Ventilated Front Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Silver' },
      { label: 'Vetotapa', value: 'REAR WHEEL DRIVE' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Sedan' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/mercedes-benz-e220-amg-paketti.jpeg',
        altText: 'mercedes-benz-e220-amg-paketti',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/mercedes-benz-e220-amg-paketti-1.jpeg',
        altText: 'mercedes-benz-e220-amg-paketti',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-amg-paketti-2.jpeg',
        altText: 'mercedes-benz-e220-amg-paketti',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-amg-paketti-3.jpeg',
        altText: 'mercedes-benz-e220-amg-paketti',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-amg-paketti-4.jpeg',
        altText: 'mercedes-benz-e220-amg-paketti',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-amg-paketti-5.jpeg',
        altText: 'mercedes-benz-e220-amg-paketti',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-amg-paketti-6.jpeg',
        altText: 'mercedes-benz-e220-amg-paketti',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-amg-paketti-7.jpeg',
        altText: 'mercedes-benz-e220-amg-paketti',
        order: 9,
        isPrimary: false
      },
    ]
  },
  {
    id: 'skoda-superb',
    slug: 'skoda-superb',
    name: 'Skoda SuperB',
    brand: 'Skoda',
    model: 'Superb',
    price: '€14.900',
    priceEur: 14900,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/skoda-superb.jpeg',
    description: 'Skoda Superb vuodelta 2024.',
    detailedDescription: [
      'Tämä Skoda Skoda SuperB on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Brake Calipers Silver Painted',
      'Center Console',
      'Heated And Ventilated Front Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'White' },
      { label: 'Vetotapa', value: 'REAR WHEEL DRIVE' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Sedan' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/skoda-superb.jpeg',
        altText: 'skoda-superb',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/skoda-superb-1.jpeg',
        altText: 'skoda-superb',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-2.jpeg',
        altText: 'skoda-superb',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-3.jpeg',
        altText: 'skoda-superb',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-4.jpeg',
        altText: 'skoda-superb',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-5.jpeg',
        altText: 'skoda-superb',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-6.jpeg',
        altText: 'skoda-superb',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-7.jpeg',
        altText: 'skoda-superb',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-8.jpeg',
        altText: 'skoda-superb',
        order: 9,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-9.jpeg',
        altText: 'skoda-superb',
        order: 10,
        isPrimary: false
      },
    ]
  },
  {
    id: 'mercedes-benz-e220',
    slug: 'mercedes-benz-e220',
    name: 'Mercedes Benz E220',
    brand: 'Mercedes Benz',
    model: 'E Class',
    price: '€23.000',
    priceEur: 23000,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/mercedes-benz-e220.jpeg',
    description: 'Mercedes Benz E Class vuodelta 2024.',
    detailedDescription: [
      'Tämä Mercedes Benz Mercedes Benz E220 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Brake Calipers Silver Painted',
      'Center Console',
      'Heated And Ventilated Front Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Black' },
      { label: 'Vetotapa', value: 'REAR WHEEL DRIVE' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Sedan' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/mercedes-benz-e220.jpeg',
        altText: 'mercedes-benz-e220',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/mercedes-benz-e220-1.jpeg',
        altText: 'mercedes-benz-e220',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-2.jpeg',
        altText: 'mercedes-benz-e220',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-3.jpeg',
        altText: 'mercedes-benz-e220',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-4.jpeg',
        altText: 'mercedes-benz-e220',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-5.jpeg',
        altText: 'mercedes-benz-e220',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-6.jpeg',
        altText: 'mercedes-benz-e220',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-7.jpeg',
        altText: 'mercedes-benz-e220',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-8.jpeg',
        altText: 'mercedes-benz-e220',
        order: 9,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e220-9.jpeg',
        altText: 'mercedes-benz-e220',
        order: 10,
        isPrimary: false
      },
    ]
  },
  {
    id: 'bmw-320',
    slug: 'bmw-320',
    name: 'BMW 320',
    brand: 'Bmw',
    model: '215',
    price: '€23.980',
    priceEur: 23980,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/bmw-320.jpeg',
    description: 'Bmw 215 vuodelta 2024.',
    detailedDescription: [
      'Tämä Bmw BMW 320 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Center Console',
      'Heated And Ventilated Front Seats',
      'Heated Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Gray' },
      { label: 'Vetotapa', value: 'ALL WHEEL DRIVE AWD 4WD' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Sedan' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/bmw-320.jpeg',
        altText: 'bmw-320',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/bmw-320-1.jpeg',
        altText: 'bmw-320',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/bmw-320-2.jpeg',
        altText: 'bmw-320',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/bmw-320-3.jpeg',
        altText: 'bmw-320',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/bmw-320-4.jpeg',
        altText: 'bmw-320',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/bmw-320-5.jpeg',
        altText: 'bmw-320',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/bmw-320-6.jpeg',
        altText: 'bmw-320',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/bmw-320-7.jpeg',
        altText: 'bmw-320',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/bmw-320-8.jpeg',
        altText: 'bmw-320',
        order: 9,
        isPrimary: false
      },
      {
        url: '/cars/bmw-320-9.jpeg',
        altText: 'bmw-320',
        order: 10,
        isPrimary: false
      },
    ]
  },
  {
    id: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
    slug: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
    name: 'Audi A6 Sedan Business Sport 3.0 V6 TDI 160 kW quattro',
    brand: 'Audi',
    model: 'A6',
    price: '€11.000',
    priceEur: 11000,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro.jpeg',
    description: 'Audi A6 vuodelta 2024.',
    detailedDescription: [
      'Tämä Audi Audi A6 Sedan Business Sport 3.0 V6 TDI 160 kW quattro on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Bluetooth',
      'Brake Assist',
      'Heated Seats',
      'Navigation System',
      'Stability Control',
      'Tyre Pressure Monitoring System',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Silver' },
      { label: 'Vetotapa', value: 'ALL WHEEL DRIVE AWD 4WD' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Sedan' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro.jpeg',
        altText: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro-1.jpeg',
        altText: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro-2.jpeg',
        altText: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro-3.jpeg',
        altText: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro-4.jpeg',
        altText: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro-5.jpeg',
        altText: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro-6.jpeg',
        altText: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro-7.jpeg',
        altText: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro-8.jpeg',
        altText: 'audi-a6-sedan-business-sport-3-0-v6-tdi-160-kw-quattro',
        order: 9,
        isPrimary: false
      },
    ]
  },
  {
    id: 'skoda-superb',
    slug: 'skoda-superb',
    name: 'Skoda Superb',
    brand: 'Skoda',
    model: 'Superb',
    price: '€9.900',
    priceEur: 9900,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/skoda-superb.jpeg',
    description: 'Skoda Superb vuodelta 2024.',
    detailedDescription: [
      'Tämä Skoda Skoda Superb on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Heated Seats',
      'Heated Steering Wheel',
      'Navigation System',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Gray' },
      { label: 'Vetotapa', value: 'FRONT WHEEL DRIVE' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Compact' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'family',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/skoda-superb.jpeg',
        altText: 'skoda-superb',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/skoda-superb-1.jpeg',
        altText: 'skoda-superb',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-2.jpeg',
        altText: 'skoda-superb',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-3.jpeg',
        altText: 'skoda-superb',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-4.jpeg',
        altText: 'skoda-superb',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-5.jpeg',
        altText: 'skoda-superb',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-6.jpeg',
        altText: 'skoda-superb',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-7.jpeg',
        altText: 'skoda-superb',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-8.jpeg',
        altText: 'skoda-superb',
        order: 9,
        isPrimary: false
      },
      {
        url: '/cars/skoda-superb-9.jpeg',
        altText: 'skoda-superb',
        order: 10,
        isPrimary: false
      },
    ]
  },
  {
    id: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
    slug: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
    name: 'Audi A6 Avant 40 TDI MHEV quattro S tronic Business Design',
    brand: 'Audi',
    model: 'A6',
    price: '€24.850',
    priceEur: 24850,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design.jpeg',
    description: 'Audi A6 vuodelta 2024.',
    detailedDescription: [
      'Tämä Audi Audi A6 Avant 40 TDI MHEV quattro S tronic Business Design on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Center Console',
      'Heated And Ventilated Front Seats',
      'Heated Seats',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Black' },
      { label: 'Vetotapa', value: 'ALL WHEEL DRIVE AWD 4WD' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Compact' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'family',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design.jpeg',
        altText: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design-1.jpeg',
        altText: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design-2.jpeg',
        altText: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design-3.jpeg',
        altText: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design-4.jpeg',
        altText: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design-5.jpeg',
        altText: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design-6.jpeg',
        altText: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design-7.jpeg',
        altText: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
        order: 9,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design-8.jpeg',
        altText: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
        order: 10,
        isPrimary: false
      },
      {
        url: '/cars/audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design-9.jpeg',
        altText: 'audi-a6-avant-40-tdi-mhev-quattro-s-tronic-business-design',
        order: 11,
        isPrimary: false
      },
    ]
  },
  {
    id: 'audi-a6',
    slug: 'audi-a6',
    name: 'Audi A6',
    brand: 'Audi',
    model: 'A6',
    price: '€16.500',
    priceEur: 16500,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/audi-a6.jpeg',
    description: 'Audi A6 vuodelta 2024.',
    detailedDescription: [
      'Tämä Audi Audi A6 on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Bluetooth',
      'Brake Assist',
      'Heated Seats',
      'Heated Steering Wheel',
      'Navigation System',
      'Stability Control',
      'Tyre Pressure Monitoring System',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'White' },
      { label: 'Vetotapa', value: 'ALL WHEEL DRIVE AWD 4WD' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Sedan' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/audi-a6.jpeg',
        altText: 'Audi A6',
        order: 1,
        isPrimary: true
      },
    ]
  },
  {
    id: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
    slug: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
    name: 'BMW 520 F10 Sedan 520d A xDrive Edition Exclusive',
    brand: 'Bmw',
    model: 'Bmw 520',
    price: '€11.500',
    priceEur: 11500,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive.jpeg',
    description: 'Bmw Bmw 520 vuodelta 2024.',
    detailedDescription: [
      'Tämä Bmw BMW 520 F10 Sedan 520d A xDrive Edition Exclusive on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Bluetooth',
      'Brake Assist',
      'Heated Seats',
      'Heated Steering Wheel',
      'Navigation System',
      'Stability Control',
      'Tyre Pressure Monitoring System',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'Black' },
      { label: 'Vetotapa', value: 'ALL WHEEL DRIVE AWD 4WD' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Sedan' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive.jpeg',
        altText: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive-1.jpeg',
        altText: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive-2.jpeg',
        altText: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive-3.jpeg',
        altText: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive-4.jpeg',
        altText: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive-5.jpeg',
        altText: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive-6.jpeg',
        altText: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive-7.jpeg',
        altText: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive-8.jpeg',
        altText: 'bmw-520-f10-sedan-520d-a-xdrive-edition-exclusive',
        order: 9,
        isPrimary: false
      },
    ]
  },
  {
    id: 'mercedes-benz-e-220d-premium-business',
    slug: 'mercedes-benz-e-220d-premium-business',
    name: 'Mercedes-Benz E 220d Premium Business',
    brand: 'Mercedes Benz',
    model: 'E Class',
    price: '€20.480',
    priceEur: 20480,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/mercedes-benz-e-220d-premium-business.jpeg',
    description: 'Mercedes Benz E Class vuodelta 2024.',
    detailedDescription: [
      'Tämä Mercedes Benz Mercedes-Benz E 220d Premium Business on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Anti Lock Braking System',
      'Apple Carplay Android Auto',
      'Backup Camera',
      'Blind Spot Monitor',
      'Bluetooth',
      'Brake Assist',
      'Center Console',
      'Heated And Ventilated Front Seats',
      'Heated Seats',
      'Heated Steering Wheel',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'White' },
      { label: 'Vetotapa', value: 'REAR WHEEL DRIVE' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Sedan' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'premium',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/mercedes-benz-e-220d-premium-business.jpeg',
        altText: 'mercedes-benz-e-220d-premium-business',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/mercedes-benz-e-220d-premium-business-1.jpeg',
        altText: 'mercedes-benz-e-220d-premium-business',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e-220d-premium-business-2.jpeg',
        altText: 'mercedes-benz-e-220d-premium-business',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e-220d-premium-business-3.jpeg',
        altText: 'mercedes-benz-e-220d-premium-business',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e-220d-premium-business-4.jpeg',
        altText: 'mercedes-benz-e-220d-premium-business',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e-220d-premium-business-5.jpeg',
        altText: 'mercedes-benz-e-220d-premium-business',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e-220d-premium-business-6.jpeg',
        altText: 'mercedes-benz-e-220d-premium-business',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e-220d-premium-business-7.jpeg',
        altText: 'mercedes-benz-e-220d-premium-business',
        order: 8,
        isPrimary: false
      },
      {
        url: '/cars/mercedes-benz-e-220d-premium-business-8.jpeg',
        altText: 'mercedes-benz-e-220d-premium-business',
        order: 9,
        isPrimary: false
      },
    ]
  },
  {
    id: 'volkswagen-golf-allstar',
    slug: 'volkswagen-golf-allstar',
    name: 'Volkswagen Golf Allstar',
    brand: 'Volkswagen',
    model: 'Golf',
    price: '€7.700',
    priceEur: 7700,
    year: '2024',
    fuel: 'Diesel',
    transmission: 'Automatic',
    km: '50.000 km',
    kmNumber: 50000,
    image: '/cars/volkswagen-golf-allstar.jpeg',
    description: 'Volkswagen Golf vuodelta 2024.',
    detailedDescription: [
      'Tämä Volkswagen Volkswagen Golf Allstar on loistava valinta luotettavasta ja mukavasta kulkuneuvosta.',
      'Auto on varustettu Automaticvaihteistolla ja Dieselmoottorilla.',
      'Auto on käyty läpi huolellisesti ja se on valmis uuteen kotiin.',
    ],
    features: [
      'Airbag Driver',
      'Airbag Passenger',
      'Alloy Wheels',
      'Anti Lock Braking System',
      'Bluetooth',
      'Brake Assist',
      'Heated Seats',
      'Navigation System',
      'Stability Control',
      'Tyre Pressure Monitoring System',
    ],
    specifications: [
      { label: 'Vuosimalli', value: '2024' },
      { label: 'Ajetut kilometrit', value: '50.000 km' },
      { label: 'Polttoaine', value: 'Diesel' },
      { label: 'Vaihteisto', value: 'Automatic' },
      { label: 'Väri', value: 'White' },
      { label: 'Vetotapa', value: 'FRONT WHEEL DRIVE' },
      { label: 'Ovet', value: '4 ovea' },
      { label: 'Tyyppi', value: 'Compact' },
    ],
    condition: 'Used kunto. Säännöllisesti huollettu.',
    category: 'family',
    status: 'available',
    featured: false,
    images: [
      {
        url: '/cars/volkswagen-golf-allstar.jpeg',
        altText: 'volkswagen-golf-allstar',
        order: 1,
        isPrimary: true
      },
      {
        url: '/cars/volkswagen-golf-allstar-1.jpeg',
        altText: 'volkswagen-golf-allstar',
        order: 2,
        isPrimary: false
      },
      {
        url: '/cars/volkswagen-golf-allstar-2.jpeg',
        altText: 'volkswagen-golf-allstar',
        order: 3,
        isPrimary: false
      },
      {
        url: '/cars/volkswagen-golf-allstar-3.jpeg',
        altText: 'volkswagen-golf-allstar',
        order: 4,
        isPrimary: false
      },
      {
        url: '/cars/volkswagen-golf-allstar-4.jpeg',
        altText: 'volkswagen-golf-allstar',
        order: 5,
        isPrimary: false
      },
      {
        url: '/cars/volkswagen-golf-allstar-5.jpeg',
        altText: 'volkswagen-golf-allstar',
        order: 6,
        isPrimary: false
      },
      {
        url: '/cars/volkswagen-golf-allstar-6.jpeg',
        altText: 'volkswagen-golf-allstar',
        order: 7,
        isPrimary: false
      },
      {
        url: '/cars/volkswagen-golf-allstar-7.jpeg',
        altText: 'volkswagen-golf-allstar',
        order: 8,
        isPrimary: false
      },
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
