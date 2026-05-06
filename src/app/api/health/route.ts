import { NextResponse } from 'next/server';
import { isTelegramAvailable, isAiAvailable, isSheetsAvailable, isMockMode } from '@/lib/env';

export async function GET() {
  const status = {
    telegram: isTelegramAvailable(),
    ai: isAiAvailable(),
    sheets: isSheetsAvailable(),
    mockMode: isMockMode(),
    allAvailable: isTelegramAvailable() && isAiAvailable() && isSheetsAvailable(),
  };

  return NextResponse.json({ success: true, ...status });
}
