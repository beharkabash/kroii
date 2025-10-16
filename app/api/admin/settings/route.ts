import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/core/auth';

/**
 * Stub route - CRM functionality not yet implemented
 * Returns empty data to allow build to complete
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    return NextResponse.json(
      { error: 'Ei käyttöoikeutta' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    data: [],
    message: 'CRM functionality coming soon'
  });
}

export async function POST() {
  return GET();
}

export async function PUT() {
  return GET();
}

export async function DELETE() {
  return GET();
}
