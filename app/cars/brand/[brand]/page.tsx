/**
 * Car Brand Page
 * Shows cars filtered by specific brand
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCarsByBrand, convertToLegacyFormat, getAllBrands } from '@/app/lib/db/cars';
import BrandPageContent from './BrandPageContent';

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

// Generate static paths for all brands
export async function generateStaticParams() {
  try {
    const brands = await getAllBrands();
    return brands.map((brand) => ({
      brand: brand.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    console.error('Error generating brand params:', error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand } = await params;
  const decodedBrand = decodeURIComponent(brand).replace(/-/g, ' ');

  // Capitalize first letter of each word
  const brandName = decodedBrand
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return {
    title: `${brandName} autot - Kroi Auto Center`,
    description: `Tutustu laajaan ${brandName} automerkki valikoimaamme. Laadukkaita käytettyjä ${brandName} autoja Helsingistä.`,
    keywords: [
      brandName,
      `${brandName} autot`,
      'käytetyt autot',
      'auto myytävänä',
      'Helsinki',
      'Kroi Auto Center'
    ].join(', '),
    openGraph: {
      title: `${brandName} autot - Kroi Auto Center`,
      description: `Löydä unelmiesi ${brandName} auto meiltä`,
      type: 'website',
    }
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;
  const decodedBrand = decodeURIComponent(brand).replace(/-/g, ' ');

  try {
    // Get cars from this brand
    const dbCars = await getCarsByBrand(decodedBrand, {
      limit: 50,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    // If no cars found, check if brand exists at all
    if (dbCars.length === 0) {
      const allBrands = await getAllBrands();
      const brandExists = allBrands.some(b =>
        b.toLowerCase().replace(/\s+/g, '-') === brand.toLowerCase()
      );

      if (!brandExists) {
        notFound();
      }
    }

    // Convert to legacy format for compatibility
    const cars = dbCars.map(convertToLegacyFormat);

    const brandName = decodedBrand
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const brandDescriptions: Record<string, string> = {
      'bmw': 'BMW edustaa saksalaista laatua, innovatiivista teknologiaa ja ajamisen iloa. Tunnettu luotettavuudestaan ja suorituskyvystään.',
      'volkswagen': 'Volkswagen on yksi maailman arvostetuimmista automerkeistä. Käytännöllisyys, laatu ja teknologia yhdistyvät VW:n autoissa.',
      'audi': 'Audi tarjoaa luksusta, kehittynyttä teknologiaa ja erinomaista ajodynamiikkaa. Quattro-neliveto ja premium-materiaalit.',
      'mercedes': 'Mercedes-Benz on luksusautojen pioneeri. Erinomainen mukavuus, turvallisuus ja ajamisen nautinto.',
      'mercedes-benz': 'Mercedes-Benz on luksusautojen pioneeri. Erinomainen mukavuus, turvallisuus ja ajamisen nautinto.',
      'skoda': 'Škoda tarjoaa erinomaista vastinetta rahalle. Käytännölliset, tilavat ja luotettavat autot koko perheelle.',
      'volvo': 'Volvo on tunnettu turvallisuudestaan ja kestävyydestään. Skandinaavinen muotoilu kohtaa ruotsalaisen insinööritaidon.',
      'toyota': 'Toyota on maailman luotetuimpia automerkkejä. Hybriditekniikan edelläkävijä ja poikkeuksellinen luotettavuus.',
      'ford': 'Ford edustaa amerikkalaista autoperinteitä. Voimakkaita ja käytännöllisiä autoja monipuolisiin tarpeisiin.',
      'opel': 'Opel tarjoaa saksalaista laatua kohtuulliseen hintaan. Nykyaikaiset autot arkikäyttöön ja reissuihin.'
    };

    const brandDescription = brandDescriptions[decodedBrand.toLowerCase()] ||
      `Tutustu ${brandName} automerkki valikoimaamme. Laadukkaita ja tarkastettuja käytettyjä autoja.`;

    return (
      <BrandPageContent
        cars={cars}
        brandName={brandName}
        brandDescription={brandDescription}
        brand={brand}
      />
    );
  } catch (error) {
    console.error('Error fetching brand cars:', error);
    notFound();
  }
}