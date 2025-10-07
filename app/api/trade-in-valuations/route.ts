import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { z } from 'zod';

const tradeInValuationSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().optional(),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  vehicleYear: z.number().min(1900).max(new Date().getFullYear() + 1),
  vehicleMileage: z.number().min(0),
  vehicleCondition: z.string().min(1, 'Vehicle condition is required'),
  vehiclePhotos: z.string().optional(),
  hasAccidents: z.boolean().default(false),
  hasServiceHistory: z.boolean().default(false),
  notes: z.string().optional(),
});

// Helper function to estimate market value based on vehicle data
function estimateMarketValue(vehicleData: {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleMileage: number;
  vehicleCondition: string;
  hasAccidents: boolean;
  hasServiceHistory: boolean;
}): number {
  // This is a simplified estimation algorithm
  // In production, you'd integrate with real market data APIs like KBB or Edmunds

  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicleData.vehicleYear;

  // Base values by make (simplified)
  const makeValues: { [key: string]: number } = {
    'BMW': 35000,
    'Mercedes-Benz': 40000,
    'Audi': 35000,
    'Volkswagen': 25000,
    'Skoda': 20000,
    'Toyota': 25000,
    'Honda': 22000,
    'Ford': 20000,
    'Opel': 18000,
    'Peugeot': 18000,
    'Renault': 17000,
    'Nissan': 20000,
    'Volvo': 30000,
  };

  const baseValue = makeValues[vehicleData.vehicleMake] || 20000;

  // Depreciation: roughly 15% per year for first 5 years, then 10% per year
  const depreciationRate = vehicleAge <= 5 ? 0.15 : 0.10;
  const depreciation = Math.min(vehicleAge * depreciationRate, 0.80); // Max 80% depreciation

  let estimatedValue = baseValue * (1 - depreciation);

  // Mileage adjustment: reduce value for high mileage
  const averageMileagePerYear = 15000;
  const expectedMileage = vehicleAge * averageMileagePerYear;
  const mileageDifference = vehicleData.vehicleMileage - expectedMileage;

  if (mileageDifference > 0) {
    // Higher than average mileage
    const mileagePenalty = (mileageDifference / 10000) * 0.05; // 5% penalty per 10k excess miles
    estimatedValue *= (1 - Math.min(mileagePenalty, 0.30)); // Max 30% penalty
  } else {
    // Lower than average mileage (bonus)
    const mileageBonus = Math.abs(mileageDifference / 10000) * 0.03; // 3% bonus per 10k fewer miles
    estimatedValue *= (1 + Math.min(mileageBonus, 0.15)); // Max 15% bonus
  }

  // Condition adjustments
  const conditionMultipliers = {
    'EXCELLENT': 1.10,
    'VERY_GOOD': 1.05,
    'GOOD': 1.00,
    'FAIR': 0.85,
    'POOR': 0.65,
  };
  estimatedValue *= conditionMultipliers[vehicleData.vehicleCondition as keyof typeof conditionMultipliers] || 1.00;

  // Accident history penalty
  if (vehicleData.hasAccidents) {
    estimatedValue *= 0.85; // 15% penalty for accident history
  }

  // Service history bonus
  if (vehicleData.hasServiceHistory) {
    estimatedValue *= 1.05; // 5% bonus for good service history
  }

  return Math.round(estimatedValue);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where = status ? { status } : {};

    const valuations = await prisma.trade_in_valuations.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: valuations,
    });
  } catch (error) {
    console.error('Error fetching trade-in valuations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trade-in valuations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = tradeInValuationSchema.parse(body);

    // Calculate estimated market value
    const marketValue = estimateMarketValue(validatedData);

    // Our offer is typically 80-90% of market value depending on condition
    const offerPercentage = validatedData.vehicleCondition === 'EXCELLENT' ? 0.90 :
                           validatedData.vehicleCondition === 'VERY_GOOD' ? 0.85 :
                           validatedData.vehicleCondition === 'GOOD' ? 0.80 :
                           validatedData.vehicleCondition === 'FAIR' ? 0.70 : 0.60;

    const offerValue = Math.round(marketValue * offerPercentage);

    // Offer expires in 30 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const valuation = await prisma.trade_in_valuations.create({
      data: {
        id: `tiv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...validatedData,
        marketValue,
        offerValue,
        status: 'SUBMITTED',
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: valuation,
      message: 'Trade-in valuation completed. You will receive a detailed offer via email.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating trade-in valuation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create trade-in valuation' },
      { status: 500 }
    );
  }
}