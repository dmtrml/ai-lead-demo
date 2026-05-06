'use client';

import { useEffect, useState } from 'react';

const stages = [
  'Анализирую сообщение...',
  'Определяю нишу и услугу...',
  'Оцениваю бюджет и срочность...',
  'Квалифицирую лид...',
  'Готовлю черновик ответа...',
];

export default function ProcessingAnimation() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const interval = 120;
    const totalSteps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const pct = current / totalSteps;
      setStageIndex(Math.min(Math.floor(pct * stages.length), stages.length - 1));
      if (current >= totalSteps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-[3px] h-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-[3px] rounded-full bg-indigo-400 transition-all duration-300`}
              style={{
                animationName: 'wave-bar',
                animationDuration: '0.8s',
                animationTimingFunction: 'ease-in-out',
                animationDelay: `${i * 0.1}s`,
                animationIterationCount: 'infinite',
                height: stageIndex >= i ? '24px' : '4px',
                opacity: stageIndex >= i ? 1 : 0.3,
              }}
            />
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200">AI-ассистент обрабатывает заявку</p>
          <p className="text-xs text-slate-500 transition-all duration-300">{stages[stageIndex]}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${((stageIndex + 1) / stages.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] text-slate-500 font-mono tabular-nums w-7 text-right">
          {Math.round(((stageIndex + 1) / stages.length) * 100)}%
        </span>
      </div>
    </div>
  );
}
