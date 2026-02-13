import { NextResponse } from 'next/server';
import { mockPerformance } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockPerformance);
}
