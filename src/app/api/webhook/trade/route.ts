import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Validate webhook secret
  const webhookSecret = request.headers.get('X-Webhook-Secret');
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!expectedSecret || webhookSecret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const tradeData = await request.json();

    // Log the incoming trade data (actual DB write will come later)
    console.log('[Webhook] Received trade data:', JSON.stringify(tradeData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Trade data received',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Webhook] Error processing trade data:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
