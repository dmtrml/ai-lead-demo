export const config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    managerChatId: process.env.TELEGRAM_MANAGER_CHAT_ID || '',
    pollIntervalMs: Number(process.env.TELEGRAM_POLL_INTERVAL_MS || '3000'),
  },
  ai: {
    apiKey: process.env.QWEN_API_KEY || '',
    baseUrl: process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: process.env.QWEN_MODEL || 'qwen-plus',
  },
  sheets: {
    privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY || '',
    clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL || '',
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
  },
  public: {
    googleSheetsLink: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_LINK || '',
  },
};

export function isMockMode(): boolean {
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') return true;
  return false;
}

export function isTelegramAvailable(): boolean {
  return !!config.telegram.botToken;
}

export function isAiAvailable(): boolean {
  return !!config.ai.apiKey && config.ai.apiKey.startsWith('sk-');
}

export function isSheetsAvailable(): boolean {
  return (
    !!config.sheets.privateKey &&
    config.sheets.privateKey.startsWith('-----BEGIN') &&
    !!config.sheets.clientEmail &&
    !!config.sheets.spreadsheetId
  );
}
