import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for adding notes
const addNoteSchema = z.object({
  note: z.string().min(1, 'Huomautus ei voi olla tyhjä').max(2000, 'Huomautus on liian pitkä'),
});

/**
 * GET /api/admin/leads/[id]/notes
 * Get all notes for a specific lead
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

    // Check if lead exists and user has permission
    const lead = await prisma.contactSubmission.findUnique({
      where: { id },
      select: {
        id: true,
        assignedToId: true,
        email: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Liidiä ei löytynyt' },
        { status: 404 }
      );
    }

    // Check permissions
    if (session.user.role === 'ADMIN') {
      if (lead.assignedToId !== session.user.id && lead.assignedToId !== null) {
        return NextResponse.json(
          { error: 'Ei käyttöoikeutta tähän liidiin' },
          { status: 403 }
        );
      }
    }

    // Get all notes for the lead
    const notes = await prisma.contactNote.findMany({
      where: { contactId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error('Error fetching lead notes:', error);
    return NextResponse.json(
      { error: 'Virhe ladattaessa huomautuksia' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST /api/admin/leads/[id]/notes
 * Add a new note to a specific lead
 */
export async function POST(
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

    const body = await request.json();
    const { note } = addNoteSchema.parse(body);

    // Check if lead exists and user has permission
    const lead = await prisma.contactSubmission.findUnique({
      where: { id },
      select: {
        id: true,
        assignedToId: true,
        email: true,
        name: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Liidiä ei löytynyt' },
        { status: 404 }
      );
    }

    // Check permissions (ADMIN can only add notes to their assigned leads or unassigned)
    if (session.user.role === 'ADMIN') {
      if (lead.assignedToId !== session.user.id && lead.assignedToId !== null) {
        return NextResponse.json(
          { error: 'Ei käyttöoikeutta lisätä huomautuksia tähän liidiin' },
          { status: 403 }
        );
      }
    }

    // Create the note
    const newNote = await prisma.contactNote.create({
      data: {
        contactId: id,
        userId: session.user.id,
        note,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Log activity for the note
    await prisma.contactActivity.create({
      data: {
        contactId: id,
        type: 'NOTE_ADDED',
        description: `Huomautus lisätty: ${note.substring(0, 100)}${note.length > 100 ? '...' : ''}`,
        metadata: {
          noteId: newNote.id,
          addedBy: session.user.id,
          notePreview: note.substring(0, 200),
        },
      },
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'NOTE_ADDED_TO_LEAD',
        entity: 'contact_note',
        entityId: newNote.id,
        metadata: {
          leadId: id,
          leadEmail: lead.email,
          notePreview: note.substring(0, 200),
        },
      },
    });

    // Update lead's updatedAt timestamp
    await prisma.contactSubmission.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: 'Huomautus lisätty onnistuneesti',
      note: newNote,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error adding note to lead:', error);
    return NextResponse.json(
      { error: 'Virhe lisätessä huomautusta' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}