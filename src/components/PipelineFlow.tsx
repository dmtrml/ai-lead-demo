'use client';

interface PipelineFlowProps {
  activeStep: number;
}

const steps = [
  { icon: '✉️', label: 'Заявка', desc: 'Клиент отправляет сообщение' },
  { icon: '🤖', label: 'AI-анализ', desc: 'Определяем нишу, бюджет, приоритет' },
  { icon: '📊', label: 'Таблица', desc: 'Данные записаны в Google Sheets' },
  { icon: '🔔', label: 'Уведомление', desc: 'Менеджеру отправлен разбор' },
  { icon: '✍️', label: 'Черновик', desc: 'Готов ответ клиенту' },
];

export default function PipelineFlow({ activeStep }: PipelineFlowProps) {
  return (
    <div className="relative">
      <svg
        className="absolute top-0 left-0 w-full h-12 pointer-events-none z-0 overflow-visible"
        viewBox="0 0 100 48"
        preserveAspectRatio="none"
      >
        {steps.slice(0, -1).map((_, i) => {
          const x1 = ((2 * i + 1) * 100) / (steps.length * 2);
          const x2 = ((2 * i + 3) * 100) / (steps.length * 2);
          const isActive = i < activeStep;
          return (
            <line
              key={i}
              x1={x1}
              y1="24"
              x2={x2}
              y2="24"
              stroke={isActive ? 'url(#lineGradient)' : '#334155'}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          );
        })}
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="grid grid-cols-5 relative z-10 gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex justify-center">
            <div className="relative flex items-center justify-center">
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-2xl
                  transition-all duration-500 ease-out
                  ${i < activeStep
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 scale-105'
                    : i === activeStep
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 animate-pulse scale-105'
                      : 'bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm'}
                `}
              >
                {i < activeStep ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-lg ${i > activeStep ? 'opacity-40' : ''}`}>{step.icon}</span>
                )}
              </div>
              {i === activeStep && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-0 mt-3">
        {steps.map((step, i) => (
          <div key={i} className="text-center">
            <div
              className={`text-xs font-semibold transition-all duration-300 ${
                i <= activeStep ? 'text-slate-100' : 'text-slate-600'
              }`}
            >
              {step.label}
            </div>
            <div
              className={`hidden sm:block text-[10px] mt-0.5 leading-tight transition-all duration-300 ${
                i <= activeStep ? 'text-slate-400' : 'text-slate-700'
              }`}
            >
              {step.desc}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-600 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i <= activeStep ? 'bg-indigo-400' : 'bg-slate-700'
              }`}
            />
          ))}
          <span className="ml-1.5 text-slate-500">Этап {Math.min(activeStep + 1, steps.length)}/{steps.length}</span>
        </div>
      </div>
    </div>
  );
}
