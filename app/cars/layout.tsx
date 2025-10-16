import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kaikki Autot | Kroi Auto Center',
  description: 'Selaa kaikkia myynnissä olevia autoja. BMW, Skoda, Mercedes, Volkswagen, Audi. Laadukkaita käytettyjä autoja Helsingissä.',
  keywords: ['käytetyt autot', 'auto kauppa Helsinki', 'BMW', 'Skoda', 'Mercedes', 'Volkswagen', 'Audi', 'autoliike'],
  openGraph: {
    title: 'Kaikki Autot - KROI AUTO CENTER',
    description: 'Selaa kaikkia myynnissä olevia autoja. Laadukkaita käytettyjä autoja Helsingissä.',
    url: 'https://kroiautocenter.fi/cars',
    siteName: 'KROI AUTO CENTER',
    images: [
      {
        url: 'https://kroiautocenter.fi/og-cars.jpg',
        width: 1200,
        height: 630,
        alt: 'KROI AUTO CENTER - Käytetyt autot',
      },
    ],
    locale: 'fi_FI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaikki Autot - KROI AUTO CENTER',
    description: 'Selaa kaikkia myynnissä olevia autoja. Laadukkaita käytettyjä autoja Helsingissä.',
    images: ['https://kroiautocenter.fi/og-cars.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://kroiautocenter.fi/cars',
  },
};

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}