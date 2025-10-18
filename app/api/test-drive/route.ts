import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@sanity/client';
import { Resend } from 'resend';

// Type for Sanity booking document
interface SanityBooking {
  _id: string;
  preferredTime: string;
  scheduledDate: string;
  [key: string]: unknown;
}

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
const testDriveSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    driversLicense: z.string().optional()
  }),
  carId: z.string().min(1, 'Car selection is required'),
  scheduledDate: z.string().transform(str => new Date(str)),
  preferredTime: z.enum(['morning', 'afternoon', 'evening']),
  notes: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, 'GDPR consent is required')
});

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
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
    const validationResult = testDriveSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if the slot is available (simple check - could be enhanced)
    const existingBookings = await sanityClient.fetch(
      `*[_type == "testDriveBooking" &&
        scheduledDate == $date &&
        preferredTime == $time &&
        status in ["pending", "confirmed"]]`,
      {
        date: data.scheduledDate.toISOString(),
        time: data.preferredTime
      }
    );

    if (existingBookings.length >= 2) { // Max 2 bookings per time slot
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please choose another time.' },
        { status: 409 }
      );
    }

    // Save to Sanity
    const booking = await sanityClient.create({
      _type: 'testDriveBooking',
      customer: data.customer,
      car: {
        _type: 'reference',
        _ref: data.carId
      },
      scheduledDate: data.scheduledDate.toISOString(),
      preferredTime: data.preferredTime,
      status: 'pending',
      notes: data.notes,
      gdprConsent: data.gdprConsent,
      createdAt: new Date().toISOString()
    });

    // Also create a lead for follow-up
    await sanityClient.create({
      _type: 'lead',
      name: data.customer.name,
      email: data.customer.email,
      phone: data.customer.phone,
      message: `Test drive booking for ${data.scheduledDate.toLocaleDateString('fi-FI')} - ${data.preferredTime}`,
      source: 'test-drive',
      status: 'new',
      carInterest: {
        _type: 'reference',
        _ref: data.carId
      },
      gdprConsent: data.gdprConsent,
      createdAt: new Date().toISOString()
    });

    // Send email notifications
    if (process.env.RESEND_API_KEY) {
      const timeSlots = {
        morning: '9:00 - 12:00',
        afternoon: '12:00 - 16:00',
        evening: '16:00 - 19:00'
      };

      try {
        // Email to admin
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@kroiautocenter.fi',
          to: process.env.CONTACT_EMAIL || 'kroiautocenter@gmail.com',
          subject: `New Test Drive Booking - ${data.customer.name}`,
          html: `
            <h2>New Test Drive Booking</h2>
            <p><strong>Customer:</strong> ${data.customer.name}</p>
            <p><strong>Email:</strong> ${data.customer.email}</p>
            <p><strong>Phone:</strong> ${data.customer.phone}</p>
            <p><strong>Car ID:</strong> ${data.carId}</p>
            <p><strong>Date:</strong> ${data.scheduledDate.toLocaleDateString('fi-FI')}</p>
            <p><strong>Time:</strong> ${timeSlots[data.preferredTime]}</p>
            ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
          `
        });

        // Confirmation email to customer
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@kroiautocenter.fi',
          to: data.customer.email,
          subject: 'Test Drive Booking Confirmation - Kroi Auto Center',
          html: `
            <h2>Test Drive Booking Confirmation</h2>
            <p>Dear ${data.customer.name},</p>
            <p>Your test drive has been scheduled for:</p>
            <p><strong>Date:</strong> ${data.scheduledDate.toLocaleDateString('fi-FI')}</p>
            <p><strong>Time:</strong> ${timeSlots[data.preferredTime]}</p>
            <p>We will contact you shortly to confirm the details.</p>
            <br>
            <p><strong>What to bring:</strong></p>
            <ul>
              <li>Valid driver's license</li>
              <li>Identification document</li>
            </ul>
            <br>
            <p>If you need to reschedule, please contact us at least 24 hours in advance.</p>
            <p>Phone: +358 XX XXX XXXX</p>
            <br>
            <p>Best regards,<br>Kroi Auto Center Team</p>
          `
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Test drive booking submitted successfully',
      bookingId: booking._id,
      scheduledDate: data.scheduledDate.toISOString(),
      preferredTime: data.preferredTime
    });

  } catch (error) {
    console.error('Test drive booking error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your booking' },
      { status: 500 }
    );
  }
}

// Get available time slots
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Get existing bookings for the date
    const bookings = await sanityClient.fetch(
      `*[_type == "testDriveBooking" &&
        scheduledDate >= $startDate &&
        scheduledDate < $endDate &&
        status in ["pending", "confirmed"]] {
        preferredTime
      }`,
      {
        startDate: new Date(date).toISOString(),
        endDate: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString()
      }
    );

    // Count bookings per time slot
    const slotCounts = bookings.reduce((acc: Record<string, number>, booking: SanityBooking) => {
      acc[booking.preferredTime] = (acc[booking.preferredTime] || 0) + 1;
      return acc;
    }, {});

    // Determine available slots (max 2 per slot)
    const availableSlots = {
      morning: slotCounts.morning < 2,
      afternoon: slotCounts.afternoon < 2,
      evening: slotCounts.evening < 2
    };

    return NextResponse.json({ availableSlots });

  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching available slots' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}