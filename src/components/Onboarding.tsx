'use client';

import { useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'ai-lead-demo-onboarding-done';

interface OnboardingProps {
  botLink?: string | null;
}

export default function Onboarding({ botLink }: OnboardingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const steps = useMemo(() => [
    {
      icon: '👋',
      title: 'Добро пожаловать в демо AI-ассистента',
      description:
        'Этот инструмент показывает, как AI автоматизирует обработку входящих заявок: от получения сообщения до готового черновика ответа менеджеру.',
      hint: 'Весь процесс занимает 2-3 секунды.',
    },
    {
      icon: '✉️',
      title: '1. Отправьте заявку',
      description:
        'Выберите один из готовых сценариев (горячий, тёплый, холодный лид) или введите свой текст. Нажмите "Отправить заявку" — AI начнёт анализ.',
      hint: 'Наведите на пресеты выше — это реальные примеры заявок.',
    },
    {
      icon: '🤖',
      title: '2. AI-анализ за 2 секунды',
      description:
        'Искусственный интеллект определяет нишу клиента, тип услуги, бюджет, срочность и квалифицирует лид: горячий, тёплый или холодный.',
      hint: 'AI также готовит черновик первого ответа и список уточняющих вопросов.',
    },
    {
      icon: '📊',
      title: '3. Данные в таблице',
      description:
        'Все заявки автоматически записываются в Google Sheets. Менеджер видит структурированную карточку лида и не тратит время на ручной ввод.',
      hint: 'Вы можете открыть таблицу по кнопке "Открыть Google Sheets" над списком заявок.',
    },
    {
      icon: '📱',
      title: '4. Попробуйте сами',
      description:
        'Хотите увидеть, как это работает на практике? Отправьте свою тестовую заявку в Telegram-бота — вы получите мгновенный ответ с AI-анализом.',
      hint: botLink ? 'Бот доступен по ссылке справа 👉' : undefined,
    },
  ], [botLink]);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setIsOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const current = steps[step];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />

      <div className="relative bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-fade-in-up">
        <button
          onClick={close}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 border border-slate-700
                     flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-3xl mb-4">
            {current.icon}
          </div>
          <h2 className="text-lg font-bold text-slate-100 mb-2">{current.title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">{current.description}</p>
          {current.hint && (
            <p className="text-[11px] text-indigo-400/70 mt-3 max-w-xs">{current.hint}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={close}
            className="px-4 py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Пропустить
          </button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl
                           text-xs font-medium hover:bg-slate-700 transition-colors"
              >
                Назад
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl
                           text-xs font-medium shadow-lg shadow-indigo-500/20 hover:shadow-xl
                           hover:shadow-indigo-500/30 transition-all"
              >
                Далее
              </button>
            ) : (
              <button
                onClick={close}
                className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl
                           text-xs font-medium shadow-lg shadow-indigo-500/20 hover:shadow-xl
                           hover:shadow-indigo-500/30 transition-all"
              >
                {'Начать демо →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
