import { analyzeLead } from './ai';
import { appendLead, ensureSheetHeaders } from './sheets';
import { sendManagerNotification } from './telegram';
import type { AiResult, Lead } from './demo-data';

export interface ProcessLeadInput {
  message: string;
  source: string;
  name?: string;
  contact?: string;
}

export interface ProcessLeadOutput {
  lead: Lead;
  aiResult: AiResult;
  sheetsError?: boolean;
  sheetsErrorMessage?: string;
  notificationError?: boolean;
}

const leadsStore: Lead[] = [];

export function getStoredLeads(): Lead[] {
  return [...leadsStore];
}

export async function processLead(input: ProcessLeadInput): Promise<ProcessLeadOutput> {
  const aiResult = await analyzeLead(input.message);

  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU');

  const lead: Lead = {
    id: `${String(now.getTime()).slice(-6)}`,
    date: dateStr,
    name: input.name || 'Не указано',
    contact: input.contact || 'Telegram',
    source: input.source || 'Telegram bot',
    message: input.message,
    niche: aiResult.niche,
    service_type: aiResult.service_type,
    budget: aiResult.budget,
    urgency: aiResult.urgency,
    summary: aiResult.summary,
    lead_priority: aiResult.lead_priority,
    priority_label_ru: aiResult.priority_label_ru,
    priority_reason: aiResult.priority_reason,
    questions_to_ask: aiResult.questions_to_ask,
    draft_reply: aiResult.draft_reply,
    status: aiResult.summary === 'Ошибка обработки AI' ? 'Ошибка AI' : 'Новая',
    responsible: 'Менеджер',
  };

  leadsStore.unshift(lead);

  let sheetsError = false;
  let sheetsErrorMessage: string | undefined;
  let notificationError = false;

  try {
    await ensureSheetHeaders();
    const ok = await appendLead(lead);
    if (!ok) {
      sheetsError = true;
      sheetsErrorMessage = 'Google Sheets: запись не выполнена (проверьте доступ service account к таблице)';
    }
  } catch (e) {
    sheetsError = true;
    sheetsErrorMessage = e instanceof Error ? e.message : 'Google Sheets: неизвестная ошибка';
  }

  try {
    await sendManagerNotification(lead);
  } catch {
    notificationError = true;
    if (sheetsError) {
      lead.status = 'Ошибка уведомления';
    } else {
      lead.status = 'Ошибка уведомления';
    }
  }

  if (sheetsError) {
    console.log(`[Leads] Sheet append failed for lead ${lead.id}, notification still sent`);
  }

  return { lead, aiResult, sheetsError, sheetsErrorMessage, notificationError };
}
