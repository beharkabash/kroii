import { NextRequest, NextResponse } from 'next/server';
import { rateLimitForm } from '@/app/lib/rate-limit';
import {
  contactFormSchema,
  sanitizeString,
  isInputSafe,
  validateBodySize,
} from '@/app/lib/validation';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// Configure maximum request body size (100KB)
const MAX_BODY_SIZE = 100000;

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * POST /api/contact
 * Handles contact form submissions with comprehensive security measures
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting - Prevent abuse and DoS attacks
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
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // 2. Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Virheellinen pyyntö. Tarkista tiedot ja yritä uudelleen.' },
        { status: 400 }
      );
    }

    // 3. Validate body size to prevent DoS attacks
    if (!validateBodySize(body, MAX_BODY_SIZE)) {
      return NextResponse.json(
        { error: 'Pyyntö on liian suuri.' },
        { status: 413 }
      );
    }

    // 4. Validate input schema with Zod
    let validatedData;
    try {
      validatedData = contactFormSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return NextResponse.json(
          {
            error: firstError.message || 'Virheelliset tiedot',
            field: firstError.path[0],
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Virheelliset tiedot' },
        { status: 400 }
      );
    }

    // 5. Additional security checks for malicious content
    const inputs = [
      validatedData.name,
      validatedData.email,
      validatedData.phone || '',
      validatedData.message,
    ];

    for (const input of inputs) {
      if (!isInputSafe(input)) {
        // Log suspicious activity (in production, send to monitoring service)
        console.warn('[SECURITY] Potentially malicious input detected:', {
          timestamp: new Date().toISOString(),
          ip: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent'),
        });

        return NextResponse.json(
          { error: 'Virheelliset tiedot. Älä käytä erikoismerkkejä.' },
          { status: 400 }
        );
      }
    }

    // 6. Sanitize all inputs for safe storage/display
    const sanitizedData = {
      name: sanitizeString(validatedData.name),
      email: validatedData.email.toLowerCase().trim(),
      phone: validatedData.phone || '',
      message: sanitizeString(validatedData.message),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // 7. Calculate lead score for prioritization
    const { calculateLeadScore } = await import('@/app/lib/lead-scoring');
    const leadScoreResult = calculateLeadScore({
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      message: sanitizedData.message,
    });

    // 8. Save lead to database
    let savedLead;
    try {
      // Determine priority based on lead score
      let priority = 'MEDIUM';
      if (leadScoreResult.score >= 70) priority = 'HIGH';
      else if (leadScoreResult.score >= 85) priority = 'URGENT';
      else if (leadScoreResult.score < 40) priority = 'LOW';

      savedLead = await prisma.contactSubmission.create({
        data: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone || null,
          message: sanitizedData.message,
          leadScore: leadScoreResult.score,
          priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
          source: 'contact_form',
          ip: sanitizedData.ip.split(',')[0], // Store only first IP in chain
          userAgent: sanitizedData.userAgent,
          // carId would be set if this was inquiry about specific car
        },
      });

      // Log activity for the new lead
      await prisma.contactActivity.create({
        data: {
          contactId: savedLead.id,
          type: 'NOTE_ADDED',
          description: `New lead created from contact form with score ${leadScoreResult.score}/100`,
          metadata: {
            leadScore: leadScoreResult.score,
            factors: leadScoreResult.factors,
            quality: leadScoreResult.quality,
          },
        },
      });

      console.log('[CONTACT FORM] Lead saved to database:', {
        id: savedLead.id,
        name: sanitizedData.name,
        email: sanitizedData.email,
        leadScore: leadScoreResult.score,
        priority,
      });
    } catch (dbError) {
      console.error('[DATABASE] Failed to save lead:', dbError);
      // Continue with email sending even if database save fails
    }

    // 9. Send email notifications using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const {
          sendContactNotification,
          sendAutoResponder,
        } = await import('@/app/lib/email/email-service');

        // Send notification to business
        const notificationResult = await sendContactNotification({
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          message: sanitizedData.message,
          leadScore: leadScoreResult.score,
        });

        if (!notificationResult.success) {
          console.error('[EMAIL] Failed to send notification:', notificationResult.error);
        }

        // Send auto-responder to customer
        const autoResponderResult = await sendAutoResponder({
          name: sanitizedData.name,
          email: sanitizedData.email,
        });

        if (!autoResponderResult.success) {
          console.error('[EMAIL] Failed to send auto-responder:', autoResponderResult.error);
        }
      } catch (emailError) {
        console.error('[EMAIL] Error sending emails:', emailError);
        // Don't expose email errors to client - form submission still succeeds
      }
    } else {
      console.warn('[EMAIL] RESEND_API_KEY not configured. Emails will not be sent.');
    }

    // 10. Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Viesti lähetetty onnistuneesti! Otamme sinuun yhteyttä pian.',
        leadId: savedLead?.id, // Include lead ID for tracking
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );
  } catch (error) {
    // 11. Secure error handling - don't expose internal details
    console.error('[CONTACT FORM ERROR]', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: 'Palvelinvirhe. Yritä myöhemmin uudelleen tai ota yhteyttä puhelimitse.',
      },
      { status: 500 }
    );
  } finally {
    // 12. Clean up database connection
    await prisma.$disconnect();
  }
}

// Reject all other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'POST' } }
  );
}