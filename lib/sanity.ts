import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: true, // Set to false if you want to ensure fresh data
  token: process.env.SANITY_API_TOKEN,
});

// Image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// GROQ query helpers for cars
export const CARS_QUERY = `*[_type == "car"] | order(_createdAt desc) {
  _id,
  _createdAt,
  name,
  slug,
  brand,
  model,
  price,
  priceEur,
  year,
  fuel,
  transmission,
  km,
  kmNumber,
  category,
  description,
  detailedDescription,
  features,
  "image": mainImage.asset->url,
  "images": gallery[].asset->url,
  specifications
}`;

export const CAR_BY_SLUG_QUERY = `*[_type == "car" && slug.current == $slug][0] {
  _id,
  _createdAt,
  name,
  slug,
  brand,
  model,
  price,
  priceEur,
  year,
  fuel,
  transmission,
  km,
  kmNumber,
  category,
  description,
  detailedDescription,
  features,
  "image": mainImage.asset->url,
  "images": gallery[].asset->url,
  specifications
}`;

export const RELATED_CARS_QUERY = `*[_type == "car" && brand == $brand && slug.current != $slug] | order(_createdAt desc) [0...3] {
  _id,
  name,
  slug,
  brand,
  model,
  price,
  year,
  fuel,
  km,
  "image": mainImage.asset->url
}`;
