import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for bulk operations
const bulkUpdateSchema = z.object({
  leadIds: z.array(z.string()),
  action: z.enum(['assign', 'status', 'priority', 'delete']),
  data: z.object({
    assignedToId: z.string().optional(),
    status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'NEGOTIATING', 'CONVERTED', 'LOST', 'SPAM']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  }).optional(),
});

/**
 * GET /api/admin/leads
 * Get leads with filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);

    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const priority = url.searchParams.get('priority') || '';
    const assignedTo = url.searchParams.get('assignedTo') || '';
    const source = url.searchParams.get('source') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');

    const offset = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Priority filter
    if (priority && priority !== 'ALL') {
      where.priority = priority;
    }

    // Assigned to filter
    if (assignedTo && assignedTo !== 'ALL') {
      if (assignedTo === 'UNASSIGNED') {
        where.assignedToId = null;
      } else {
        where.assignedToId = assignedTo;
      }
    }

    // Source filter
    if (source && source !== 'ALL') {
      where.source = source;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    // Role-based filtering (ADMIN can only see their assigned leads if not SUPER_ADMIN)
    if (session.user.role === 'ADMIN') {
      where.OR = [
        { assignedToId: session.user.id },
        { assignedToId: null }, // Unassigned leads
      ];
    }

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'leadScore') {
      orderBy.leadScore = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'updatedAt') {
      orderBy.updatedAt = sortOrder;
    } else {
      orderBy.createdAt = 'desc'; // Default sort
    }

    // Get leads with related data
    const [leads, totalCount] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        include: {
          car: {
            select: {
              id: true,
              name: true,
              brand: true,
              model: true,
              priceEur: true,
              slug: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          notes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 1, // Get latest note for preview
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Get latest activity for preview
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    // Get statistics for the current filter
    const stats = await prisma.contactSubmission.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
    });

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      stats: {
        totalCount,
        statusCounts,
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Virhe ladattaessa liidejä' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/admin/leads
 * Bulk operations on leads
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { leadIds, action, data } = bulkUpdateSchema.parse(body);

    // Check if user has permission to modify these leads
    if (session.user.role === 'ADMIN') {
      const leadsToCheck = await prisma.contactSubmission.findMany({
        where: {
          id: { in: leadIds },
          OR: [
            { assignedToId: session.user.id },
            { assignedToId: null },
          ],
        },
        select: { id: true },
      });

      if (leadsToCheck.length !== leadIds.length) {
        return NextResponse.json(
          { error: 'Ei käyttöoikeutta kaikkiin valittuihin liideihin' },
          { status: 403 }
        );
      }
    }

    let result;

    switch (action) {
      case 'assign':
        if (!data?.assignedToId) {
          return NextResponse.json(
            { error: 'Käyttäjä-ID puuttuu' },
            { status: 400 }
          );
        }

        result = await prisma.contactSubmission.updateMany({
          where: { id: { in: leadIds } },
          data: {
            assignedToId: data.assignedToId,
            updatedAt: new Date(),
          },
        });

        // Log activities for each lead
        await Promise.all(
          leadIds.map(leadId =>
            prisma.contactActivity.create({
              data: {
                contactId: leadId,
                type: 'NOTE_ADDED',
                description: `Liidi osoitettu käyttäjälle ${data.assignedToId}`,
                metadata: {
                  assignedBy: session.user.id,
                  assignedTo: data.assignedToId,
                },
              },
            })
          )
        );
        break;

      case 'status':
        if (!data?.status) {
          return NextResponse.json(
            { error: 'Status puuttuu' },
            { status: 400 }
          );
        }

        result = await prisma.contactSubmission.updateMany({
          where: { id: { in: leadIds } },
          data: {
            status: data.status,
            updatedAt: new Date(),
            ...(data.status === 'CONVERTED' && { closedAt: new Date() }),
            ...(data.status === 'LOST' && { closedAt: new Date() }),
          },
        });

        // Log activities
        await Promise.all(
          leadIds.map(leadId =>
            prisma.contactActivity.create({
              data: {
                contactId: leadId,
                type: 'STATUS_CHANGED',
                description: `Status muutettu: ${data.status}`,
                metadata: {
                  changedBy: session.user.id,
                  newStatus: data.status,
                },
              },
            })
          )
        );
        break;

      case 'priority':
        if (!data?.priority) {
          return NextResponse.json(
            { error: 'Prioriteetti puuttuu' },
            { status: 400 }
          );
        }

        result = await prisma.contactSubmission.updateMany({
          where: { id: { in: leadIds } },
          data: {
            priority: data.priority,
            updatedAt: new Date(),
          },
        });
        break;

      case 'delete':
        // Only SUPER_ADMIN can delete leads
        if (session.user.role !== 'SUPER_ADMIN') {
          return NextResponse.json(
            { error: 'Ei käyttöoikeutta poistaa liidejä' },
            { status: 403 }
          );
        }

        result = await prisma.contactSubmission.deleteMany({
          where: { id: { in: leadIds } },
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Tuntematon toiminto' },
          { status: 400 }
        );
    }

    // Log the bulk operation
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: `BULK_LEADS_${action.toUpperCase()}`,
        entity: 'contact_submission',
        metadata: {
          leadIds,
          action,
          data,
          affectedCount: result.count,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} liidiä päivitetty onnistuneesti`,
      affectedCount: result.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error in bulk lead operation:', error);
    return NextResponse.json(
      { error: 'Virhe massatoiminnossa' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}