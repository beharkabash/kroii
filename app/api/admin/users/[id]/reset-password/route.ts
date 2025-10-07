import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Generate a secure random password
 */
function generateSecurePassword(length = 12): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

/**
 * POST /api/admin/users/[id]/reset-password
 * Reset user password (requires SUPER_ADMIN role)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Ei käyttöoikeutta nollata salasanoja' },
        { status: 403 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Käyttäjää ei löytynyt' },
        { status: 404 }
      );
    }

    // Generate new temporary password
    const temporaryPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    // Update user's password
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
        // Reset email verification to force re-verification if needed
        emailVerified: null,
      },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'PASSWORD_RESET',
        entity: 'user',
        entityId: id,
        metadata: {
          targetUserEmail: existingUser.email,
          resetBy: session.user.email,
        },
      },
    });

    // In a real application, you would send this password via email
    // For now, we'll return it in the response (not recommended for production)
    return NextResponse.json({
      success: true,
      message: 'Salasana nollattu onnistuneesti',
      temporaryPassword, // In production, this should be sent via email instead
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Virhe nollatessa salasanaa' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}