import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2024-01-01',
})

// Image URL builder
const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => {
  return builder.image(source)
}

// Helper function to fetch services data
export async function getServicesData() {
  try {
    const services = await client.fetch(`
      *[_type == "service"] | order(_createdAt asc) {
        _id,
        title,
        description,
        features,
        price,
        image {
          asset->{
            _id,
            url
          }
        },
        category
      }
    `)
    return services || []
  } catch (error) {
    console.error('Error fetching services from Sanity:', error)
    return []
  }
}

// Helper function to fetch about page data
export async function getAboutData() {
  try {
    const about = await client.fetch(`
      *[_type == "aboutPage"][0] {
        _id,
        title,
        description,
        mission,
        vision,
        teamMembers[] {
          name,
          position,
          bio,
          image {
            asset->{
              _id,
              url
            }
          }
        },
        stats[] {
          label,
          value
        },
        heroImage {
          asset->{
            _id,
            url
          }
        }
      }
    `)
    return about || null
  } catch (error) {
    console.error('Error fetching about data from Sanity:', error)
    return null
  }
}

// Helper function to fetch testimonials
export async function getTestimonials() {
  try {
    const testimonials = await client.fetch(`
      *[_type == "testimonial"] | order(_createdAt desc) {
        _id,
        name,
        content,
        rating,
        image {
          asset->{
            _id,
            url
          }
        },
        service
      }
    `)
    return testimonials || []
  } catch (error) {
    console.error('Error fetching testimonials from Sanity:', error)
    return []
  }
}