'use client';

import { useEffect, useState } from 'react';

const stages = [
  'Reading client intent...',
  'Extracting niche and service...',
  'Scoring budget and urgency...',
  'Qualifying lead priority...',
  'Preparing manager handoff...',
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
    <div className="premium-surface rounded-3xl p-5">
      <div className="flex items-center gap-4">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
          <div className="absolute inset-1 rounded-2xl border border-cyan-300/10 animate-orbit-glow" />
          <div className="flex items-end gap-[3px] h-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-cyan-300 transition-all duration-300"
                style={{
                  animationName: 'wave-bar',
                  animationDuration: '0.8s',
                  animationTimingFunction: 'ease-in-out',
                  animationDelay: `${i * 0.1}s`,
                  animationIterationCount: 'infinite',
                  height: stageIndex >= i ? '24px' : '6px',
                  opacity: stageIndex >= i ? 1 : 0.35,
                }}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-100">AI engine is processing</p>
            <span className="font-mono text-[10px] text-cyan-300 tabular-nums">
              {Math.round(((stageIndex + 1) / stages.length) * 100)}%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 transition-all duration-300">{stages[stageIndex]}</p>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400 transition-all duration-200 ease-out"
              style={{ width: `${((stageIndex + 1) / stages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
