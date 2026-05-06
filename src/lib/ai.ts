import OpenAI from 'openai';
import { config, isAiAvailable, isMockMode } from './env';
import { presets } from './demo-data';
import type { AiResult } from './demo-data';

const SYSTEM_PROMPT = `Ты — AI-ассистент отдела продаж.

Твоя задача — обработать входящую заявку от потенциального клиента и подготовить структурированную карточку лида для менеджера.

Проанализируй сообщение клиента и верни результат строго в JSON.

Нужно определить:
1. Краткое summary заявки.
2. Нишу клиента.
3. Какую услугу или решение он хочет.
4. Есть ли бюджет.
5. Есть ли срочность.
6. Насколько лид качественный: hot, warm или cold.
7. Русскую метку приоритета: Горячий, Тёплый или Холодный.
8. Почему выбран такой приоритет.
9. Какие вопросы нужно уточнить.
10. Черновик первого ответа клиенту.

Правила квалификации:
- hot: есть понятная задача, бюджет, конкретный бизнес-запрос или явное намерение двигаться дальше.
- warm: интерес есть, но мало деталей, нет бюджета или клиент пока сравнивает варианты.
- cold: слишком общий вопрос, нет контекста, нет явной задачи, клиент просто спрашивает цену.

Не выдумывай данные, которых нет в сообщении.
Если информации не хватает, укажи это в вопросах для уточнения.
Пиши деловым, простым и понятным языком.

Верни только JSON без markdown и без пояснений.

Формат ответа:
{
  "summary": "",
  "niche": "",
  "service_type": "",
  "budget": "",
  "urgency": "",
  "lead_priority": "hot | warm | cold",
  "priority_label_ru": "Горячий | Тёплый | Холодный",
  "priority_reason": "",
  "questions_to_ask": [],
  "draft_reply": ""
}`;

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: config.ai.apiKey,
      baseURL: config.ai.baseUrl,
    });
  }
  return client;
}

export async function analyzeLead(message: string): Promise<AiResult> {
  if (isMockMode() || !isAiAvailable()) {
    return simulateAiProcessing(message);
  }

  try {
    const openai = getClient();
    const completion = await openai.chat.completions.create({
      model: config.ai.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Сообщение клиента:\n${message}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from AI');
    }

    const result = JSON.parse(content) as AiResult;

    if (!result.lead_priority || !result.summary) {
      throw new Error('Invalid AI response structure');
    }

    return result;
  } catch (error) {
    console.error('[AI] Real API error, falling back to mock:', error);

    try {
      return await simulateAiProcessing(message);
    } catch {
      return {
        summary: 'Ошибка обработки AI',
        niche: 'Не определена',
        service_type: 'Не определён',
        budget: 'Не указан',
        urgency: 'Не указана',
        lead_priority: 'cold',
        priority_label_ru: 'Холодный',
        priority_reason: 'Ошибка при обработке заявки AI-моделью. Требуется ручная проверка.',
        questions_to_ask: ['Проверьте заявку вручную'],
        draft_reply: 'Здравствуйте! Спасибо за обращение. Наш менеджер скоро свяжется с вами.',
      };
    }
  }
}

function simulateAiProcessing(message: string): Promise<AiResult> {
  const presetIndex = presets.findIndex((p) => p.message === message);

  const mockResults: Record<string, AiResult> = {
    presets_0: {
      summary: 'Онлайн-школа английского языка хочет запустить рекламу для получения заявок на пробные занятия. Есть сайт, но текущая конверсия слабая.',
      niche: 'Онлайн-образование / Онлайн-школа',
      service_type: 'Реклама / Лидогенерация',
      budget: '150 000 ₽/мес',
      urgency: 'Не указана',
      lead_priority: 'hot',
      priority_label_ru: 'Горячий',
      priority_reason: 'Есть конкретная ниша, понятная задача, рекламный бюджет и проблема с текущими заявками.',
      questions_to_ask: [
        'Какие рекламные каналы уже пробовали?',
        'Какая текущая стоимость заявки?',
        'Какие гео планируете?',
        'Есть ли CRM для обработки заявок?',
        'Какие сроки запуска?',
      ],
      draft_reply: 'Здравствуйте! Спасибо за обращение. По описанию вам может подойти аудит текущей рекламы и запуск воронки под пробные занятия. Чтобы точнее оценить ситуацию, подскажите, пожалуйста, какие каналы уже пробовали и какая стоимость заявки сейчас?',
    },
    presets_1: {
      summary: 'Строительная компания изучает возможность разработки сайта. Интересуют цены и сроки.',
      niche: 'Строительство',
      service_type: 'Разработка сайта',
      budget: 'Не указан',
      urgency: 'Не указана',
      lead_priority: 'warm',
      priority_label_ru: 'Тёплый',
      priority_reason: 'Есть интерес и конкретный запрос, но клиент пока изучает варианты, бюджет не указан.',
      questions_to_ask: [
        'Какой бюджет рассматриваете?',
        'Какие основные услуги компании?',
        'Нужен ли каталог услуг на сайте?',
        'Есть ли готовые тексты и фото?',
        'Какие сроки рассматриваете?',
      ],
      draft_reply: 'Добрый день! Спасибо за интерес к разработке сайта. Чтобы подготовить точное предложение, расскажите подробнее о вашей строительной компании: какие услуги предоставляете, какой бюджет рассматриваете и в какие сроки планируете запуск?',
    },
    presets_2: {
      summary: 'Потенциальный клиент спрашивает стоимость рекламы без указания ниши, города и других деталей.',
      niche: 'Не определена',
      service_type: 'Реклама',
      budget: 'Не указан',
      urgency: 'Не указана',
      lead_priority: 'cold',
      priority_label_ru: 'Холодный',
      priority_reason: 'Слишком мало информации для квалификации. Не указаны ниша, город, бюджет и цель.',
      questions_to_ask: [
        'Какая у вас ниша / сфера бизнеса?',
        'В каком городе работаете?',
        'Какая цель рекламы?',
        'Какой бюджет рассматриваете?',
        'Какие каналы уже используете?',
      ],
      draft_reply: 'Здравствуйте! Стоимость рекламы зависит от ниши, региона и целей. Чтобы подготовить предварительный расчёт, расскажите, пожалуйста, о вашем бизнесе: какая сфера, город и какой бюджет рассматриваете?',
    },
    presets_3: {
      summary: 'Стоматология в Москве хочет увеличить количество заявок на имплантацию и чистку зубов. Сайт есть, текущая реклама работает слабо.',
      niche: 'Стоматология',
      service_type: 'Performance-реклама / Лидогенерация',
      budget: '200 000 ₽/мес',
      urgency: 'Не указана',
      lead_priority: 'hot',
      priority_label_ru: 'Горячий',
      priority_reason: 'Есть конкретная ниша, понятная задача, рекламный бюджет и проблема с текущими заявками.',
      questions_to_ask: [
        'Какая сейчас стоимость заявки?',
        'Какие рекламные каналы уже пробовали?',
        'Какие услуги приоритетны по маржинальности?',
        'Есть ли CRM?',
        'Кто обрабатывает входящие заявки?',
      ],
      draft_reply: 'Здравствуйте! Спасибо за обращение. По описанию вам может подойти аудит текущей рекламы и запуск отдельной воронки под приоритетные услуги: имплантацию и чистку зубов. Чтобы точнее оценить ситуацию, подскажите, пожалуйста, какая сейчас стоимость заявки и какие каналы уже пробовали?',
    },
  };

  if (presetIndex !== -1 && mockResults[`presets_${presetIndex}`]) {
    return new Promise((resolve) => setTimeout(() => resolve(mockResults[`presets_${presetIndex}`]), 2000));
  }

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          summary: 'Заявка от потенциального клиента. Требуется уточнение деталей.',
          niche: 'Не определена',
          service_type: 'Не определён',
          budget: 'Не указан',
          urgency: 'Не указана',
          lead_priority: 'cold',
          priority_label_ru: 'Холодный',
          priority_reason: 'Недостаточно данных для квалификации лида.',
          questions_to_ask: [
            'Какая у вас ниша бизнеса?',
            'Какую задачу хотите решить?',
            'Какой бюджет рассматриваете?',
            'В каком городе работаете?',
            'Какие сроки рассматриваете?',
          ],
          draft_reply: 'Здравствуйте! Спасибо за обращение. Чтобы подготовить предложение, расскажите подробнее о вашем бизнесе и задаче, которую хотите решить.',
        }),
      2000,
    ),
  );
}
