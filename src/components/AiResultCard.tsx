'use client';

import type { AiResult } from '@/lib/demo-data';

interface AiResultCardProps {
  result: AiResult;
  isNew?: boolean;
}

const priorityConfig: Record<string, { label: string; glow: string; badge: string; dot: string; score: number }> = {
  hot: {
    label: 'High intent',
    glow: 'from-rose-500/20 via-red-500/10 to-transparent border-rose-400/25',
    badge: 'bg-rose-500/15 text-rose-200 border-rose-400/30',
    dot: 'bg-rose-300',
    score: 92,
  },
  warm: {
    label: 'Qualified',
    glow: 'from-amber-500/20 via-yellow-500/10 to-transparent border-amber-400/25',
    badge: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
    dot: 'bg-amber-300',
    score: 78,
  },
  cold: {
    label: 'Low intent',
    glow: 'from-slate-500/16 via-slate-500/8 to-transparent border-slate-500/25',
    badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    dot: 'bg-slate-400',
    score: 54,
  },
};

export default function AiResultCard({ result, isNew }: AiResultCardProps) {
  const cfg = priorityConfig[result.lead_priority] || priorityConfig.cold;
  const signals = buildSignals(result);

  return (
    <div className={`premium-card rounded-[2rem] ${isNew ? 'animate-fade-in-up' : ''}`}>
      <div className={`border-b bg-gradient-to-br ${cfg.glow} px-5 py-5 sm:px-6`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${cfg.dot} animate-pulse-dot`} />
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">AI Qualification</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${cfg.badge}`}>
                {result.priority_label_ru} lead
              </span>
              <span className="premium-chip rounded-full px-3 py-1 text-xs text-slate-400">{cfg.label}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 px-4 py-3 text-right">
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Confidence</div>
            <div className="mt-1 text-2xl font-semibold text-slate-50">{cfg.score}%</div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Executive summary</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{result.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Signal label="Ниша" value={result.niche} />
          <Signal label="Услуга" value={result.service_type} />
          <Signal label="Бюджет" value={result.budget} />
          <Signal label="Срочность" value={result.urgency} />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="premium-surface rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Detected signals</div>
              <span className="text-[10px] text-cyan-300">{signals.filter(Boolean).length}/4</span>
            </div>
            <div className="space-y-2">
              {signals.map((signal) => (
                <div key={signal.label} className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/35 px-3 py-2">
                  <span className="text-xs text-slate-300">{signal.label}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${signal.active ? 'bg-emerald-300' : 'bg-slate-700'}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="premium-surface rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Recommended next action</div>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">{result.priority_reason}</p>
          </div>
        </div>

        {result.questions_to_ask.length > 0 && (
          <div className="premium-surface rounded-2xl p-4">
            <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-slate-500">Discovery questions</div>
            <div className="space-y-2">
              {result.questions_to_ask.map((q, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-950/35 px-3 py-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[10px] font-bold text-violet-200 ring-1 ring-violet-400/25">
                    {i + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-slate-300">{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-cyan-400/5 p-4">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-base">✍️</span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">Draft reply</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">{result.draft_reply}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="premium-surface rounded-2xl px-3 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-600">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-slate-100">{value || '—'}</div>
    </div>
  );
}

function buildSignals(result: AiResult) {
  const budget = result.budget?.toLowerCase() || '';
  const urgency = result.urgency?.toLowerCase() || '';

  return [
    { label: 'Бюджет обнаружен', active: !!result.budget && !budget.includes('не') && result.budget !== '—' },
    { label: 'Понятная ниша', active: !!result.niche && result.niche !== '—' },
    { label: 'Есть конкретная услуга', active: !!result.service_type && result.service_type !== '—' },
    { label: 'Срочность понятна', active: !!result.urgency && !urgency.includes('не') && result.urgency !== '—' },
  ];
}
