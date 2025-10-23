// Copy this entire file to your Sanity Studio project
// Location: schemas/car.ts or schemas/car.js

export default {
  name: 'car',
  title: 'Autot / Cars',
  type: 'document',
  icon: () => '🚗',
  fields: [
    {
      name: 'name',
      title: 'Auton nimi (esim. BMW 318)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL-osoite (slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'brand',
      title: 'Merkki (BMW, Audi, jne.)',
      type: 'string',
      options: {
        list: [
          { title: 'BMW', value: 'BMW' },
          { title: 'Audi', value: 'Audi' },
          { title: 'Mercedes-Benz', value: 'Mercedes-Benz' },
          { title: 'Volkswagen', value: 'Volkswagen' },
          { title: 'Toyota', value: 'Toyota' },
          { title: 'Tesla', value: 'Tesla' },
          { title: 'Volvo', value: 'Volvo' },
          { title: 'Ford', value: 'Ford' },
          { title: 'Hyundai', value: 'Hyundai' },
          { title: 'Kia', value: 'Kia' },
          { title: 'Mazda', value: 'Mazda' },
          { title: 'Nissan', value: 'Nissan' },
          { title: 'Peugeot', value: 'Peugeot' },
          { title: 'Renault', value: 'Renault' },
          { title: 'Skoda', value: 'Skoda' },
          { title: 'Muu', value: 'Other' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'model',
      title: 'Malli (318, A4, jne.)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Vuosimalli',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'priceEur',
      title: 'Hinta (€)',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'price',
      title: 'Hinta (muotoiltu, esim. €14,100)',
      type: 'string',
      description: 'Täytetään automaattisesti hinta-kentän perusteella',
      readOnly: true,
      initialValue: (doc: any) => {
        if (doc.priceEur) {
          return `€${doc.priceEur.toLocaleString('fi-FI')}`;
        }
        return '';
      },
    },
    {
      name: 'kmNumber',
      title: 'Kilometrit (numero)',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'km',
      title: 'Kilometrit (muotoiltu)',
      type: 'string',
      description: 'Täytetään automaattisesti',
      readOnly: true,
    },
    {
      name: 'fuel',
      title: 'Polttoaine',
      type: 'string',
      options: {
        list: [
          { title: 'Bensiini', value: 'Bensiini' },
          { title: 'Diesel', value: 'Diesel' },
          { title: 'Hybridi', value: 'Hybridi' },
          { title: 'Sähkö', value: 'Sähkö' },
          { title: 'Kaasu', value: 'Kaasu' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'transmission',
      title: 'Vaihteisto',
      type: 'string',
      options: {
        list: [
          { title: 'Automaatti', value: 'Automatic' },
          { title: 'Manuaali', value: 'Manual' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Kategoria',
      type: 'string',
      options: {
        list: [
          { title: 'Sedan', value: 'Sedan' },
          { title: 'SUV', value: 'SUV' },
          { title: 'Hatchback', value: 'Hatchback' },
          { title: 'Coupe', value: 'Coupe' },
          { title: 'Wagon', value: 'Wagon' },
          { title: 'Van', value: 'Van' },
          { title: 'Truck', value: 'Truck' },
          { title: 'Convertible', value: 'Convertible' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'mainImage',
      title: 'Pääkuva',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'gallery',
      title: 'Kuvagalleria',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'description',
      title: 'Lyhyt kuvaus',
      type: 'text',
      rows: 3,
      validation: (Rule: any) => Rule.required().max(200),
    },
    {
      name: 'detailedDescription',
      title: 'Yksityiskohtainen kuvaus',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'features',
      title: 'Ominaisuudet',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Listaa auton ominaisuudet (esim. Ilmastointi, Nahkapenkit)',
    },
    {
      name: 'specifications',
      title: 'Tekniset tiedot',
      type: 'object',
      fields: [
        { name: 'engine', title: 'Moottori', type: 'string' },
        { name: 'power', title: 'Teho (hv)', type: 'string' },
        { name: 'torque', title: 'Vääntö (Nm)', type: 'string' },
        { name: 'acceleration', title: '0-100 km/h (s)', type: 'string' },
        { name: 'topSpeed', title: 'Huippunopeus (km/h)', type: 'string' },
        { name: 'fuelConsumption', title: 'Kulutus (l/100km)', type: 'string' },
        { name: 'co2Emissions', title: 'CO2-päästöt (g/km)', type: 'string' },
        { name: 'drive', title: 'Vetotapa', type: 'string' },
        { name: 'seats', title: 'Istuinpaikkoja', type: 'number' },
        { name: 'doors', title: 'Ovia', type: 'number' },
        { name: 'color', title: 'Väri', type: 'string' },
        { name: 'interiorColor', title: 'Sisustuksen väri', type: 'string' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'mainImage',
    },
  },
};
