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

      const userEmail = session.user.email!;

      // Get customer data
      const customer = await prisma.customers.findUnique({
        where: { email: userEmail }
      });

      if (!customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }

      // Get stats
      const [
        favoriteCount,
        savedSearchCount,
        inquiryCount,
        alertCount
      ] = await Promise.all([
        prisma.favorites.count({
          where: { userId: session.user.id }
        }),
        prisma.saved_searches.count({
          where: { userId: session.user.id, isActive: true }
        }),
        prisma.vehicle_inquiries.count({
          where: { email: userEmail }
        }),
        prisma.inventory_alerts.count({
          where: { email: userEmail, isActive: true }
        })
      ]);

      // Get recent favorites (last 5)
      const recentFavorites = await prisma.favorites.findMany({
        where: { userId: session.user.id },
        include: {
          vehicles: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              price: true,
              images: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      // Get recent inquiries (last 5)
      const recentInquiries = await prisma.vehicle_inquiries.findMany({
        where: { email: userEmail },
        include: {
          vehicles: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      // Get recommendations based on favorites and viewed cars
      const viewedVehicles = await prisma.recently_viewed.findMany({
        where: { userId: session.user.id },
        include: {
          vehicles: {
            select: {
              make: true,
              bodyType: true,
              price: true,
              fuelType: true
            }
          }
        },
        orderBy: { viewedAt: 'desc' },
        take: 10
      });

      // Simple recommendation algorithm based on viewed/favorited car characteristics
      const userPreferences = {
        makes: new Set<string>(),
        bodyTypes: new Set<string>(),
        fuelTypes: new Set<string>(),
        avgPrice: 0
      };

      let totalPrice = 0;
      let priceCount = 0;

      // Analyze preferences from favorites and views
      recentFavorites.forEach(fav => {
        if (fav.vehicles) {
          userPreferences.makes.add(fav.vehicles.make);
          totalPrice += fav.vehicles.price;
          priceCount++;
        }
      });

      viewedVehicles.forEach(view => {
        if (view.vehicles) {
          userPreferences.makes.add(view.vehicles.make);
          userPreferences.bodyTypes.add(view.vehicles.bodyType);
          userPreferences.fuelTypes.add(view.vehicles.fuelType);
          totalPrice += view.vehicles.price;
          priceCount++;
        }
      });

      userPreferences.avgPrice = priceCount > 0 ? totalPrice / priceCount : 25000;

      // Get recommendations
      const recommendations = await prisma.vehicles.findMany({
        where: {
          status: 'AVAILABLE',
          OR: [
            { make: { in: Array.from(userPreferences.makes) } },
            { bodyType: { in: Array.from(userPreferences.bodyTypes) } },
            { fuelType: { in: Array.from(userPreferences.fuelTypes) } },
            {
              price: {
                gte: userPreferences.avgPrice * 0.8,
                lte: userPreferences.avgPrice * 1.2
              }
            }
          ],
          NOT: {
            id: {
              in: recentFavorites.map(fav => fav.vehicleId)
            }
          }
        },
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          price: true,
          images: true,
          bodyType: true,
          fuelType: true
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      });

      // Get active alerts
      const alerts = await prisma.inventory_alerts.findMany({
        where: { email: userEmail, isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      // Format the response
      const dashboardData = {
        stats: {
          favoriteCount,
          savedSearchCount,
          inquiryCount,
          alertCount
        },
        recentFavorites: recentFavorites.map(fav => ({
          id: fav.vehicles?.id || '',
          name: fav.vehicles ? `${fav.vehicles.make} ${fav.vehicles.model} ${fav.vehicles.year}` : 'Tuntematon auto',
          price: fav.vehicles?.price || 0,
          image: fav.vehicles?.images ? JSON.parse(fav.vehicles.images)[0] || '/images/placeholder-car.jpg' : '/images/placeholder-car.jpg',
          addedAt: fav.createdAt.toISOString()
        })),
        recentInquiries: recentInquiries.map(inquiry => ({
          id: inquiry.id,
          vehicleName: inquiry.vehicles ? `${inquiry.vehicles.make} ${inquiry.vehicles.model} ${inquiry.vehicles.year}` : 'Tuntematon auto',
          message: inquiry.message || 'Yleinen yhteydenotto',
          status: inquiry.status,
          createdAt: inquiry.createdAt.toISOString()
        })),
        recommendations: recommendations.map(rec => {
          let reason = 'Suosittu valinta';
          if (userPreferences.makes.has(rec.make)) {
            reason = `Samankaltainen kuin katselemasi ${rec.make} autot`;
          } else if (Math.abs(rec.price - userPreferences.avgPrice) / userPreferences.avgPrice < 0.2) {
            reason = 'Sopii budjettiisi';
          }

          return {
            id: rec.id,
            name: `${rec.make} ${rec.model} ${rec.year}`,
            price: rec.price,
            image: rec.images ? JSON.parse(rec.images)[0] || '/images/placeholder-car.jpg' : '/images/placeholder-car.jpg',
            reason
          };
        }),
        alerts: alerts.map(alert => ({
          id: alert.id,
          message: `Uusi ${alert.vehicleMake || 'auto'} ${alert.vehicleModel || ''} vastaa hakukriteereitäsi`.trim(),
          type: 'inventory',
          createdAt: alert.createdAt.toISOString()
        }))
      };

      return NextResponse.json(dashboardData);

    } catch (error) {
      console.error('Dashboard API error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  },
  '/api/customer/dashboard'
);