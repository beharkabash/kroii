import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for user updates
const updateUserSchema = z.object({
  name: z.string().min(1, 'Nimi on pakollinen').optional(),
  email: z.string().email('Virheellinen sähköpostiosoite').optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'VIEWER']).optional(),
});

/**
 * GET /api/admin/users/[id]
 * Get specific user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
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
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Käyttäjää ei löytynyt' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Virhe ladattaessa käyttäjää' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update user information (requires SUPER_ADMIN role or updating own profile)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta' },
        { status: 401 }
      );
    }

    // Check permissions: SUPER_ADMIN can edit anyone, others can only edit themselves
    const canEdit = session.user.role === 'SUPER_ADMIN' || session.user.id === id;

    if (!canEdit) {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta muokata tätä käyttäjää' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // If changing role, only SUPER_ADMIN can do it
    if (validatedData.role && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta muuttaa roolia' },
        { status: 403 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Käyttäjää ei löytynyt' },
        { status: 404 }
      );
    }

    // If changing email, check it's not already taken
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Sähköpostiosoite on jo käytössä' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'USER_UPDATED',
        entity: 'user',
        entityId: id,
        metadata: {
          updatedFields: Object.keys(validatedData),
          targetUserId: id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Käyttäjä päivitetty onnistuneesti',
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Virhe päivittäessä käyttäjää' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete user (requires SUPER_ADMIN role, cannot delete self)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta poistaa käyttäjiä' },
        { status: 403 }
      );
    }

    // Cannot delete self
    if (session.user.id === id) {
      return NextResponse.json(
        { error: 'Et voi poistaa omaa käyttäjätiliäsi' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        assignedLeads: true,
        contactNotes: true,
        activityLogs: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Käyttäjää ei löytynyt' },
        { status: 404 }
      );
    }

    // Check if user has assigned leads or other dependencies
    if (existingUser.assignedLeads.length > 0) {
      return NextResponse.json(
        {
          error: 'Käyttäjällä on olemassa olevia liidejä. Siirrä ne ensin toiselle käyttäjälle.',
          hasAssignedLeads: true,
          assignedLeadsCount: existingUser.assignedLeads.length,
        },
        { status: 400 }
      );
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'USER_DELETED',
        entity: 'user',
        entityId: id,
        metadata: {
          deletedUserEmail: existingUser.email,
          deletedUserRole: existingUser.role,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Käyttäjä poistettu onnistuneesti',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Virhe poistaessa käyttäjää' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}