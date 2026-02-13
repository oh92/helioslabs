import { NextRequest, NextResponse } from 'next/server';
import { mockEquityData } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '30', 10);

  // Filter equity data to the requested number of days
  const data = mockEquityData.slice(-days);
  return NextResponse.json(data);
}
