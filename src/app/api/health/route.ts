import { NextResponse } from 'next/server';
import {
  isTelegramAvailable,
  isAiAvailable,
  isSheetsAvailable,
  isMockMode,
  config,
} from '@/lib/env';

export async function GET() {
  const sheetsUrl = config.sheets.spreadsheetId
    ? `https://docs.google.com/spreadsheets/d/${config.sheets.spreadsheetId}`
    : null;

  const status = {
    telegram: isTelegramAvailable(),
    ai: isAiAvailable(),
    sheets: isSheetsAvailable(),
    mockMode: isMockMode(),
    sheetsUrl,
    allAvailable: isTelegramAvailable() && isAiAvailable() && isSheetsAvailable(),
  };

  return NextResponse.json({ success: true, ...status });
}
