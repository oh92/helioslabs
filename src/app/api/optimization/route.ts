import { NextResponse } from 'next/server';
import { mockOptimizationRuns } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockOptimizationRuns);
}
