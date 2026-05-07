import { config, isTelegramAvailable, isMockMode } from './env';
import type { Lead } from './demo-data';

interface TelegramMessage {
  message_id: number;
  chat: { id: number; first_name?: string; username?: string };
  text?: string;
  from?: { id: number; first_name?: string; username?: string };
}

let lastUpdateId = 0;

const API_BASE = 'https://api.telegram.org/bot';

async function callApi(method: string, body?: Record<string, unknown>): Promise<unknown> {
  const url = `${API_BASE}${config.telegram.botToken}/${method}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Telegram API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getBotInfo(): Promise<{ username: string; link: string } | null> {
  try {
    const data = await callApi('getMe') as { ok: boolean; result: { username: string; first_name: string } };
    if (data.ok && data.result.username) {
      return { username: data.result.username, link: `https://t.me/${data.result.username}` };
    }
    return null;
  } catch {
    return null;
  }
}

export async function pollNewMessages(): Promise<TelegramMessage[]> {
  if (isMockMode() || !isTelegramAvailable()) {
    console.log('[MOCK Telegram] pollNewMessages — no messages');
    return [];
  }

  try {
    const data = await callApi('getUpdates', {
      offset: lastUpdateId + 1,
      timeout: 5,
    }) as { ok: boolean; result: Array<{
      update_id: number;
      message?: TelegramMessage;
    }> };

    if (!data.ok) return [];

    const messages: TelegramMessage[] = [];
    for (const update of data.result) {
      if (update.update_id > lastUpdateId) {
        lastUpdateId = update.update_id;
      }
      if (update.message?.text) {
        messages.push(update.message);
      }
    }
    return messages;
  } catch (error) {
    console.error('[Telegram] poll error:', error);
    return [];
  }
}

export async function sendMessage(chatId: number | string, text: string): Promise<void> {
  if (isMockMode() || !isTelegramAvailable()) {
    console.log(`[MOCK Telegram] sendMessage to ${chatId}:`, text);
    return;
  }

  try {
    await callApi('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.error('[Telegram] sendMessage error:', error);
    throw error;
  }
}

export function formatManagerNotification(lead: Lead): string {
  const priorityEmoji = lead.lead_priority === 'hot' ? '🔥' : lead.lead_priority === 'warm' ? '💡' : '❄️';

  const questions = lead.questions_to_ask.map((q, i) => `${i + 1}. ${q}`).join('\n');

  return [
    `<b>Новая заявка ${priorityEmoji}</b>`,
    '',
    `<b>Ниша:</b> ${lead.niche}`,
    `<b>Запрос:</b> ${lead.service_type}`,
    `<b>Бюджет:</b> ${lead.budget}`,
    `<b>Приоритет:</b> ${lead.priority_label_ru}`,
    '',
    `<b>Summary:</b>`,
    lead.summary,
    '',
    `<b>Почему такой приоритет:</b>`,
    lead.priority_reason,
    questions ? `\n<b>Что уточнить:</b>\n${questions}` : '',
    '',
    `<b>Черновик ответа:</b>`,
    lead.draft_reply,
    '',
    `👤 ${lead.contact || 'Не указано'}`,
    `📅 ${lead.date}`,
  ].join('\n');
}

export async function sendManagerNotification(lead: Lead): Promise<void> {
  if (!config.telegram.managerChatId) {
    console.log('[Telegram] No manager chat ID configured');
    return;
  }

  const text = formatManagerNotification(lead);
  await sendMessage(config.telegram.managerChatId, text);
}
