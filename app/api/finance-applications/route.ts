import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { z } from 'zod';

const financeApplicationSchema = z.object({
  vehicleId: z.string().optional(),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(1, 'Phone number is required'),
  annualIncome: z.number().min(1, 'Annual income is required'),
  employment: z.string().min(1, 'Employment information is required'),
  creditScore: z.string().optional(),
  loanAmount: z.number().min(1, 'Loan amount is required'),
  downPayment: z.number().min(0, 'Down payment must be 0 or greater'),
  loanTerm: z.number().min(1, 'Loan term is required'),
  interestRate: z.number().optional(),
  monthlyPayment: z.number().optional(),
  lenderName: z.string().optional(),
  documents: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where = status ? { status } : {};

    const applications = await prisma.finance_applications.findMany({
      where,
      include: {
        vehicles: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error('Error fetching finance applications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch finance applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = financeApplicationSchema.parse(body);

    const application = await prisma.finance_applications.create({
      data: {
        id: `fa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...validatedData,
        status: 'SUBMITTED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: application,
      message: 'Finance application submitted successfully. We will review it and contact you soon.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating finance application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create finance application' },
      { status: 500 }
    );
  }
}