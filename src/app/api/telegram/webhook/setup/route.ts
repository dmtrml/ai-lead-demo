import { NextResponse } from 'next/server';
import { config, isTelegramAvailable } from '@/lib/env';

const SETUP_KEY = process.env.WEBHOOK_SETUP_KEY || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body.url;
    const key = body.key || request.headers.get('x-webhook-key') || '';

    if (SETUP_KEY && key !== SETUP_KEY) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing webhook setup key' },
        { status: 403 },
      );
    }

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

export async function GET(request: Request) {
  if (!isTelegramAvailable()) {
    return NextResponse.json({
      success: false,
      error: 'TELEGRAM_BOT_TOKEN is not configured',
    });
  }

  const key = request.headers.get('x-webhook-key') || '';
  if (SETUP_KEY && key !== SETUP_KEY) {
    return NextResponse.json(
      { success: false, error: 'Invalid webhook setup key' },
      { status: 403 },
    );
  }

  const apiUrl = `https://api.telegram.org/bot${config.telegram.botToken}/getWebhookInfo`;
  const res = await fetch(apiUrl);
  const data = await res.json();

  return NextResponse.json({
    success: data.ok,
    webhook: data.result || data,
  });
}
