import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/db/prisma';
import { APIMonitoring } from '@/app/lib/middleware/monitoring';

export const POST = APIMonitoring.withMonitoring(
  async (request: NextRequest) => {
    try {
      const body = await request.json();
      const { firstName, lastName, email, phone, password, subscribeLiveChat } = body;

      // Validation
      if (!firstName || !lastName || !email || !password) {
        return NextResponse.json(
          { error: 'Kaikki pakolliset kentät tulee täyttää' },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Salasanan tulee olla vähintään 8 merkkiä pitkä' },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Virheellinen sähköpostiosoite' },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Sähköpostiosoite on jo rekisteröity' },
          { status: 409 }
        );
      }

      // Check customer table too
      const existingCustomer = await prisma.customers.findUnique({
        where: { email }
      });

      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Sähköpostiosoite on jo rekisteröity' },
          { status: 409 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user in both tables for authentication compatibility
      const user = await prisma.user.create({
        data: {
          email,
          username: email, // Use email as username
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          password: hashedPassword,
          role: 'CUSTOMER',
          isActive: true,
          emailVerified: new Date(), // Auto-verify for now
        }
      });

      // Create customer record with additional preferences
      const _customer = await prisma.customers.create({
        data: {
          id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          status: 'ACTIVE',
          customer_type: 'INDIVIDUAL',
          preferred_language: 'fi',
          communication_preferences: {
            email: true,
            sms: !!phone,
            whatsapp: !!phone,
            inventory_alerts: subscribeLiveChat,
            marketing: subscribeLiveChat,
          },
          metadata: {
            registered_via: 'customer_portal',
            ip_address: request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       'unknown',
            user_agent: request.headers.get('user-agent') || 'unknown',
          }
        }
      });

      return NextResponse.json({
        message: 'Asiakastili luotu onnistuneesti',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }, { status: 201 });

    } catch (error) {
      console.error('Customer registration error:', error);

      return NextResponse.json(
        { error: 'Palvelinvirhe. Yritä myöhemmin uudelleen.' },
        { status: 500 }
      );
    }
  },
  '/api/customer/register'
);