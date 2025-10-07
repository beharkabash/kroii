import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/admin/leads/export
 * Export leads to CSV format
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

    // Parse query parameters for filtering
    const status = url.searchParams.get('status') || '';
    const priority = url.searchParams.get('priority') || '';
    const assignedTo = url.searchParams.get('assignedTo') || '';
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const format = url.searchParams.get('format') || 'csv';

    // Build where clause for filtering
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (priority && priority !== 'ALL') {
      where.priority = priority;
    }

    if (assignedTo && assignedTo !== 'ALL') {
      if (assignedTo === 'UNASSIGNED') {
        where.assignedToId = null;
      } else {
        where.assignedToId = assignedTo;
      }
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    // Role-based filtering
    if (session.user.role === 'ADMIN') {
      where.OR = [
        { assignedToId: session.user.id },
        { assignedToId: null },
      ];
    }

    // Get leads for export
    const leads = await prisma.contactSubmission.findMany({
      where,
      include: {
        car: {
          select: {
            name: true,
            brand: true,
            model: true,
            year: true,
            priceEur: true,
          },
        },
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
        notes: {
          select: {
            note: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'json') {
      // Return JSON format
      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: 'EXPORT_DATA',
          entity: 'contact_submission',
          metadata: {
            exportType: 'json',
            recordCount: leads.length,
            filters: { status, priority, assignedTo, dateFrom, dateTo },
          },
        },
      });

      return NextResponse.json({
        success: true,
        leads,
        exportInfo: {
          exportedAt: new Date().toISOString(),
          recordCount: leads.length,
          exportedBy: session.user.email,
        },
      });
    }

    // Generate CSV content
    const csvHeaders = [
      'ID',
      'Nimi',
      'Sähköposti',
      'Puhelin',
      'Viesti',
      'Pisteet',
      'Status',
      'Prioriteetti',
      'Lähde',
      'Osoitettu',
      'Auto',
      'Luotu',
      'Päivitetty',
      'Viimeisin huomautus',
    ];

    const csvRows = leads.map(lead => [
      lead.id,
      lead.name,
      lead.email,
      lead.phone || '',
      lead.message.replace(/"/g, '""'), // Escape quotes
      lead.leadScore,
      lead.status,
      lead.priority,
      lead.source,
      lead.assignedTo?.name || 'Ei osoitettu',
      lead.car ? `${lead.car.brand} ${lead.car.model} (${lead.car.year})` : '',
      new Date(lead.createdAt).toLocaleDateString('fi-FI'),
      new Date(lead.updatedAt).toLocaleDateString('fi-FI'),
      lead.notes[0]?.note.substring(0, 100) || '',
    ]);

    // Build CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row =>
        row.map(cell =>
          typeof cell === 'string' && cell.includes(',')
            ? `"${cell}"`
            : cell
        ).join(',')
      ),
    ].join('\n');

    // Log the export
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'EXPORT_DATA',
        entity: 'contact_submission',
        metadata: {
          exportType: 'csv',
          recordCount: leads.length,
          filters: { status, priority, assignedTo, dateFrom, dateTo },
        },
      },
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `liidit_${timestamp}.csv`;

    // Return CSV response
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { error: 'Virhe vietäessä liidejä' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}