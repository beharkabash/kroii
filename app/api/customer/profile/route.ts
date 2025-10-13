import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db/prisma';
import { APIMonitoring } from '@/app/lib/middleware/monitoring';

type CommunicationPreferences = {
  email?: boolean;
  sms?: boolean;
  whatsapp?: boolean;
  inventory_alerts?: boolean;
  marketing?: boolean;
  newsletter?: boolean;
};

type CustomerUpdateData = {
  phone?: string | null;
  communication_preferences?: CommunicationPreferences;
};

export const GET = APIMonitoring.withMonitoring(
  async (_request: NextRequest) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || session.user?.role !== 'CUSTOMER') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Get user data
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true
        }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Get customer data for preferences
      const customer = await prisma.customers.findUnique({
        where: { email: user.email },
        select: {
          phone: true,
          communication_preferences: true,
          created_at: true
        }
      });

      // Get stats
      const [favoriteCount, inquiryCount, alertCount] = await Promise.all([
        prisma.favorites.count({
          where: { userId: session.user.id }
        }),
        prisma.vehicle_inquiries.count({
          where: { email: user.email }
        }),
        prisma.inventory_alerts.count({
          where: { email: user.email, isActive: true }
        })
      ]);

      // Default preferences if not set
      const defaultPreferences = {
        emailNotifications: true,
        smsNotifications: false,
        whatsappNotifications: false,
        inventoryAlerts: true,
        marketingEmails: false,
        newsletter: false
      };

      const customerPrefs = customer?.communication_preferences as CommunicationPreferences | null;
      const preferences = {
        emailNotifications: customerPrefs?.email ?? defaultPreferences.emailNotifications,
        smsNotifications: customerPrefs?.sms ?? defaultPreferences.smsNotifications,
        whatsappNotifications: customerPrefs?.whatsapp ?? defaultPreferences.whatsappNotifications,
        inventoryAlerts: customerPrefs?.inventory_alerts ?? defaultPreferences.inventoryAlerts,
        marketingEmails: customerPrefs?.marketing ?? defaultPreferences.marketingEmails,
        newsletter: customerPrefs?.newsletter ?? defaultPreferences.newsletter
      };

      const profile = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phone: customer?.phone || '',
        preferences,
        stats: {
          joinedAt: (customer?.created_at || user.createdAt).toISOString(),
          favoriteCount,
          inquiryCount,
          alertCount
        }
      };

      return NextResponse.json({ profile });

    } catch (error) {
      console.error('Profile API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  '/api/customer/profile'
);

export const PUT = APIMonitoring.withMonitoring(
  async (request: NextRequest) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || session.user?.role !== 'CUSTOMER') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const body = await request.json();
      const { firstName, lastName, email, phone, preferences } = body;

      // Get current user data
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update user table
      if (firstName !== undefined || lastName !== undefined || email !== undefined) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
            ...(email !== undefined && { email }),
            ...((firstName !== undefined || lastName !== undefined) && {
              name: `${firstName || user.firstName} ${lastName || user.lastName}`.trim()
            })
          }
        });
      }

      // Update customer table
      const updateData: CustomerUpdateData = {};
      if (phone !== undefined) updateData.phone = phone || null;
      if (preferences !== undefined) {
        updateData.communication_preferences = {
          email: preferences.emailNotifications,
          sms: preferences.smsNotifications,
          whatsapp: preferences.whatsappNotifications,
          inventory_alerts: preferences.inventoryAlerts,
          marketing: preferences.marketingEmails,
          newsletter: preferences.newsletter
        };
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.customers.update({
          where: { email: user.email },
          data: updateData
        });
      }

      return NextResponse.json({
        message: 'Profile updated successfully'
      });

    } catch (error) {
      console.error('Profile update API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  '/api/customer/profile'
);