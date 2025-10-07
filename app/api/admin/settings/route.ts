import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for settings
const settingsSchema = z.object({
  // Business Information
  businessName: z.string().min(1, 'Yrityksen nimi on pakollinen'),
  businessDescription: z.string().optional(),
  contactEmail: z.string().email('Virheellinen sähköpostiosoite'),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  vatNumber: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),

  // Email Settings
  emailServiceEnabled: z.boolean(),
  emailFromName: z.string().min(1, 'Lähettäjän nimi on pakollinen'),
  emailFromAddress: z.string().email('Virheellinen sähköpostiosoite'),
  emailAutoResponderEnabled: z.boolean(),
  emailAutoResponderSubject: z.string().optional(),
  emailAutoResponderMessage: z.string().optional(),

  // Lead Management
  leadScoringEnabled: z.boolean(),
  leadAutoAssignmentEnabled: z.boolean(),
  leadHighPriorityThreshold: z.number().min(0).max(100),
  leadNotificationEmails: z.array(z.string().email()),

  // Website Settings
  siteTitle: z.string().min(1, 'Sivuston otsikko on pakollinen'),
  siteDescription: z.string().optional(),
  siteKeywords: z.string().optional(),
  analyticsEnabled: z.boolean(),
  maintenanceMode: z.boolean(),

  // Security Settings
  passwordMinLength: z.number().min(6).max(32),
  sessionTimeoutMinutes: z.number().min(5).max(10080),
  maxLoginAttempts: z.number().min(3).max(20),
  requireEmailVerification: z.boolean(),

  // Feature Flags
  newsletterEnabled: z.boolean(),
  chatbotEnabled: z.boolean(),
  appointmentBookingEnabled: z.boolean(),
  carComparisonEnabled: z.boolean(),
  socialMediaIntegrationEnabled: z.boolean(),

  // API Keys (optional for security)
  resendApiKey: z.string().optional(),
  sentryDsn: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
});

/**
 * GET /api/admin/settings
 * Get system configuration settings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta järjestelmäasetuksiin' },
        { status: 403 }
      );
    }

    // Get all system configuration from database
    const configs = await prisma.systemConfig.findMany();

    // Convert configs array to object for easier handling
    const settings: Record<string, any> = {};
    configs.forEach(config => {
      settings[config.key] = config.value;
    });

    // Mask sensitive API keys for security
    if (settings.resendApiKey) {
      settings.resendApiKey = maskApiKey(settings.resendApiKey as string);
    }
    if (settings.sentryDsn) {
      settings.sentryDsn = maskApiKey(settings.sentryDsn as string);
    }
    if (settings.googleAnalyticsId) {
      settings.googleAnalyticsId = maskApiKey(settings.googleAnalyticsId as string);
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Virhe ladattaessa asetuksia' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/admin/settings
 * Update system configuration settings
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta järjestelmäasetuksiin' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Handle masked API keys (don't update if they're still masked)
    if (body.resendApiKey && isMaskedApiKey(body.resendApiKey)) {
      delete body.resendApiKey;
    }
    if (body.sentryDsn && isMaskedApiKey(body.sentryDsn)) {
      delete body.sentryDsn;
    }
    if (body.googleAnalyticsId && isMaskedApiKey(body.googleAnalyticsId)) {
      delete body.googleAnalyticsId;
    }

    // Validate the settings
    const validatedSettings = settingsSchema.parse(body);

    // Update each setting in the database
    const updatePromises = Object.entries(validatedSettings).map(([key, value]) =>
      prisma.systemConfig.upsert({
        where: { key },
        update: {
          value: value as any,
          updatedAt: new Date(),
        },
        create: {
          key,
          value: value as any,
        },
      })
    );

    await Promise.all(updatePromises);

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'SYSTEM_CONFIG_UPDATED',
        entity: 'system_config',
        metadata: {
          updatedKeys: Object.keys(validatedSettings),
          updatedBy: session.user.email,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Asetukset tallennettu onnistuneesti',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Virhe tallentaessa asetuksia' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Mask sensitive API keys for display
 */
function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) {
    return '*'.repeat(apiKey.length);
  }

  // Show first 4 and last 4 characters, mask the middle
  const start = apiKey.substring(0, 4);
  const end = apiKey.substring(apiKey.length - 4);
  const middle = '*'.repeat(Math.max(0, apiKey.length - 8));

  return `${start}${middle}${end}`;
}

/**
 * Check if an API key is masked (contains asterisks)
 */
function isMaskedApiKey(apiKey: string): boolean {
  return apiKey.includes('*');
}