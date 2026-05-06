import { NextResponse } from 'next/server';
import { config, isTelegramAvailable } from '@/lib/env';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body.url;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required. Send { url: "https://your-site.vercel.app/api/telegram/webhook" }' },
        { status: 400 },
      );
    }

    if (!isTelegramAvailable()) {
      return NextResponse.json(
        { success: false, error: 'TELEGRAM_BOT_TOKEN is not configured' },
        { status: 400 },
      );
    }

    const apiUrl = `https://api.telegram.org/bot${config.telegram.botToken}/setWebhook`;
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, drop_pending_updates: true }),
    });

    const data = await res.json();

    if (data.ok) {
      return NextResponse.json({
        success: true,
        message: `Webhook set to ${url}`,
        result: data,
      });
    }

    return NextResponse.json(
      { success: false, error: data.description || 'Unknown error' },
      { status: 400 },
    );
  } catch (error) {
    console.error('[SetWebhook] error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (!isTelegramAvailable()) {
    return NextResponse.json({
      success: false,
      error: 'TELEGRAM_BOT_TOKEN is not configured',
    });
  }

  const apiUrl = `https://api.telegram.org/bot${config.telegram.botToken}/getWebhookInfo`;
  const res = await fetch(apiUrl);
  const data = await res.json();

  return NextResponse.json({
    success: data.ok,
    webhook: data.result || data,
  });
}
