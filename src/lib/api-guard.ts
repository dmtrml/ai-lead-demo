import { NextResponse } from 'next/server';

interface RateLimitOptions {
  keyPrefix: string;
  maxRequests: number;
  windowMs: number;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const rateLimitBuckets = new Map<string, RateLimitBucket>();

function jsonError(error: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ success: false, error, ...extra }, { status });
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown';

  return request.headers.get('x-real-ip') || 'unknown';
}

function getHostFromUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

function getAllowedHosts(request: Request): Set<string> {
  const allowed = new Set<string>();
  const requestHost = getHostFromUrl(request.url);
  const appHost = getHostFromUrl(process.env.NEXT_PUBLIC_APP_URL || null);

  if (requestHost) allowed.add(requestHost);
  if (appHost) allowed.add(appHost);

  return allowed;
}

export function requireJsonContentType(request: Request): NextResponse | null {
  const contentType = request.headers.get('content-type') || '';

  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonError('Content-Type must be application/json', 415);
  }

  return null;
}

export function requireSameOrigin(request: Request): NextResponse | null {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'same-origin' || fetchSite === 'same-site') return null;

  const allowedHosts = getAllowedHosts(request);
  const originHost = getHostFromUrl(request.headers.get('origin'));
  const refererHost = getHostFromUrl(request.headers.get('referer'));
  const callerHost = originHost || refererHost;

  if (!callerHost && process.env.NODE_ENV !== 'production') return null;

  if (!callerHost || !allowedHosts.has(callerHost)) {
    return jsonError('Forbidden: same-origin request required', 403);
  }

  return null;
}

export function requireTelegramSecret(request: Request): NextResponse | null {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET || '';

  if (!expectedSecret) {
    if (process.env.NODE_ENV === 'production') {
      return jsonError('TELEGRAM_WEBHOOK_SECRET is not configured', 503);
    }

    console.warn('[Security] TELEGRAM_WEBHOOK_SECRET is not configured. Webhook secret check skipped in development.');
    return null;
  }

  const actualSecret = request.headers.get('x-telegram-bot-api-secret-token') || '';

  if (actualSecret !== expectedSecret) {
    return jsonError('Unauthorized webhook request', 401);
  }

  return null;
}

export function requireInternalApiKey(request: Request): NextResponse | null {
  const expectedKey = process.env.INTERNAL_API_KEY
    || process.env.CRON_SECRET
    || process.env.TELEGRAM_POLL_SECRET
    || '';

  if (!expectedKey) {
    if (process.env.NODE_ENV === 'production') {
      return jsonError('Internal API key is not configured', 503);
    }

    console.warn('[Security] Internal API key is not configured. Internal route check skipped in development.');
    return null;
  }

  const authHeader = request.headers.get('authorization') || '';
  const bearerToken = authHeader.replace(/^Bearer\s+/i, '').trim();
  const providedKey = request.headers.get('x-api-key') || bearerToken;

  if (providedKey !== expectedKey) {
    return jsonError('Unauthorized internal request', 401);
  }

  return null;
}

export function checkRateLimit(request: Request, options: RateLimitOptions): NextResponse | null {
  const now = Date.now();
  const ip = getClientIp(request);
  const key = `${options.keyPrefix}:${ip}`;

  for (const [bucketKey, bucket] of rateLimitBuckets.entries()) {
    if (bucket.resetAt <= now) rateLimitBuckets.delete(bucketKey);
  }

  const current = rateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  if (current.count >= options.maxRequests) {
    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfterSeconds,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSeconds) },
      },
    );
  }

  current.count += 1;
  return null;
}
