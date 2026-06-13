'use client';

interface PipelineFlowProps {
  activeStep: number;
}

const steps = [
  { icon: '01', label: 'Получение', desc: 'Захват заявки' },
  { icon: '02', label: 'Анализ', desc: 'AI читает контекст' },
  { icon: '03', label: 'Квалификация', desc: 'Приоритет и сигналы' },
  { icon: '04', label: 'Синхронизация', desc: 'Запись в Sheets' },
  { icon: '05', label: 'Уведомление', desc: 'Менеджер получает разбор' },
];

export default function PipelineFlow({ activeStep }: PipelineFlowProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">Automation rail</div>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">AI-пайплайн обработки заявки</h2>
        </div>
        <div className="premium-chip inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse-dot" />
          Этап {Math.min(activeStep + 1, steps.length)}/{steps.length}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-700/40 bg-slate-950/40 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-5">
          {steps.map((step, i) => {
            const isDone = i < activeStep;
            const isActive = i === activeStep;
            const isPending = i > activeStep;

            return (
              <div
                key={step.label}
                className={`relative rounded-2xl border p-3 transition-all duration-500 ${
                  isActive
                    ? 'border-cyan-300/40 bg-cyan-400/10 shadow-lg shadow-cyan-500/10'
                    : isDone
                      ? 'border-violet-400/30 bg-violet-500/10'
                      : 'border-slate-700/40 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3 sm:block">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-[10px] font-bold tracking-wider transition-all ${
                      isDone
                        ? 'border-violet-300/30 bg-violet-400/20 text-violet-100'
                        : isActive
                          ? 'border-cyan-300/40 bg-cyan-300/15 text-cyan-100 premium-glow'
                          : 'border-slate-700 bg-slate-900 text-slate-600'
                    }`}
                  >
                    {isDone ? '✓' : step.icon}
                  </div>
                  <div className="mt-0 sm:mt-3">
                    <div className={`text-sm font-semibold ${isPending ? 'text-slate-500' : 'text-slate-100'}`}>{step.label}</div>
                    <div className={`mt-0.5 text-[10px] leading-tight ${isPending ? 'text-slate-700' : 'text-slate-400'}`}>{step.desc}</div>
                  </div>
                </div>
                {isActive && <div className="mt-3 h-1 rounded-full animate-flow-gradient" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
