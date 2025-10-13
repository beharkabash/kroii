import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/db/prisma';
import { APIMonitoring } from '@/app/lib/middleware/monitoring';

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

      const favorites = await prisma.favorites.findMany({
        where: { userId: session.user.id },
        include: {
          vehicles: {
            select: {
              id: true,
              slug: true,
              make: true,
              model: true,
              year: true,
              price: true,
              mileage: true,
              fuelType: true,
              transmission: true,
              bodyType: true,
              color: true,
              images: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const formattedFavorites = favorites.map(fav => ({
        id: fav.id,
        vehicleId: fav.vehicleId,
        addedAt: fav.createdAt.toISOString(),
        vehicle: fav.vehicles
      }));

      return NextResponse.json({
        favorites: formattedFavorites,
        count: favorites.length
      });

    } catch (error) {
      console.error('Favorites API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  '/api/customer/favorites'
);

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
      const { vehicleId } = body;

      if (!vehicleId) {
        return NextResponse.json(
          { error: 'Vehicle ID is required' },
          { status: 400 }
        );
      }

      // Check if vehicle exists
      const vehicle = await prisma.vehicles.findUnique({
        where: { id: vehicleId }
      });

      if (!vehicle) {
        return NextResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        );
      }

      // Check if already favorited
      const existingFavorite = await prisma.favorites.findFirst({
        where: {
          userId: session.user.id,
          vehicleId: vehicleId
        }
      });

      if (existingFavorite) {
        return NextResponse.json(
          { error: 'Vehicle already in favorites' },
          { status: 409 }
        );
      }

      // Add to favorites
      const favorite = await prisma.favorites.create({
        data: {
          id: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: session.user.id,
          vehicleId: vehicleId
        },
        include: {
          vehicles: {
            select: {
              id: true,
              slug: true,
              make: true,
              model: true,
              year: true,
              price: true,
              images: true
            }
          }
        }
      });

      return NextResponse.json({
        message: 'Vehicle added to favorites',
        favorite: {
          id: favorite.id,
          vehicleId: favorite.vehicleId,
          addedAt: favorite.createdAt.toISOString(),
          vehicle: favorite.vehicles
        }
      }, { status: 201 });

    } catch (error) {
      console.error('Add favorite API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  '/api/customer/favorites'
);