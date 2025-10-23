import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WhatsAppChat } from "./components/integrations/chat";
import { SEOGenerator } from "./lib/features/seo-utils";

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
  metadataBase: new URL('https://kroi-auto-center-xnhz.onrender.com'),
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
  // Generate comprehensive structured data
  const autoDealerData = SEOGenerator.generateCarDealerJSONLD();
  const websiteData = SEOGenerator.generateWebsiteJSONLD();
  const localBusinessData = SEOGenerator.generateLocalBusinessJSONLD();

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
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="application-name" content="Kroi Auto Center" />
        <meta name="msapplication-TileColor" content="#9333ea" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
        />
      </head>
      <body className="antialiased">
        <WhatsAppChat />
        {children}
      </body>
    </html>
  );
}
