import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { APIMonitoring } from '@/app/lib/middleware/monitoring';

export const POST = APIMonitoring.withMonitoring(
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
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: 'Nykyinen salasana ja uusi salasana ovat pakollisia' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'Uuden salasanan tulee olla vähintään 8 merkkiä pitkä' },
          { status: 400 }
        );
      }

      // Get current user
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Verify current password
      const currentPasswordHash = user.password || user.passwordHash || '';
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash);

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Nykyinen salasana on virheellinen' },
          { status: 400 }
        );
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      // Update password
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          password: newPasswordHash,
          passwordHash: newPasswordHash, // Update both fields for compatibility
        }
      });

      return NextResponse.json({
        message: 'Salasana vaihdettu onnistuneesti'
      });

    } catch (error) {
      console.error('Change password API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  '/api/customer/change-password'
);