import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/app/lib/integrations/email-service';
import { z } from 'zod';

const notifySchema = z.object({
  car: z.object({
    id: z.string(),
    slug: z.string(),
    make: z.string(),
    model: z.string(),
    year: z.number(),
    price: z.number(),
    mileage: z.number(),
    fuelType: z.string(),
    transmission: z.string(),
    bodyType: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.object({
      url: z.string(),
      alt: z.string().optional(),
    })).optional(),
  }),
  // Optional webhook secret for security
  secret: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { car, secret } = notifySchema.parse(body);

    // Verify webhook secret if configured
    const expectedSecret = process.env.WEBHOOK_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Send notifications to matching alerts
    const notificationCount = await EmailService.notifyMatchingAlerts(car);

    return NextResponse.json({
      success: true,
      message: `Sent ${notificationCount} notifications for new car`,
      data: {
        carId: car.id,
        notificationsSent: notificationCount,
      },
    });
  } catch (error) {
    console.error('Error processing car notification:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process notifications',
      },
      { status: 500 }
    );
  }
}