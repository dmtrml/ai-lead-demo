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
    const text = message.text.trim();

    if (text === '/start') {
      await sendMessage(
        chatId,
        '👋 Здравствуйте! Я <b>AI-ассистент для обработки заявок</b>.\n\n'
        + 'Я помогаю автоматически анализировать входящие заявки:\n'
        + '• Определяю нишу и тип услуги\n'
        + '• Оцениваю бюджет и срочность\n'
        + '• Квалифицирую лид (горячий / тёплый / холодный)\n'
        + '• Готовлю черновик ответа менеджеру\n'
        + '• Записываю все данные в Google Sheets\n\n'
        + '📝 <b>Попробуйте прямо сейчас</b> — отправьте текст вашей заявки.\n\n'
        + 'Пример:\n'
        + '<i>«У нас онлайн-школа английского, хотим запустить рекламу. Бюджет 150 000 ₽ в месяц.»</i>',
      );
      return NextResponse.json({ ok: true });
    }

    await processLead({
      message: text,
      source: 'Telegram',
      name: message.from?.first_name || message.chat.first_name || 'Не указано',
      contact: message.from?.username ? `@${message.from.username}` : `id${chatId}`,
    });

    await sendMessage(
      chatId,
      '✅ Спасибо! Заявка получена и обработана.\n\n'
      + 'Я передал информацию менеджеру. Он свяжется с вами после обработки запроса.\n\n'
      + 'Посмотреть результат можно на дашборде: https://ai-lead-demo.vercel.app',
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Webhook] error:', error);
    return NextResponse.json({ ok: true });
  }
}
