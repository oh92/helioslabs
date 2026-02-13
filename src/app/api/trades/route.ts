import { NextRequest, NextResponse } from 'next/server';
import { mockTrades } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const trades = mockTrades.slice(0, limit);
  return NextResponse.json(trades);
}
