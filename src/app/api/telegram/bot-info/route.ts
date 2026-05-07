import { NextResponse } from 'next/server';
import { getBotInfo } from '@/lib/telegram';

export async function GET() {
  try {
    const info = await getBotInfo();
    if (info) {
      return NextResponse.json({ success: true, ...info });
    }
    return NextResponse.json({
      success: false,
      username: null,
      link: null,
    });
  } catch (error) {
    console.error('[BotInfo] error:', error);
    return NextResponse.json({ success: false, username: null, link: null });
  }
}
