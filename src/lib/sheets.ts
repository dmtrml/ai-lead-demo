import { google, sheets_v4 } from 'googleapis';
import { config, isSheetsAvailable, isMockMode } from './env';
import type { Lead } from './demo-data';

let sheetsClient: sheets_v4.Resource$Spreadsheets | null = null;

function getClient(): sheets_v4.Resource$Spreadsheets {
  if (!sheetsClient) {
    const auth = new google.auth.JWT({
      email: config.sheets.clientEmail,
      key: config.sheets.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    sheetsClient = google.sheets({ version: 'v4', auth }).spreadsheets;
  }
  return sheetsClient!;
}

export async function readLeads(): Promise<Lead[]> {
  if (isMockMode() || !isSheetsAvailable()) {
    return [];
  }

  try {
    const client = getClient();
    const response = await client.values.get({
      spreadsheetId: config.sheets.spreadsheetId,
      range: 'Leads!A2:Q',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    const priorityMap: Record<string, 'hot' | 'warm' | 'cold'> = {
      'Горячий': 'hot',
      'Тёплый': 'warm',
      'Холодный': 'cold',
    };

    return rows.map((row: string[]) => ({
      id: row[0] || '',
      date: row[1] || '',
      name: row[2] || 'Не указано',
      contact: row[3] || '',
      source: row[4] || '',
      message: row[5] || '',
      niche: row[6] || '',
      service_type: row[7] || '',
      budget: row[8] || '',
      urgency: row[9] || '',
      summary: row[10] || '',
      lead_priority: priorityMap[row[11]] || 'cold',
      priority_label_ru: row[11] || 'Холодный',
      priority_reason: row[12] || '',
      questions_to_ask: (row[13] || '').split('; ').filter(Boolean),
      draft_reply: row[14] || '',
      status: row[15] || 'Новая',
      responsible: row[16] || 'Менеджер',
    }));
  } catch (error) {
    console.error('[Sheets] read error:', error);
    return [];
  }
}


export async function ensureSheetHeaders(): Promise<void> {
  if (isMockMode() || !isSheetsAvailable()) return;

  try {
    const client = getClient();
    const response = await client.values.get({
      spreadsheetId: config.sheets.spreadsheetId,
      range: 'Leads!A1:R1',
    });

    if (!response.data.values || response.data.values.length === 0) {
      const headers = [
        'ID', 'Дата', 'Имя', 'Контакт', 'Источник', 'Исходное сообщение',
        'Ниша', 'Тип услуги', 'Бюджет', 'Срочность', 'AI Summary',
        'Приоритет', 'Причина приоритета', 'Что уточнить', 'Черновик ответа',
        'Статус', 'Ответственный',
      ];

      await client.values.update({
        spreadsheetId: config.sheets.spreadsheetId,
        range: 'Leads!A1:Q1',
        valueInputOption: 'RAW',
        requestBody: { values: [headers] },
      });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[Sheets] ensure headers error:', msg);
    if (msg.includes('permission')) {
      console.error('[Sheets] → Добавьте service account email как редактора таблицы:', config.sheets.clientEmail);
    }
  }
}

export async function appendLead(lead: Lead): Promise<boolean> {
  if (isMockMode() || !isSheetsAvailable()) {
    console.log('[MOCK Sheets] appendLead:', lead.id, lead.niche, lead.lead_priority);
    return true;
  }

  try {
    const client = getClient();
    const row = [
      lead.id,
      lead.date,
      lead.name,
      lead.contact,
      lead.source,
      lead.message,
      lead.niche,
      lead.service_type,
      lead.budget,
      lead.urgency,
      lead.summary,
      lead.priority_label_ru,
      lead.priority_reason,
      lead.questions_to_ask.join('; '),
      lead.draft_reply,
      lead.status,
      lead.responsible,
    ];

    const sheetInfo = await client.get({
      spreadsheetId: config.sheets.spreadsheetId,
      ranges: [],
      includeGridData: false,
    });

    const sheet = sheetInfo.data.sheets?.find(
      (s) => s.properties?.title === 'Leads',
    );
    const sheetId = sheet?.properties?.sheetId ?? 0;

    await client.batchUpdate({
      spreadsheetId: config.sheets.spreadsheetId,
      requestBody: {
        requests: [
          {
            insertDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: 1,
                endIndex: 2,
              },
              inheritFromBefore: false,
            },
          },
        ],
      },
    });

    await client.values.update({
      spreadsheetId: config.sheets.spreadsheetId,
      range: 'Leads!A2:Q2',
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });

    return true;
  } catch (error) {
    console.error('[Sheets] append error:', error);
    return false;
  }
}
