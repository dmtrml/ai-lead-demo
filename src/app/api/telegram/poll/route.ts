import { NextResponse } from 'next/server';
import { pollNewMessages, sendMessage } from '@/lib/telegram';
import { processLead } from '@/lib/leads';
import { isTelegramAvailable } from '@/lib/env';
import { checkRateLimit, requireInternalApiKey } from '@/lib/api-guard';

const MAX_MSG_LENGTH = 4000;

export async function POST(request: Request) {
  try {
    const guardResponse = requireInternalApiKey(request)
      ?? checkRateLimit(request, { keyPrefix: 'telegram:poll', maxRequests: 20, windowMs: 60_000 });

    if (guardResponse) return guardResponse;

    if (isTelegramAvailable()) {
      const webhookUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
      const res = await fetch(webhookUrl);
      const data = await res.json() as { ok: boolean; result?: { url: string } };
      if (data.ok && data.result?.url) {
        return NextResponse.json({
          success: true,
          processed: 0,
          notice: 'Webhook active — polling disabled. Messages are handled automatically.',
          results: [],
        });
      }
    }

    const messages = await pollNewMessages();

    const results: Array<{ chatId: number; text: string; success: boolean; error?: string }> = [];

    for (const msg of messages) {
      try {
        const raw = (msg.text || '').trim();
        if (!raw) continue;

        const message = raw.length > MAX_MSG_LENGTH ? raw.slice(0, MAX_MSG_LENGTH) : raw;

        const { lead } = await processLead({
          message,
          source: 'Telegram',
          name: msg.from?.first_name || msg.chat.first_name || 'Не указано',
          contact: msg.from?.username ? `@${msg.from.username}` : `id${msg.chat.id}`,
        });

        await sendMessage(
          msg.chat.id,
          'Спасибо! Заявка получена.\nЯ передал информацию менеджеру. Он свяжется с вами после обработки запроса.',
        );

        results.push({
          chatId: msg.chat.id,
          text: message,
          success: true,
        });
      } catch (error) {
        results.push({
          chatId: msg.chat.id,
          text: msg.text || '',
          success: false,
          error: String(error),
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: messages.length,
      results,
    });
  } catch (error) {
    console.error('[API] POST /api/telegram/poll error:', error);
    return NextResponse.json(
      { success: false, error: 'Polling failed' },
      { status: 500 },
    );
  }
}
