import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db/prisma';
import { APIMonitoring } from '@/app/lib/middleware/monitoring';

export const DELETE = APIMonitoring.withMonitoring(
  async (request: NextRequest) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || session.user?.role !== 'CUSTOMER') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Extract id from URL path
      const url = new URL(request.url);
      const pathSegments = url.pathname.split('/');
      const favoriteId = pathSegments[pathSegments.length - 1];

      // Check if favorite exists and belongs to the user
      const favorite = await prisma.favorites.findFirst({
        where: {
          id: favoriteId,
          userId: session.user.id
        }
      });

      if (!favorite) {
        return NextResponse.json(
          { error: 'Favorite not found' },
          { status: 404 }
        );
      }

      // Delete the favorite
      await prisma.favorites.delete({
        where: { id: favoriteId }
      });

      return NextResponse.json({
        message: 'Favorite removed successfully'
      });

    } catch (error) {
      console.error('Delete favorite API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  '/api/customer/favorites/[id]'
);