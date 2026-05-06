import { NextResponse } from 'next/server';
import { processLead, getStoredLeads } from '@/lib/leads';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, source, name, contact } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 },
      );
    }

    const result = await processLead({
      message: message.trim(),
      source: source || 'Web form',
      name,
      contact,
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

export async function GET() {
  try {
    const leads = getStoredLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error('[API] GET /api/leads error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
