# Деплой на Vercel

## 1. Подготовка

```bash
cd lead-demo

# Создать публичный репозиторий на GitHub
gh repo create ai-lead-demo --public --push

# Если gh не установлен:
# 1. Создать репозиторий вручную на github.com
# 2. Выполнить:
git remote add origin https://github.com/ВАШ_АККАУНТ/ai-lead-demo.git
git push -u origin master
```

Результат: репозиторий доступен на `https://github.com/ВАШ_АККАУНТ/ai-lead-demo`

---

## 2. Деплой на Vercel

### Через dashboard (рекомендуется)

1. Перейти на https://vercel.com
2. Нажать **Add New → Project**
3. Import Git Repository → выбрать `ai-lead-demo`
4. **Не нажимать Deploy** — сначала добавить переменные

### Через CLI

```bash
npx vercel --prod
```

При первом запуске Vercel попросит авторизоваться через GitHub.

---

## 3. Переменные окружения

Добавить в Vercel Dashboard: **Settings → Environment Variables**

```
TELEGRAM_BOT_TOKEN          = ваш токен от BotFather
TELEGRAM_MANAGER_CHAT_ID    = chat_id менеджера
QWEN_API_KEY                = ключ DashScope или OpenRouter
QWEN_BASE_URL               = https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL                  = qwen-plus
GOOGLE_SHEETS_PRIVATE_KEY   = "-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_SHEETS_CLIENT_EMAIL  = ваш service account email
GOOGLE_SHEETS_SPREADSHEET_ID = ID таблицы
```

**Важно для `GOOGLE_SHEETS_PRIVATE_KEY`**:
- Если вставляете через Dashboard UI — переносы как `\n` внутри кавычек
- Если через `vercel env add` — можно вставить многострочное значение

---

## 4. Настройка Telegram Webhook

После деплоя Vercel выдаст URL: `https://ai-lead-demo.vercel.app`

Настроить вебхук:

```bash
curl -X POST https://ai-lead-demo.vercel.app/api/telegram/webhook/setup \
  -H "Content-Type: application/json" \
  -d '{"url": "https://ai-lead-demo.vercel.app/api/telegram/webhook"}'
```

Проверить:

```bash
curl https://ai-lead-demo.vercel.app/api/telegram/webhook/setup
```

Ответ должен быть: `{"success": true, "webhook": {"url": "https://ai-lead-demo.vercel.app/api/telegram/webhook", ...}}`

---

## 5. Проверка

1. Открыть `https://ai-lead-demo.vercel.app`
2. Написать боту в Telegram — ответ придёт мгновенно (через вебхук)
3. Проверить `/api/health` — все статусы должны быть `true`

---

## 6. Ручное обновление

После изменений в коде:

```bash
git add .
git commit -m "описание изменений"
git push
```

Vercel передеплоит автоматически.

---

## 7. Если что-то пошло не так

### 7.1 Логи на Vercel

Dashboard → проект → Functions → выбрать запрос с ошибкой → View Logs

### 7.2 Вебхук не отвечает

```bash
# Проверить webhook info
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo

# Удалить и пересоздать
curl https://api.telegram.org/bot<TOKEN>/deleteWebhook
# Потом снова выполнить п.4
```

### 7.3 Google Sheets 403

- Убедиться, что API Sheets включён в Google Cloud Console
- Service account добавлен как редактор таблицы
- В .env.local / Vercel корректный private key (с переносами `\n`)

### 7.4 Qwen AI 401

- Проверить, что `QWEN_API_KEY` начинается с `sk-`
- Проверить `QWEN_BASE_URL` — должен быть `https://dashscope.aliyuncs.com/compatible-mode/v1`
- Для OpenRouter: `https://openrouter.ai/api/v1`
