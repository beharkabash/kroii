import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals API]', body);
    }
    
    // In production, you would send this to your analytics service
    // Example: await sendToAnalytics(body);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Web Vitals API Error]', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
