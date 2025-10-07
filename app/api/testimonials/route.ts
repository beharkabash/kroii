import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { z } from 'zod';

const testimonialSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required').optional(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  vehicleId: z.string().optional(),
  location: z.string().optional(),
  purchaseDate: z.string().transform(str => str ? new Date(str) : undefined).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const approved = searchParams.get('approved') !== 'false'; // Default to approved only

    const where = {
      isApproved: approved,
      isPublic: true,
      ...(vehicleId && { vehicleId }),
    };

    const testimonials = await prisma.testimonials.findMany({
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
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);

    const testimonial = await prisma.testimonials.create({
      data: {
        id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...validatedData,
        isApproved: false, // Requires admin approval
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: 'Testimonial submitted successfully. It will be reviewed before appearing on the site.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}