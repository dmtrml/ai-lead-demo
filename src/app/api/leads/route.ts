import { NextResponse } from 'next/server';
import { processLead, getStoredLeads } from '@/lib/leads';
import { readLeads } from '@/lib/sheets';
import { checkRateLimit, requireJsonContentType, requireSameOrigin } from '@/lib/api-guard';

const MAX_MSG_LENGTH = 4000;

function readOptionalString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const guardResponse = requireSameOrigin(request)
      ?? requireJsonContentType(request)
      ?? checkRateLimit(request, { keyPrefix: 'leads:post', maxRequests: 10, windowMs: 60_000 });

    if (guardResponse) return guardResponse;

    const body = await request.json();
    const { message, source, name, contact } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 },
      );
    }

    const trimmed = message.trim().length > MAX_MSG_LENGTH
      ? message.trim().slice(0, MAX_MSG_LENGTH)
      : message.trim();

    const result = await processLead({
      message: trimmed,
      source: readOptionalString(source, 80) || 'Web form',
      name: readOptionalString(name, 120),
      contact: readOptionalString(contact, 120),
    });

    return NextResponse.json({
      success: true,
      ...result,
      _warnings: [
        ...(result.sheetsError ? ['Не удалось записать в Google Sheets. Проверьте доступ service account к таблице.'] : []),
        ...(result.notificationError ? ['Не удалось отправить уведомление менеджеру.'] : []),
      ],
    });
  } catch (error) {
    console.error('[API] POST /api/leads error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const guardResponse = checkRateLimit(request, { keyPrefix: 'leads:get', maxRequests: 60, windowMs: 60_000 });
    if (guardResponse) return guardResponse;

    const fromSheets = await readLeads();

    if (fromSheets.length > 0) {
      return NextResponse.json({ success: true, leads: fromSheets, source: 'sheets' });
    }

    const fromMemory = getStoredLeads();
    return NextResponse.json({ success: true, leads: fromMemory, source: 'memory' });
  } catch (error) {
    console.error('[API] GET /api/leads error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
