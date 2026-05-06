export interface AiResult {
  summary: string;
  niche: string;
  service_type: string;
  budget: string;
  urgency: string;
  lead_priority: 'hot' | 'warm' | 'cold';
  priority_label_ru: string;
  priority_reason: string;
  questions_to_ask: string[];
  draft_reply: string;
}

export interface Lead {
  id: string;
  date: string;
  name: string;
  contact: string;
  source: string;
  message: string;
  niche: string;
  service_type: string;
  budget: string;
  urgency: string;
  summary: string;
  lead_priority: 'hot' | 'warm' | 'cold';
  priority_label_ru: string;
  priority_reason: string;
  questions_to_ask: string[];
  draft_reply: string;
  status: string;
  responsible: string;
}

export interface PresetMessage {
  label: string;
  icon: string;
  message: string;
  color: string;
}

export const presets: PresetMessage[] = [
  {
    label: 'Горячий лид',
    icon: '🔥',
    message: 'Здравствуйте. У нас онлайн-школа английского, хотим запустить рекламу и получать заявки на пробные занятия. Бюджет 150 000 ₽ в месяц. Сайт есть, но конверсия слабая.',
    color: 'from-red-500/10 to-red-500/5 border-red-500/20 hover:border-red-500/40',
  },
  {
    label: 'Тёплый лид',
    icon: '💡',
    message: 'Добрый день. Интересует разработка сайта для небольшой строительной компании. Пока изучаем варианты и цены. Нужно понять, сколько это может стоить и какие сроки.',
    color: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
  },
  {
    label: 'Холодный лид',
    icon: '❄️',
    message: 'Сколько стоит реклама?',
    color: 'from-slate-500/10 to-slate-500/5 border-slate-500/20 hover:border-slate-500/40',
  },
  {
    label: 'Стоматология',
    icon: '🦷',
    message: 'Здравствуйте. Нужна реклама для стоматологии в Москве. Сейчас заявки идут плохо, сайт есть, бюджет на рекламу 200 000 ₽ в месяц. Хотим больше заявок на имплантацию и чистку зубов.',
    color: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40',
  },
];

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

function simulateAiProcessing(message: string): Promise<AiResult> {
  const presetIndex = presets.findIndex((p) => p.message === message);
  if (presetIndex !== -1 && mockResults[`presets_${presetIndex}`]) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockResults[`presets_${presetIndex}`]), 2500);
    });
  }
  return new Promise((resolve) => {
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
            'Какой сроки рассматриваете?',
          ],
          draft_reply: 'Здравствуйте! Спасибо за обращение. Чтобы подготовить предложение, расскажите подробнее о вашем бизнесе и задаче, которую хотите решить.',
        }),
      2500,
    );
  });
}

export function processLead(message: string): Promise<{
  lead: Lead;
  aiResult: AiResult;
}> {
  return simulateAiProcessing(message).then((aiResult) => {
    const lead: Lead = {
      id: `00${Math.floor(Math.random() * 900) + 100}`,
      date: new Date().toLocaleString('ru-RU'),
      name: 'Не указано',
      contact: 'Telegram',
      source: 'Telegram bot',
      message,
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
      status: 'Новая',
      responsible: 'Менеджер',
    };
    return { lead, aiResult };
  });
}

export const initialLeads: Lead[] = [
  {
    id: '001',
    date: '05.05.2026, 10:30',
    name: 'Анна С.',
    contact: '@anna_english',
    source: 'Telegram bot',
    message: presets[0].message,
    niche: 'Онлайн-образование / Онлайн-школа',
    service_type: 'Реклама / Лидогенерация',
    budget: '150 000 ₽/мес',
    urgency: 'Не указана',
    summary: 'Онлайн-школа английского языка хочет запустить рекламу для получения заявок на пробные занятия.',
    lead_priority: 'hot',
    priority_label_ru: 'Горячий',
    priority_reason: 'Есть бюджет и понятная цель',
    questions_to_ask: ['Какие рекламные каналы уже пробовали?', 'Какая текущая стоимость заявки?', 'Какие гео планируете?'],
    draft_reply: 'Здравствуйте! По описанию вам может подойти аудит текущей рекламы и запуск воронки под пробные занятия.',
    status: 'Связаться',
    responsible: 'Менеджер',
  },
  {
    id: '002',
    date: '05.05.2026, 10:15',
    name: 'Сергей К.',
    contact: '@serg_build',
    source: 'Telegram bot',
    message: presets[1].message,
    niche: 'Строительство',
    service_type: 'Разработка сайта',
    budget: 'Не указан',
    urgency: 'Не указана',
    summary: 'Строительная компания изучает возможность разработки сайта.',
    lead_priority: 'warm',
    priority_label_ru: 'Тёплый',
    priority_reason: 'Есть интерес, но клиент изучает варианты',
    questions_to_ask: ['Какой бюджет рассматриваете?', 'Какие основные услуги компании?', 'Какие сроки?'],
    draft_reply: 'Добрый день! Чтобы подготовить точное предложение, расскажите подробнее о вашей компании.',
    status: 'Новая',
    responsible: 'Менеджер',
  },
  {
    id: '003',
    date: '05.05.2026, 09:50',
    name: 'Дмитрий В.',
    contact: '@dmitry_v',
    source: 'Telegram bot',
    message: presets[2].message,
    niche: 'Не определена',
    service_type: 'Реклама',
    budget: 'Не указан',
    urgency: 'Не указана',
    summary: 'Потенциальный клиент спрашивает стоимость рекламы без указания деталей.',
    lead_priority: 'cold',
    priority_label_ru: 'Холодный',
    priority_reason: 'Слишком мало информации',
    questions_to_ask: ['Какая у вас ниша бизнеса?', 'В каком городе работаете?', 'Какая цель рекламы?', 'Какой бюджет?'],
    draft_reply: 'Здравствуйте! Стоимость рекламы зависит от ниши и региона. Расскажите о вашем бизнесе подробнее.',
    status: 'Новая',
    responsible: 'Менеджер',
  },
  {
    id: '004',
    date: '05.05.2026, 09:20',
    name: 'Елена М.',
    contact: '@elena_dent',
    source: 'Telegram bot',
    message: presets[3].message,
    niche: 'Стоматология',
    service_type: 'Performance-реклама / Лидогенерация',
    budget: '200 000 ₽/мес',
    urgency: 'Не указана',
    summary: 'Стоматология в Москве хочет увеличить количество заявок на имплантацию и чистку зубов.',
    lead_priority: 'hot',
    priority_label_ru: 'Горячий',
    priority_reason: 'Есть ниша, бюджет, проблема и конкретные услуги',
    questions_to_ask: ['Какая сейчас стоимость заявки?', 'Какие каналы пробовали?', 'Есть ли CRM?'],
    draft_reply: 'Здравствуйте! Вам может подойти аудит текущей рекламы и запуск отдельной воронки под имплантацию и чистку зубов.',
    status: 'Новая',
    responsible: 'Менеджер',
  },
];

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'hot':
      return 'text-red-300 bg-red-500/10 border-red-500/30';
    case 'warm':
      return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    case 'cold':
      return 'text-slate-300 bg-slate-500/10 border-slate-500/30';
    default:
      return 'text-slate-300 bg-slate-500/10 border-slate-500/30';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Новая':
      return 'text-blue-300 bg-blue-500/10 border-blue-500/30';
    case 'Связаться':
      return 'text-purple-300 bg-purple-500/10 border-purple-500/30';
    case 'В работе':
      return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    case 'Не подходит':
      return 'text-red-300 bg-red-500/10 border-red-500/30';
    case 'Закрыта':
      return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    default:
      return 'text-slate-300 bg-slate-500/10 border-slate-500/30';
  }
}
