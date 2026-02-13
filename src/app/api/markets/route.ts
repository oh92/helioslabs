import { NextResponse } from 'next/server';
import { mockMarkets } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockMarkets);
}
