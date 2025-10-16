import { NextRequest, NextResponse } from 'next/server';

/**
 * Contact Form API
 * Stub for contact submissions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // In production, this would save to database
    console.log('Contact form submission:', { name, email, phone, message });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
