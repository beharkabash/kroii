import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for lead updates
const updateLeadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATING', 'CONVERTED', 'LOST', 'SPAM']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedToId: z.string().nullable().optional(),
  carId: z.string().nullable().optional(),
});

/**
 * GET /api/admin/leads/[id]
 * Get specific lead by ID with all related data
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

    // Get lead with all related data
    const lead = await prisma.contactSubmission.findUnique({
      where: { id },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true,
            year: true,
            priceEur: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              select: { url: true, altText: true },
              take: 1,
            },
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        notes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Liidiä ei löytynyt' },
        { status: 404 }
      );
    }

    // Check permissions (ADMIN can only see their assigned leads or unassigned)
    if (session.user.role === 'ADMIN') {
      if (lead.assignedToId !== session.user.id && lead.assignedToId !== null) {
        return NextResponse.json(
          { error: 'Ei käyttöoikeutta tähän liidiin' },
          { status: 403 }
        );
      }
    }

    // Get lead history (recent similar leads from same email or phone)
    const leadHistory = await prisma.contactSubmission.findMany({
      where: {
        OR: [
          { email: lead.email },
          ...(lead.phone ? [{ phone: lead.phone }] : []),
        ],
        id: { not: lead.id },
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        message: true,
        car: {
          select: {
            name: true,
            brand: true,
            model: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      lead,
      leadHistory,
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Virhe ladattaessa liidiä' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/admin/leads/[id]
 * Update specific lead
 */
export async function PATCH(
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
    const validatedData = updateLeadSchema.parse(body);

    // Check if lead exists and user has permission
    const existingLead = await prisma.contactSubmission.findUnique({
      where: { id },
      select: {
        id: true,
        assignedToId: true,
        status: true,
        priority: true,
        email: true,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Liidiä ei löytynyt' },
        { status: 404 }
      );
    }

    // Check permissions
    if (session.user.role === 'ADMIN') {
      if (existingLead.assignedToId !== session.user.id && existingLead.assignedToId !== null) {
        return NextResponse.json(
          { error: 'Ei käyttöoikeutta muokata tätä liidiä' },
          { status: 403 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      ...validatedData,
      updatedAt: new Date(),
    };

    // Set close date if status is converted or lost
    if (validatedData.status === 'CONVERTED' || validatedData.status === 'LOST') {
      updateData.closedAt = new Date();
    } else if (validatedData.status && existingLead.status !== validatedData.status) {
      // Clear close date if status changed from closed to open
      updateData.closedAt = null;
    }

    // Set responded date if status is contacted for the first time
    if (validatedData.status === 'CONTACTED' && existingLead.status !== 'CONTACTED') {
      updateData.respondedAt = new Date();
    }

    // Update the lead
    const updatedLead = await prisma.contactSubmission.update({
      where: { id },
      data: updateData,
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activities for changes
    const activities = [];

    if (validatedData.status && existingLead.status !== validatedData.status) {
      activities.push({
        contactId: id,
        type: 'STATUS_CHANGED' as const,
        description: `Status muutettu: ${existingLead.status} → ${validatedData.status}`,
        metadata: {
          oldStatus: existingLead.status,
          newStatus: validatedData.status,
          changedBy: session.user.id,
        },
      });
    }

    if (validatedData.priority && existingLead.priority !== validatedData.priority) {
      activities.push({
        contactId: id,
        type: 'NOTE_ADDED' as const,
        description: `Prioriteetti muutettu: ${existingLead.priority} → ${validatedData.priority}`,
        metadata: {
          oldPriority: existingLead.priority,
          newPriority: validatedData.priority,
          changedBy: session.user.id,
        },
      });
    }

    if (validatedData.assignedToId !== undefined && existingLead.assignedToId !== validatedData.assignedToId) {
      const assigneeText = validatedData.assignedToId ? `käyttäjälle ${validatedData.assignedToId}` : 'ei ketään';
      activities.push({
        contactId: id,
        type: 'NOTE_ADDED' as const,
        description: `Liidi osoitettu ${assigneeText}`,
        metadata: {
          oldAssignee: existingLead.assignedToId,
          newAssignee: validatedData.assignedToId,
          changedBy: session.user.id,
        },
      });
    }

    // Create activity entries
    if (activities.length > 0) {
      await prisma.contactActivity.createMany({
        data: activities,
      });
    }

    // Log the update
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'LEAD_UPDATED',
        entity: 'contact_submission',
        entityId: id,
        metadata: {
          leadEmail: existingLead.email,
          updatedFields: Object.keys(validatedData),
          changes: validatedData,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Liidi päivitetty onnistuneesti',
      lead: updatedLead,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Virhe päivittäessä liidiä' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/admin/leads/[id]
 * Delete specific lead (requires SUPER_ADMIN role)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta poistaa liidejä' },
        { status: 403 }
      );
    }

    // Check if lead exists
    const existingLead = await prisma.contactSubmission.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Liidiä ei löytynyt' },
        { status: 404 }
      );
    }

    // Delete the lead (cascade will handle related records)
    await prisma.contactSubmission.delete({
      where: { id },
    });

    // Log the deletion
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'LEAD_DELETED',
        entity: 'contact_submission',
        entityId: id,
        metadata: {
          deletedLeadEmail: existingLead.email,
          deletedLeadName: existingLead.name,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Liidi poistettu onnistuneesti',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Virhe poistaessa liidiä' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}