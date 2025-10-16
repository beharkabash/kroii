import { NextRequest, NextResponse } from 'next/server';
import { InventoryAlertsService } from '@/app/lib/features/inventory-alerts';
import { z } from 'zod';

const createAlertSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().optional(),
  criteria: z.object({
    vehicleMake: z.string().optional(),
    vehicleModel: z.string().optional(),
    maxPrice: z.number().positive().optional(),
    minYear: z.number().min(1950).max(new Date().getFullYear() + 1).optional(),
    maxMileage: z.number().positive().optional(),
    bodyType: z.string().optional(),
    fuelType: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createAlertSchema.parse(body);

    const alert = await InventoryAlertsService.createAlert({
      email: validatedData.email,
      name: validatedData.name,
      criteria: validatedData.criteria,
    });

    return NextResponse.json({
      success: true,
      data: alert,
      message: 'Ilmoitushälytys luotu onnistuneesti',
    });
  } catch (error) {
    console.error('Error creating alert:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Virheelliset tiedot',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Ilmoitushälytyksen luominen epäonnistui',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Sähköpostiosoite vaaditaan',
        },
        { status: 400 }
      );
    }

    const alerts = await InventoryAlertsService.getAlertsByEmail(email);

    return NextResponse.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Hälytysten hakeminen epäonnistui',
      },
      { status: 500 }
    );
  }
}