import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { z } from 'zod';

const testDriveSchema = z.object({
  vehicleId: z.string().optional(),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(1, 'Phone number is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  scheduledTime: z.string().min(1, 'Scheduled time is required'),
  type: z.string().default('TEST_DRIVE'),
  duration: z.number().default(30),
  notes: z.string().optional(),
  location: z.string().default('DEALERSHIP'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const vehicleId = searchParams.get('vehicleId');
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: { type: string; status?: string; vehicleId?: string; scheduledDate?: { gte: Date; lt: Date } } = { type: 'TEST_DRIVE' };

    if (status) where.status = status;
    if (vehicleId) where.vehicleId = vehicleId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.scheduledDate = {
        gte: startDate,
        lt: endDate,
      };
    }

    const appointments = await prisma.appointments.findMany({
      where,
      orderBy: {
        scheduledDate: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Error fetching test drives:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch test drives' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = testDriveSchema.parse(body);

    // Convert date and time to proper DateTime
    const scheduledDateTime = new Date(`${validatedData.scheduledDate}T${validatedData.scheduledTime}:00`);

    // Check for scheduling conflicts
    const existingAppointment = await prisma.appointments.findFirst({
      where: {
        scheduledDate: scheduledDateTime,
        scheduledTime: validatedData.scheduledTime,
        status: {
          not: 'CANCELLED'
        }
      }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'This time slot is already booked' },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointments.create({
      data: {
        id: `td_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        vehicleId: validatedData.vehicleId || null,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        type: validatedData.type,
        scheduledDate: scheduledDateTime,
        scheduledTime: validatedData.scheduledTime,
        duration: validatedData.duration,
        status: 'SCHEDULED',
        notes: validatedData.notes || null,
        location: validatedData.location,
        reminderSent: false,
        confirmationSent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // In a real application, you would send confirmation emails here
    // await sendTestDriveConfirmationEmail(appointment);

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Test drive scheduled successfully. You will receive a confirmation email shortly.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating test drive appointment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to schedule test drive' },
      { status: 500 }
    );
  }
}

