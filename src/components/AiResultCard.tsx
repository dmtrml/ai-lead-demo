'use client';

import type { AiResult } from '@/lib/demo-data';

interface AiResultCardProps {
  result: AiResult;
  isNew?: boolean;
}

const priorityConfig: Record<string, { gradient: string; badge: string; dot: string }> = {
  hot: {
    gradient: 'from-red-500/10 to-red-500/5 border-red-500/20',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    dot: 'bg-red-400',
  },
  warm: {
    gradient: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  cold: {
    gradient: 'from-slate-500/10 to-slate-500/5 border-slate-500/20',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    dot: 'bg-slate-400',
  },
};

const priorityEmojis: Record<string, string> = { hot: '🔥', warm: '💡', cold: '❄️' };

export default function AiResultCard({ result, isNew }: AiResultCardProps) {
  const cfg = priorityConfig[result.lead_priority] || priorityConfig.cold;

  return (
    <div
      className={`
        bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm
        ${isNew ? 'animate-fade-in-up' : ''}
      `}
    >
      <div className={`border-b ${cfg.gradient} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse-dot`} />
          <div className="flex items-center gap-2">
            <span className="text-lg">{priorityEmojis[result.lead_priority]}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
              {result.priority_label_ru} лид
            </span>
          </div>
        </div>
        <span className="text-[9px] text-slate-600 font-mono">AI v1.0</span>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-sm text-slate-200 leading-relaxed">{result.summary}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <KV label="Ниша" value={result.niche} />
          <KV label="Услуга" value={result.service_type} />
          <KV label="Бюджет" value={result.budget} />
          <KV label="Срочность" value={result.urgency} />
        </div>

        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          <div>
            <div className="text-[10px] font-medium text-slate-500 mb-0.5">Приоритет</div>
            <p className="text-xs text-slate-300">{result.priority_reason}</p>
          </div>
        </div>

        {result.questions_to_ask.length > 0 && (
          <div>
            <div className="text-[10px] font-medium text-slate-500 mb-1.5">Что уточнить</div>
            <div className="space-y-1">
              {result.questions_to_ask.map((q, i) => (
                <label key={i} className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer group">
                  <span className="w-4 h-4 rounded border border-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-slate-500 transition-colors">
                    <span className="text-[9px] text-slate-600">{i + 1}</span>
                  </span>
                  <span>{q}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">✍️</span>
            <span className="text-[10px] font-medium text-slate-500">Черновик ответа клиенту</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{result.draft_reply}</p>
        </div>
      </div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700/30 rounded-lg px-3 py-2 border border-slate-700/50">
      <div className="text-[10px] font-medium text-slate-500">{label}</div>
      <div className="text-sm font-medium text-slate-200 mt-0.5">{value}</div>
    </div>
  );
}
