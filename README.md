# AI Lead Demo

Демо-приложение AI-ассистента для обработки входящих заявок.

Сценарий: клиент оставляет заявку в веб-форме или Telegram → AI анализирует сообщение → заявка попадает в Google Sheets → менеджер получает Telegram-уведомление → на дашборде появляется структурированная карточка лида.

## Что умеет

- принимать заявки из веб-формы;
- принимать заявки через Telegram bot webhook;
- анализировать текст заявки через OpenAI-compatible API;
- определять нишу, тип услуги, бюджет, срочность и приоритет лида;
- готовить список уточняющих вопросов;
- генерировать черновик ответа клиенту;
- записывать лиды в Google Sheets;
- отправлять уведомление менеджеру в Telegram;
- показывать заявки в дашборде с фильтрами и статусами;
- работать в mock mode без внешних интеграций.

## Стек

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- OpenAI-compatible SDK
- Telegram Bot API
- Google Sheets API

## Архитектура

```txt
Web UI / Telegram
        ↓
Next.js API Routes
        ↓
Lead processing service
        ↓
AI analysis → Google Sheets → Telegram notification
        ↓
Dashboard
```

Ключевые части проекта:

```txt
src/app/page.tsx                         Главная страница дашборда
src/hooks/useIntegrationStatus.ts         Загрузка статуса интеграций
src/hooks/useLeads.ts                     Загрузка и локальное обновление лидов
src/hooks/useLeadProcessing.ts            Отправка заявки и pipeline-анимация
src/lib/api-guard.ts                      Базовая защита API routes
src/lib/ai.ts                             AI-анализ заявки
src/lib/leads.ts                          Сборка лида и orchestration
src/lib/sheets.ts                         Google Sheets integration
src/lib/telegram.ts                       Telegram integration
src/app/api/leads/route.ts                API для веб-заявок и списка лидов
src/app/api/telegram/webhook/route.ts     Telegram webhook
src/app/api/telegram/poll/route.ts        Internal polling fallback
```

## Запуск локально

```bash
npm install
npm run dev
```

Открыть:

```txt
http://localhost:3000
```

По умолчанию можно включить mock mode и протестировать UI без Telegram, Google Sheets и AI API.

## Переменные окружения

Минимальный набор для mock mode:

```txt
NEXT_PUBLIC_MOCK_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Для live mode нужны переменные:

```txt
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

QWEN_API_KEY=...
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus

TELEGRAM_BOT_TOKEN=...
TELEGRAM_MANAGER_CHAT_ID=...
TELEGRAM_WEBHOOK_SECRET=long-random-secret

GOOGLE_SHEETS_CLIENT_EMAIL=...
GOOGLE_SHEETS_PRIVATE_KEY=...
GOOGLE_SHEETS_SPREADSHEET_ID=...

INTERNAL_API_KEY=long-random-key
WEBHOOK_SETUP_KEY=optional-long-random-key
```

`GOOGLE_SHEETS_PRIVATE_KEY` можно хранить как многострочное значение или как строку с `\n` — приложение нормализует переносы строк при чтении env.

## Защита API routes

В проекте добавлен базовый защитный слой:

- `/api/leads` защищён same-origin проверкой для POST-запросов и rate limit;
- `/api/telegram/webhook` проверяет Telegram secret header `x-telegram-bot-api-secret-token`;
- `/api/telegram/poll` требует внутренний API key через `x-api-key` или `Authorization: Bearer ...`;
- `/api/telegram/webhook/setup` требует `WEBHOOK_SETUP_KEY`, а если он не задан — fallback на `INTERNAL_API_KEY`.

Это базовая защита для демо-проекта. Для production SaaS дополнительно нужны полноценная авторизация, persistent rate limit, журналирование событий и хранение данных в БД.

## Настройка Telegram webhook

После деплоя укажите `TELEGRAM_WEBHOOK_SECRET` и настройте webhook через защищённый endpoint:

```bash
curl -X POST https://your-app.vercel.app/api/telegram/webhook/setup \
  -H "Content-Type: application/json" \
  -H "x-webhook-key: $WEBHOOK_SETUP_KEY" \
  -d '{"url":"https://your-app.vercel.app/api/telegram/webhook"}'
```

Проверка webhook info:

```bash
curl https://your-app.vercel.app/api/telegram/webhook/setup \
  -H "x-webhook-key: $WEBHOOK_SETUP_KEY"
```

Если `WEBHOOK_SETUP_KEY` не используется, передайте внутренний ключ:

```bash
curl https://your-app.vercel.app/api/telegram/webhook/setup \
  -H "Authorization: Bearer $INTERNAL_API_KEY"
```

## Google Sheets

1. Создайте Google Cloud service account.
2. Включите Google Sheets API.
3. Создайте таблицу и добавьте service account как редактора.
4. Передайте в env email service account, private key и spreadsheet id.
5. Приложение создаст заголовки на листе `Leads`, если первая строка пустая.

## Скрипты

```bash
npm run dev      # локальный запуск
npm run build    # production build
npm run start    # запуск production build
npm run lint     # eslint
```

## Ограничения демо

- Локальный in-memory store используется только как fallback, основное хранилище для live mode — Google Sheets.
- Изменение статуса заявки сейчас обновляет только UI state и не синхронизируется обратно в Google Sheets.
- Rate limit реализован в памяти процесса, поэтому для production лучше Redis/Upstash/KV.
- Polling endpoint оставлен как fallback/dev-инструмент; для деплоя лучше использовать Telegram webhook.

## Что можно улучшить дальше

- добавить Zod-валидацию AI-ответа;
- экранировать HTML в Telegram-сообщениях;
- перенести лиды в Postgres/Supabase/Neon;
- сохранять изменение статуса заявки через backend;
- добавить CI: lint, typecheck, build;
- добавить тесты на `api-guard`, `ai`, `leads` и routes;
- добавить скриншоты и gif-демо в README.
