import { NextResponse } from 'next/server';
import { config, isTelegramAvailable } from '@/lib/env';
import { checkRateLimit, requireInternalApiKey, requireJsonContentType } from '@/lib/api-guard';

function requireSetupAuth(request: Request): NextResponse | null {
  const key = request.headers.get('x-webhook-key') || '';

  if (config.security.webhookSetupKey) {
    if (key !== config.security.webhookSetupKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing webhook setup key' },
        { status: 403 },
      );
    }

    return null;
  }

  return requireInternalApiKey(request);
}

export async function POST(request: Request) {
  try {
    const guardResponse = requireSetupAuth(request)
      ?? requireJsonContentType(request)
      ?? checkRateLimit(request, { keyPrefix: 'telegram:webhook-setup', maxRequests: 10, windowMs: 60_000 });

    if (guardResponse) return guardResponse;

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
      body: JSON.stringify({
        url,
        drop_pending_updates: true,
        ...(config.telegram.webhookSecret ? { secret_token: config.telegram.webhookSecret } : {}),
      }),
    });

    const data = await res.json();

    if (data.ok) {
      return NextResponse.json({
        success: true,
        message: `Webhook set to ${url}`,
        secretTokenConfigured: !!config.telegram.webhookSecret,
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
  const guardResponse = requireSetupAuth(request)
    ?? checkRateLimit(request, { keyPrefix: 'telegram:webhook-setup:get', maxRequests: 20, windowMs: 60_000 });

  if (guardResponse) return guardResponse;

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
