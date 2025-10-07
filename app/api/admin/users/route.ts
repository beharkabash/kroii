import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, 'Nimi on pakollinen'),
  email: z.string().email('Virheellinen sähköpostiosoite'),
  password: z.string().min(8, 'Salasanan tulee olla vähintään 8 merkkiä'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'VIEWER']),
});

/**
 * GET /api/admin/users
 * Get all users (requires ADMIN or SUPER_ADMIN role)
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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        emailVerified: true,
        image: true,
      },
      orderBy: [
        { role: 'asc' }, // SUPER_ADMIN first, then ADMIN, then VIEWER
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Virhe ladattaessa käyttäjiä' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/admin/users
 * Create new user (requires SUPER_ADMIN role)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta käyttäjien luomiseen' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = createUserSchema.parse(body);

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Käyttäjä tällä sähköpostilla on jo olemassa' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'USER_CREATED',
        entity: 'user',
        entityId: user.id,
        metadata: {
          createdUserEmail: user.email,
          createdUserRole: user.role,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Käyttäjä luotu onnistuneesti',
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Virhe luodessa käyttäjää' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}