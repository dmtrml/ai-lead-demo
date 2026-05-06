import { NextResponse } from 'next/server';
import { pollNewMessages, sendMessage } from '@/lib/telegram';
import { processLead } from '@/lib/leads';

export async function POST() {
  try {
    const messages = await pollNewMessages();

    const results: Array<{ chatId: number; text: string; success: boolean; error?: string }> = [];

    for (const msg of messages) {
      try {
        const { lead } = await processLead({
          message: msg.text || '',
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
          text: msg.text || '',
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
