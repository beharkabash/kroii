import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "./components/Analytics";
import { WebVitals } from "./components/WebVitals";
import { ServiceWorkerRegister } from "./components/ServiceWorkerRegister";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Not critical, load after main font
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Kroi Auto Center - Laadukkaita Käytettyjä Autoja Helsingissä",
  description: "Kroi Auto Center - yli 15 vuoden kokemus autojen myynnistä. Löydä unelmiesi auto Helsingistä. BMW, Skoda, Mercedes, Volkswagen, Audi. Luotettava perheyritys.",
  keywords: "käytetyt autot Helsinki, autokauppa Helsinki, BMW, Skoda, Mercedes, Volkswagen, Audi, Kroi Auto Center, autojen myynti",
  openGraph: {
    title: "Kroi Auto Center - Laadukkaita Käytettyjä Autoja",
    description: "Yli 15 vuoden kokemus autojen myynnistä. Luotettava perheyritys Helsingissä.",
    url: "https://kroiautocenter.fi",
    siteName: "Kroi Auto Center",
    locale: "fi_FI",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "Kroi Auto Center Oy",
    "description": "Laadukkaita käytettyjä autoja Helsingissä. Yli 15 vuoden kokemus autojen myynnistä.",
    "url": "https://kroiautocenter.fi",
    "telephone": "+358413188214",
    "email": "kroiautocenter@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Läkkisepäntie 15 B 300620",
      "addressLocality": "Helsinki",
      "addressCountry": "FI"
    },
    "openingHours": "Mo-Fr 10:00-18:00, Sa 11:00-17:00",
    "sameAs": [
      "https://www.facebook.com/people/Kroi-Auto-Center-Oy/61561550627512/",
      "https://www.instagram.com/kroiautocenteroy"
    ]
  };

  return (
    <html lang="fi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#9333ea" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kroi Auto" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegister />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
