/**
 * OpenGraph Image Generation Utilities
 * For dynamic OG image generation (future enhancement)
 */

export interface OGImageConfig {
  title: string;
  subtitle?: string;
  price?: string;
  year?: number;
  km?: number;
  backgroundImage?: string;
  theme?: 'default' | 'car' | 'blog';
}

export class OGImageGenerator {
  private static baseUrl = 'https://kroiautocenter.fi';

  /**
   * Generate OG image URL for car listings
   */
  static generateCarOGImage(config: OGImageConfig): string {
    // For now, return default image. In future, this could generate dynamic images
    if (config.backgroundImage) {
      return `${this.baseUrl}${config.backgroundImage}`;
    }
    return `${this.baseUrl}/og-car-default.jpg`;
  }

  /**
   * Generate OG image URL for blog posts
   */
  static generateBlogOGImage(config: OGImageConfig): string {
    return `${this.baseUrl}/og-blog-default.jpg`;
  }

  /**
   * Generate default OG image
   */
  static generateDefaultOGImage(): string {
    return `${this.baseUrl}/og-default.jpg`;
  }

  /**
   * Future: Dynamic image generation endpoint
   * This would be an API route that generates images on-the-fly
   */
  static generateDynamicOGImageURL(config: OGImageConfig): string {
    const params = new URLSearchParams({
      title: config.title,
      ...(config.subtitle && { subtitle: config.subtitle }),
      ...(config.price && { price: config.price }),
      ...(config.year && { year: config.year.toString() }),
      ...(config.km && { km: config.km.toString() }),
      theme: config.theme || 'default'
    });

    return `${this.baseUrl}/api/og?${params.toString()}`;
  }
}

/**
 * Default OpenGraph images configuration
 */
export const OG_IMAGES = {
  default: '/og-default.jpg',
  car: '/og-car-default.jpg',
  blog: '/og-blog-default.jpg',
  contact: '/og-contact.jpg',
  about: '/og-about.jpg'
} as const;

/**
 * Generate comprehensive OpenGraph metadata
 */
export function generateOGMetadata(config: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}) {
  const baseUrl = 'https://kroiautocenter.fi';
  const imageUrl = config.image ? `${baseUrl}${config.image}` : OGImageGenerator.generateDefaultOGImage();

  return {
    title: config.title,
    description: config.description,
    url: `${baseUrl}${config.url}`,
    siteName: 'Kroi Auto Center',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: config.title,
        type: 'image/jpeg'
      }
    ],
    locale: 'fi_FI',
    type: config.type || 'website',
    ...(config.publishedTime && { publishedTime: config.publishedTime }),
    ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
    ...(config.author && {
      authors: [config.author]
    }),
    ...(config.section && { section: config.section }),
    ...(config.tags && { tags: config.tags })
  };
}