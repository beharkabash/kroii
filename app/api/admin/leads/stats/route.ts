import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/admin/leads/stats
 * Get comprehensive lead statistics for dashboard
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
    const period = url.searchParams.get('period') || '30'; // days
    const periodDays = parseInt(period);

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - periodDays);

    // Base where clause for role-based filtering
    const baseWhere: any = {};
    if (session.user.role === 'ADMIN') {
      baseWhere.OR = [
        { assignedToId: session.user.id },
        { assignedToId: null },
      ];
    }

    // Get overall statistics
    const [
      totalLeads,
      newLeads,
      activeLeads,
      convertedLeads,
      averageScore,
      statusDistribution,
      priorityDistribution,
      sourceDistribution,
      assignmentDistribution,
      dailyStats,
      topPerformers,
      recentActivity,
    ] = await Promise.all([
      // Total leads
      prisma.contactSubmission.count({ where: baseWhere }),

      // New leads in period
      prisma.contactSubmission.count({
        where: {
          ...baseWhere,
          createdAt: { gte: startDate },
        },
      }),

      // Active leads (not closed)
      prisma.contactSubmission.count({
        where: {
          ...baseWhere,
          status: { notIn: ['CONVERTED', 'LOST', 'SPAM'] },
        },
      }),

      // Converted leads in period
      prisma.contactSubmission.count({
        where: {
          ...baseWhere,
          status: 'CONVERTED',
          closedAt: { gte: startDate },
        },
      }),

      // Average lead score
      prisma.contactSubmission.aggregate({
        where: baseWhere,
        _avg: { leadScore: true },
      }),

      // Status distribution
      prisma.contactSubmission.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: { status: true },
      }),

      // Priority distribution
      prisma.contactSubmission.groupBy({
        by: ['priority'],
        where: baseWhere,
        _count: { priority: true },
      }),

      // Source distribution
      prisma.contactSubmission.groupBy({
        by: ['source'],
        where: baseWhere,
        _count: { source: true },
      }),

      // Assignment distribution
      prisma.contactSubmission.groupBy({
        by: ['assignedToId'],
        where: baseWhere,
        _count: { assignedToId: true },
      }),

      // Daily statistics for the period
      prisma.$queryRaw`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as leads,
          AVG(lead_score) as avg_score,
          COUNT(CASE WHEN status = 'CONVERTED' THEN 1 END) as conversions
        FROM contact_submissions
        WHERE created_at >= ${startDate}
          ${session.user.role === 'ADMIN' ?
            prisma.$queryRaw`AND (assigned_to_id = ${session.user.id} OR assigned_to_id IS NULL)` :
            prisma.$queryRaw``
          }
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `,

      // Top performing users (if SUPER_ADMIN)
      session.user.role === 'SUPER_ADMIN' ? prisma.$queryRaw`
        SELECT
          u.id,
          u.name,
          u.email,
          COUNT(cs.id) as total_leads,
          COUNT(CASE WHEN cs.status = 'CONVERTED' THEN 1 END) as conversions,
          AVG(cs.lead_score) as avg_score
        FROM users u
        LEFT JOIN contact_submissions cs ON u.id = cs.assigned_to_id
        WHERE cs.created_at >= ${startDate} OR cs.created_at IS NULL
        GROUP BY u.id, u.name, u.email
        HAVING COUNT(cs.id) > 0
        ORDER BY conversions DESC, total_leads DESC
        LIMIT 10
      ` : Promise.resolve([]),

      // Recent activity summary
      prisma.contactActivity.findMany({
        where: {
          createdAt: { gte: startDate },
          contact: baseWhere,
        },
        select: {
          type: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    // Calculate conversion rate
    const conversionRate = newLeads > 0 ? (convertedLeads / newLeads) * 100 : 0;

    // Process status distribution
    const statusStats = statusDistribution.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    // Process priority distribution
    const priorityStats = priorityDistribution.reduce((acc, stat) => {
      acc[stat.priority] = stat._count.priority;
      return acc;
    }, {} as Record<string, number>);

    // Process source distribution
    const sourceStats = sourceDistribution.reduce((acc, stat) => {
      acc[stat.source] = stat._count.source;
      return acc;
    }, {} as Record<string, number>);

    // Process assignment distribution
    const unassignedCount = assignmentDistribution.find(d => d.assignedToId === null)?._count.assignedToId || 0;
    const assignedCount = totalLeads - unassignedCount;

    // Process activity stats
    const activityStats = recentActivity.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate trends (comparison with previous period)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays);
    const previousPeriodEnd = startDate;

    const [prevNewLeads, prevConvertedLeads] = await Promise.all([
      prisma.contactSubmission.count({
        where: {
          ...baseWhere,
          createdAt: { gte: previousPeriodStart, lt: previousPeriodEnd },
        },
      }),
      prisma.contactSubmission.count({
        where: {
          ...baseWhere,
          status: 'CONVERTED',
          closedAt: { gte: previousPeriodStart, lt: previousPeriodEnd },
        },
      }),
    ]);

    const newLeadsTrend = prevNewLeads > 0 ? ((newLeads - prevNewLeads) / prevNewLeads) * 100 : 0;
    const conversionTrend = prevConvertedLeads > 0 ? ((convertedLeads - prevConvertedLeads) / prevConvertedLeads) * 100 : 0;

    return NextResponse.json({
      success: true,
      stats: {
        overview: {
          totalLeads,
          newLeads,
          activeLeads,
          convertedLeads,
          conversionRate: Math.round(conversionRate * 100) / 100,
          averageScore: Math.round((averageScore._avg.leadScore || 0) * 100) / 100,
          assignedCount,
          unassignedCount,
        },
        trends: {
          newLeadsTrend: Math.round(newLeadsTrend * 100) / 100,
          conversionTrend: Math.round(conversionTrend * 100) / 100,
        },
        distribution: {
          status: statusStats,
          priority: priorityStats,
          source: sourceStats,
          activity: activityStats,
        },
        dailyStats: (dailyStats as any[]).map(stat => ({
          date: stat.date,
          leads: Number(stat.leads),
          avgScore: Math.round(Number(stat.avg_score || 0) * 100) / 100,
          conversions: Number(stat.conversions),
        })),
        topPerformers: session.user.role === 'SUPER_ADMIN' ? (topPerformers as any[]).map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          totalLeads: Number(user.total_leads),
          conversions: Number(user.conversions),
          avgScore: Math.round(Number(user.avg_score || 0) * 100) / 100,
          conversionRate: Number(user.total_leads) > 0 ?
            Math.round((Number(user.conversions) / Number(user.total_leads)) * 10000) / 100 : 0,
        })) : null,
        period: {
          days: periodDays,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching lead statistics:', error);
    return NextResponse.json(
      { error: 'Virhe ladattaessa tilastoja' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}