import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for adding activities
const addActivitySchema = z.object({
  type: z.enum(['EMAIL_SENT', 'PHONE_CALL', 'MEETING', 'NOTE_ADDED', 'STATUS_CHANGED', 'CAR_SHOWN', 'TEST_DRIVE']),
  description: z.string().min(1, 'Kuvaus ei voi olla tyhjä').max(1000, 'Kuvaus on liian pitkä'),
  metadata: z.record(z.any()).optional(),
});

/**
 * GET /api/admin/leads/[id]/activities
 * Get all activities for a specific lead
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta' },
        { status: 403 }
      );
    }

    // Check if lead exists and user has permission
    const lead = await prisma.contactSubmission.findUnique({
      where: { id },
      select: {
        id: true,
        assignedToId: true,
        email: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Liidiä ei löytynyt' },
        { status: 404 }
      );
    }

    // Check permissions
    if (session.user.role === 'ADMIN') {
      if (lead.assignedToId !== session.user.id && lead.assignedToId !== null) {
        return NextResponse.json(
          { error: 'Ei käyttöoikeutta tähän liidiin' },
          { status: 403 }
        );
      }
    }

    // Get query parameters for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Get all activities for the lead
    const [activities, totalCount] = await Promise.all([
      prisma.contactActivity.findMany({
        where: { contactId: id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.contactActivity.count({
        where: { contactId: id },
      }),
    ]);

    // Format activities with human-readable descriptions
    const formattedActivities = activities.map(activity => ({
      ...activity,
      formattedDescription: getActivityDescription(activity),
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      activities: formattedActivities,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching lead activities:', error);
    return NextResponse.json(
      { error: 'Virhe ladattaessa aktiviteetteja' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/admin/leads/[id]/activities
 * Add a new activity to a specific lead
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, description, metadata } = addActivitySchema.parse(body);

    // Check if lead exists and user has permission
    const lead = await prisma.contactSubmission.findUnique({
      where: { id },
      select: {
        id: true,
        assignedToId: true,
        email: true,
        name: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Liidiä ei löytynyt' },
        { status: 404 }
      );
    }

    // Check permissions
    if (session.user.role === 'ADMIN') {
      if (lead.assignedToId !== session.user.id && lead.assignedToId !== null) {
        return NextResponse.json(
          { error: 'Ei käyttöoikeutta lisätä aktiviteetteja tähän liidiin' },
          { status: 403 }
        );
      }
    }

    // Create the activity
    const newActivity = await prisma.contactActivity.create({
      data: {
        contactId: id,
        type,
        description,
        metadata: {
          ...metadata,
          addedBy: session.user.id,
          addedByName: session.user.name,
        },
      },
    });

    // Log the activity addition
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'ACTIVITY_ADDED_TO_LEAD',
        entity: 'contact_activity',
        entityId: newActivity.id,
        metadata: {
          leadId: id,
          leadEmail: lead.email,
          activityType: type,
          activityDescription: description,
        },
      },
    });

    // Update lead's updatedAt timestamp
    await prisma.contactSubmission.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Format the activity for response
    const formattedActivity = {
      ...newActivity,
      formattedDescription: getActivityDescription(newActivity),
    };

    return NextResponse.json({
      success: true,
      message: 'Aktiviteetti lisätty onnistuneesti',
      activity: formattedActivity,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error adding activity to lead:', error);
    return NextResponse.json(
      { error: 'Virhe lisätessä aktiviteettia' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Generate human-readable description for activity
 */
function getActivityDescription(activity: any): string {
  const { type, description, metadata } = activity;

  switch (type) {
    case 'EMAIL_SENT':
      return `📧 Sähköposti lähetetty: ${description}`;

    case 'PHONE_CALL':
      const duration = metadata?.duration ? ` (${metadata.duration})` : '';
      return `📞 Puhelu${duration}: ${description}`;

    case 'MEETING':
      const meetingType = metadata?.meetingType || 'tapaaminen';
      return `🤝 ${meetingType}: ${description}`;

    case 'NOTE_ADDED':
      return `📝 Huomautus: ${description}`;

    case 'STATUS_CHANGED':
      const status = metadata?.newStatus ? ` → ${metadata.newStatus}` : '';
      return `🔄 Status muutettu${status}: ${description}`;

    case 'CAR_SHOWN':
      const carName = metadata?.carName || 'Auto';
      return `🚗 ${carName} esitelty: ${description}`;

    case 'TEST_DRIVE':
      const testCarName = metadata?.carName || 'Auto';
      return `🔑 Koeajo (${testCarName}): ${description}`;

    default:
      return `📋 ${type}: ${description}`;
  }
}