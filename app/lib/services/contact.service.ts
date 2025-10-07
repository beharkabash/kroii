/**
 * Contact & Lead Service Layer
 * Handles contact form submissions and lead management
 */

import { PrismaClient, ContactSubmission, LeadStatus, LeadPriority, ActivityType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  leadScore?: number;
  source?: string;
  carId?: string;
  ip?: string;
  userAgent?: string;
}

export interface UpdateContactInput {
  id: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  assignedToId?: string;
}

export interface ContactFilters {
  status?: LeadStatus;
  priority?: LeadPriority;
  assignedToId?: string;
  carId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Create contact submission
 */
export async function createContactSubmission(input: CreateContactInput): Promise<ContactSubmission> {
  try {
    const contact = await prisma.contactSubmission.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        leadScore: input.leadScore || 0,
        source: input.source || 'contact_form',
        carId: input.carId,
        ip: input.ip,
        userAgent: input.userAgent,
        status: LeadStatus.NEW,
        priority: calculatePriority(input.leadScore || 0),
      },
    });

    // Log activity
    await logActivity(contact.id, ActivityType.EMAIL_SENT, 'Contact form submitted');

    // TODO: Invalidate cache when redis is properly configured
    // await redis.delPattern('contacts:*');

    return contact;
  } catch (error) {
    console.error('[CONTACT SERVICE] Error creating contact:', error);
    throw new Error('Failed to create contact submission');
  }
}

/**
 * Get contact by ID
 */
export async function getContactById(id: string) {
  try {
    return await prisma.contactSubmission.findUnique({
      where: { id },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            slug: true,
            brand: true,
            model: true,
            priceEur: true,
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
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        activities: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  } catch (error) {
    console.error('[CONTACT SERVICE] Error getting contact:', error);
    throw new Error('Failed to fetch contact');
  }
}

/**
 * List contacts with filters
 */
export async function listContacts(filters: ContactFilters = {}) {
  try {
    const {
      status,
      priority,
      assignedToId,
      carId,
      dateFrom,
      dateTo,
      limit = 50,
      offset = 0,
    } = filters;

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedToId) where.assignedToId = assignedToId;
    if (carId) where.carId = carId;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) (where.createdAt as Record<string, unknown>).gte = dateFrom;
      if (dateTo) (where.createdAt as Record<string, unknown>).lte = dateTo;
    }

    const contacts = await prisma.contactSubmission.findMany({
      where,
      include: {
        car: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            notes: true,
            activities: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { leadScore: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    });

    return contacts;
  } catch (error) {
    console.error('[CONTACT SERVICE] Error listing contacts:', error);
    throw new Error('Failed to fetch contacts');
  }
}

/**
 * Update contact status
 */
export async function updateContact(input: UpdateContactInput) {
  try {
    const { id, ...data } = input;

    const contact = await prisma.contactSubmission.update({
      where: { id },
      data,
    });

    // Log activity
    if (data.status) {
      await logActivity(id, ActivityType.STATUS_CHANGED, `Status changed to ${data.status}`);
    }

    // TODO: Invalidate cache when redis is properly configured
    // await redis.delPattern('contacts:*');

    return contact;
  } catch (error) {
    console.error('[CONTACT SERVICE] Error updating contact:', error);
    throw new Error('Failed to update contact');
  }
}

/**
 * Add note to contact
 */
export async function addContactNote(contactId: string, userId: string, note: string) {
  try {
    const contactNote = await prisma.contactNote.create({
      data: {
        contactId,
        userId,
        note,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await logActivity(contactId, ActivityType.NOTE_ADDED, 'Note added to contact');

    return contactNote;
  } catch (error) {
    console.error('[CONTACT SERVICE] Error adding note:', error);
    throw new Error('Failed to add note');
  }
}

/**
 * Log contact activity
 */
export async function logActivity(
  contactId: string,
  type: ActivityType,
  description: string,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.contactActivity.create({
      data: {
        contactId,
        type,
        description,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    console.error('[CONTACT SERVICE] Error logging activity:', error);
    // Don't throw - activity logging is non-critical
  }
}

/**
 * Get contact statistics
 */
export async function getContactStats() {
  try {
    const [
      total,
      newLeads,
      contacted,
      qualified,
      converted,
      avgResponseTime,
    ] = await Promise.all([
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { status: LeadStatus.NEW } }),
      prisma.contactSubmission.count({ where: { status: LeadStatus.CONTACTED } }),
      prisma.contactSubmission.count({ where: { status: LeadStatus.QUALIFIED } }),
      prisma.contactSubmission.count({ where: { status: LeadStatus.CONVERTED } }),
      calculateAvgResponseTime(),
    ]);

    return {
      total,
      byStatus: {
        new: newLeads,
        contacted,
        qualified,
        converted,
      },
      avgResponseTime,
    };
  } catch (error) {
    console.error('[CONTACT SERVICE] Error getting stats:', error);
    return null;
  }
}

/**
 * Calculate average response time
 */
async function calculateAvgResponseTime(): Promise<number> {
  try {
    const contacts = await prisma.contactSubmission.findMany({
      where: {
        respondedAt: { not: null },
      },
      select: {
        createdAt: true,
        respondedAt: true,
      },
    });

    if (contacts.length === 0) return 0;

    const totalMinutes = contacts.reduce((sum, contact) => {
      if (!contact.respondedAt) return sum;
      const diff = contact.respondedAt.getTime() - contact.createdAt.getTime();
      return sum + diff / 1000 / 60; // Convert to minutes
    }, 0);

    return Math.round(totalMinutes / contacts.length);
  } catch (error) {
    console.error('[CONTACT SERVICE] Error calculating response time:', error);
    return 0;
  }
}

/**
 * Calculate priority based on lead score
 */
function calculatePriority(leadScore: number): LeadPriority {
  if (leadScore >= 80) return LeadPriority.URGENT;
  if (leadScore >= 60) return LeadPriority.HIGH;
  if (leadScore >= 40) return LeadPriority.MEDIUM;
  return LeadPriority.LOW;
}

/**
 * Get leads dashboard data
 */
export async function getLeadsDashboard() {
  try {
    const [stats, recentLeads, highPriorityLeads, conversionRate] = await Promise.all([
      getContactStats(),
      listContacts({ limit: 10 }),
      listContacts({ priority: LeadPriority.URGENT, limit: 5 }),
      calculateConversionRate(),
    ]);

    return {
      stats,
      recentLeads,
      highPriorityLeads,
      conversionRate,
    };
  } catch (error) {
    console.error('[CONTACT SERVICE] Error getting dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}

/**
 * Calculate conversion rate
 */
async function calculateConversionRate(): Promise<number> {
  try {
    const [total, converted] = await Promise.all([
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { status: LeadStatus.CONVERTED } }),
    ]);

    if (total === 0) return 0;
    return Math.round((converted / total) * 100);
  } catch (error) {
    console.error('[CONTACT SERVICE] Error calculating conversion rate:', error);
    return 0;
  }
}