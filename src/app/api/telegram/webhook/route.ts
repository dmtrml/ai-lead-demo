import { NextResponse } from 'next/server';
import { processLead } from '@/lib/leads';
import { sendMessage } from '@/lib/telegram';

export async function POST(request: Request) {
  try {
    const update = await request.json();

    const message = update?.message;
    if (!message?.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text;

    await processLead({
      message: text,
      source: 'Telegram',
      name: message.from?.first_name || message.chat.first_name || 'Не указано',
      contact: message.from?.username ? `@${message.from.username}` : `id${chatId}`,
    });

    await sendMessage(
      chatId,
      'Спасибо! Заявка получена.\nЯ передал информацию менеджеру. Он свяжется с вами после обработки запроса.',
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Webhook] error:', error);
    return NextResponse.json({ ok: true });
  }
}
