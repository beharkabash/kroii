import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@sanity/client';
import { Resend } from 'resend';

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  carInterest: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, 'GDPR consent is required'),
  marketingConsent: z.boolean().optional()
});

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];

  // Clean old requests
  const recentRequests = userRequests.filter((time: number) => now - time < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (process.env.ENABLE_RATE_LIMITING === 'true' && !checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Save to Sanity
    const lead = await sanityClient.create({
      _type: 'lead',
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      source: 'contact',
      status: 'new',
      carInterest: data.carInterest ? {
        _type: 'reference',
        _ref: data.carInterest
      } : undefined,
      gdprConsent: data.gdprConsent,
      marketingConsent: data.marketingConsent || false,
      createdAt: new Date().toISOString()
    });

    // Send email notification to admin
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@kroiautocenter.fi',
          to: process.env.CONTACT_EMAIL,
          subject: `New Contact Form Submission from ${data.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            ${data.carInterest ? `<p><strong>Interested in Car ID:</strong> ${data.carInterest}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
            <hr>
            <p><small>GDPR Consent: ${data.gdprConsent ? 'Yes' : 'No'}</small></p>
            <p><small>Marketing Consent: ${data.marketingConsent ? 'Yes' : 'No'}</small></p>
          `
        });

        // Send confirmation email to customer
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@kroiautocenter.fi',
          to: data.email,
          subject: 'Thank you for contacting Kroi Auto Center',
          html: `
            <h2>Thank you for your inquiry!</h2>
            <p>Dear ${data.name},</p>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <p>If you have any urgent questions, please feel free to call us at +358 XX XXX XXXX.</p>
            <br>
            <p>Best regards,<br>Kroi Auto Center Team</p>
          `
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      leadId: lead._id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}