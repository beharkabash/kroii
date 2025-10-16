import { Metadata } from 'next';

export interface CarSEOData {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  description?: string;
  images: string[];
  slug: string;
}

export interface BlogPostSEOData {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  tags?: string[];
  image?: string;
  slug: string;
}

export class SEOGenerator {
  private static baseUrl = 'https://kroiautocenter.fi';

  static generateCarJSONLD(car: CarSEOData) {
    return {
      "@context": "https://schema.org",
      "@type": "Car",
      "name": `${car.make} ${car.model} ${car.year}`,
      "description": car.description || `${car.make} ${car.model} ${car.year} - ${car.mileage.toLocaleString('fi-FI')} km`,
      "brand": {
        "@type": "Brand",
        "name": car.make
      },
      "model": car.model,
      "vehicleModelDate": car.year.toString(),
      "mileageFromOdometer": {
        "@type": "QuantitativeValue",
        "value": car.mileage,
        "unitCode": "KMT"
      },
      "fuelType": car.fuelType,
      "vehicleTransmission": car.transmission,
      "offers": {
        "@type": "Offer",
        "price": car.price,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "AutoDealer",
          "name": "Kroi Auto Center Oy",
          "telephone": "+358413188214",
          "email": "kroiautocenter@gmail.com"
        }
      },
      "image": car.images.map(img => `${this.baseUrl}${img}`),
      "url": `${this.baseUrl}/cars/${car.slug}`,
      "vehicleCondition": "https://schema.org/UsedCondition"
    };
  }

  static generateCarMetadata(car: CarSEOData): Metadata {
    const title = `${car.make} ${car.model} ${car.year} - ${car.price.toLocaleString('fi-FI')}€ | Kroi Auto Center`;
    const description = `${car.make} ${car.model} ${car.year}, ${car.mileage.toLocaleString('fi-FI')} km, ${car.fuelType}, ${car.transmission}. Hinta ${car.price.toLocaleString('fi-FI')}€. Laadukkaita käytettyjä autoja Helsingissä.`;
    const imageUrl = car.images[0] ? `${this.baseUrl}${car.images[0]}` : `${this.baseUrl}/og-car-default.jpg`;

    return {
      title,
      description,
      keywords: `${car.make}, ${car.model}, ${car.year}, käytetty auto, autokauppa Helsinki, ${car.fuelType}, ${car.transmission}`,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${this.baseUrl}/cars/${car.slug}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${car.make} ${car.model} ${car.year}`,
          }
        ],
        siteName: 'Kroi Auto Center',
        locale: 'fi_FI',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      robots: {
        index: true,
        follow: true,
      }
    };
  }

  static generateBlogPostJSONLD(post: BlogPostSEOData) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "image": post.image ? `${this.baseUrl}${post.image}` : `${this.baseUrl}/og-blog-default.jpg`,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Kroi Auto Center",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/icon-512.png`
        }
      },
      "datePublished": post.publishedTime,
      "dateModified": post.modifiedTime || post.publishedTime,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.baseUrl}/blog/${post.slug}`
      },
      "keywords": post.tags?.join(', ') || 'autot, käytetyt autot, autokauppa',
      "articleSection": "Automotive"
    };
  }

  static generateBreadcrumbJSONLD(items: Array<{ name: string; url: string }>) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${this.baseUrl}${item.url}`
      }))
    };
  }

  static generateCarDealerJSONLD() {
    return {
      "@context": "https://schema.org",
      "@type": "AutoDealer",
      "name": "Kroi Auto Center Oy",
      "description": "Laadukkaita käytettyjä autoja Helsingissä. Yli 15 vuoden kokemus autojen myynnistä.",
      "url": this.baseUrl,
      "telephone": "+358413188214",
      "email": "kroiautocenter@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Läkkisepäntie 15 B 300620",
        "addressLocality": "Helsinki",
        "addressCountry": "FI"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 60.1699,
        "longitude": 24.9384
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "10:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "11:00",
          "closes": "17:00"
        }
      ],
      "sameAs": [
        "https://www.facebook.com/people/Kroi-Auto-Center-Oy/61561550627512/",
        "https://www.instagram.com/kroiautocenteroy"
      ],
      "priceRange": "€€",
      "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
      "areaServed": {
        "@type": "City",
        "name": "Helsinki"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Käytetyt Autot",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "BMW"
          },
          {
            "@type": "OfferCatalog",
            "name": "Mercedes-Benz"
          },
          {
            "@type": "OfferCatalog",
            "name": "Volkswagen"
          },
          {
            "@type": "OfferCatalog",
            "name": "Audi"
          },
          {
            "@type": "OfferCatalog",
            "name": "Skoda"
          }
        ]
      }
    };
  }

  static generateLocalBusinessJSONLD() {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Kroi Auto Center",
      "image": `${this.baseUrl}/og-default.jpg`,
      "telephone": "+358413188214",
      "email": "kroiautocenter@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Läkkisepäntie 15 B 300620",
        "addressLocality": "Helsinki",
        "addressCountry": "FI"
      },
      "url": this.baseUrl,
      "priceRange": "€€"
    };
  }

  static generateWebsiteJSONLD() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Kroi Auto Center",
      "url": this.baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${this.baseUrl}/cars?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };
  }

  static generateFAQJSONLD(faqs: Array<{ question: string; answer: string }>) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }
}