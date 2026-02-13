import { NextResponse } from 'next/server';
import { mockSystemHealth } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockSystemHealth);
}
