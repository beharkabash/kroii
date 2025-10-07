import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/admin/users/[id]/activities
 * Get activity logs for a specific user
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

    // Get query parameters for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Käyttäjää ei löytynyt' },
        { status: 404 }
      );
    }

    // Get activity logs for this user
    const [activities, totalCount] = await Promise.all([
      prisma.activityLog.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.activityLog.count({
        where: { userId: id },
      }),
    ]);

    // Format activities for display
    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      action: activity.action,
      entity: activity.entity,
      entityId: activity.entityId,
      createdAt: activity.createdAt,
      metadata: activity.metadata,
      description: getActivityDescription(activity),
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
      user,
    });
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return NextResponse.json(
      { error: 'Virhe ladattaessa käyttäjän aktiviteetteja' },
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
  const { action, entity, metadata } = activity;

  switch (action) {
    case 'USER_LOGIN':
      return 'Kirjautui sisään';

    case 'USER_CREATED':
      return `Loi uuden käyttäjän: ${metadata?.createdUserEmail || 'tuntematon'}`;

    case 'USER_UPDATED':
      const fields = metadata?.updatedFields?.join(', ') || 'tietoja';
      return `Päivitti käyttäjän ${fields}`;

    case 'USER_DELETED':
      return `Poisti käyttäjän: ${metadata?.deletedUserEmail || 'tuntematon'}`;

    case 'PASSWORD_RESET':
      return `Nollasi käyttäjän salasanan: ${metadata?.targetUserEmail || 'tuntematon'}`;

    case 'CAR_CREATED':
      return `Lisäsi uuden auton: ${metadata?.carName || metadata?.carBrand || 'tuntematon'}`;

    case 'CAR_UPDATED':
      return `Päivitti autoa: ${metadata?.carName || 'tuntematon'}`;

    case 'CAR_DELETED':
      return `Poisti auton: ${metadata?.carName || 'tuntematon'}`;

    case 'LEAD_CREATED':
      return `Loi uuden liidin: ${metadata?.leadEmail || 'tuntematon'}`;

    case 'LEAD_UPDATED':
      return `Päivitti liidiä: ${metadata?.leadEmail || 'tuntematon'}`;

    case 'LEAD_ASSIGNED':
      return `Osoitti liidin: ${metadata?.leadEmail || 'tuntematon'}`;

    case 'EMAIL_SENT':
      return `Lähetti sähköpostin: ${metadata?.recipient || 'tuntematon'}`;

    case 'SYSTEM_CONFIG_UPDATED':
      return `Päivitti järjestelmäasetuksia: ${metadata?.configKey || 'tuntematon'}`;

    case 'LOGIN_FAILED':
      return 'Epäonnistunut kirjautumisyritys';

    case 'EXPORT_DATA':
      return `Vei dataa: ${metadata?.exportType || 'tuntematon'}`;

    case 'IMPORT_DATA':
      return `Toi dataa: ${metadata?.importType || 'tuntematon'}`;

    default:
      return `${action} - ${entity}`;
  }
}