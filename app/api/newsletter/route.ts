import { NextRequest, NextResponse } from 'next/server';
import { rateLimitForm } from '@/app/lib/rate-limit';
import { newsletterSchema } from '@/app/lib/validation';
import { sendNewsletterConfirmation } from '@/app/lib/email/email-service';
import { z } from 'zod';

/**
 * POST /api/newsletter
 * Handles newsletter subscription with validation and email confirmation
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const rateLimitResult = await rateLimitForm(request);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Liian monta yritystä. Odota hetki ja yritä uudelleen.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        }
      );
    }

    // 2. Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Virheellinen pyyntö' },
        { status: 400 }
      );
    }

    // 3. Validate with Zod
    let validatedData;
    try {
      validatedData = newsletterSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.errors[0]?.message || 'Virheelliset tiedot' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Virheelliset tiedot' },
        { status: 400 }
      );
    }

    // 4. Sanitize data
    const sanitizedData = {
      email: validatedData.email.toLowerCase().trim(),
      timestamp: new Date().toISOString(),
    };

    // 5. Log subscription
    console.log('[NEWSLETTER] New subscription:', {
      email: sanitizedData.email,
      timestamp: sanitizedData.timestamp,
    });

    // 6. Send confirmation email (don't wait for completion)
    sendNewsletterConfirmation(sanitizedData.email, undefined)
      .catch((error) => {
        console.error('[EMAIL] Failed to send newsletter confirmation:', error);
      });

    // 8. TODO: Store subscription in database or mailing list service
    // Example with Resend Audiences:
    /*
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.contacts.create({
        email: sanitizedData.email,
        firstName: sanitizedData.name?.split(' ')[0],
        lastName: sanitizedData.name?.split(' ').slice(1).join(' '),
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    }
    */

    // 9. Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Kiitos tilauksesta! Saat vahvistuksen sähköpostitse.',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error('[NEWSLETTER ERROR]', error);
    return NextResponse.json(
      { error: 'Palvelinvirhe. Yritä myöhemmin uudelleen.' },
      { status: 500 }
    );
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}