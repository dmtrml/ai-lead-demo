'use client';

import type { Lead } from '@/lib/demo-data';

interface LeadDetailPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

const priorityStyles: Record<string, { badge: string; dot: string }> = {
  hot: { badge: 'border-rose-400/30 bg-rose-500/15 text-rose-200', dot: 'bg-rose-300' },
  warm: { badge: 'border-amber-400/30 bg-amber-500/15 text-amber-200', dot: 'bg-amber-300' },
  cold: { badge: 'border-slate-500/40 bg-slate-500/15 text-slate-300', dot: 'bg-slate-400' },
};

export default function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  if (!lead) return null;

  const priority = priorityStyles[lead.lead_priority] || priorityStyles.cold;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-slate-950/95 shadow-2xl animate-slide-in-right">
        <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/85 px-5 py-4 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20 text-sm font-bold text-slate-100 ring-1 ring-slate-700/60">
                {lead.name?.[0] || 'L'}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-100">{lead.name}</div>
                <div className="text-[10px] text-slate-600">#{lead.id} · {lead.date} · {lead.source}</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-500 transition-colors hover:border-slate-500 hover:text-slate-200"
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <section className="premium-card rounded-[2rem] p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${priority.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                {lead.priority_label_ru} lead
              </span>
              <span className="premium-chip rounded-full px-3 py-1 text-xs text-slate-300">{lead.status}</span>
            </div>
            <div className="mt-5 text-[10px] uppercase tracking-[0.26em] text-slate-500">Исходное сообщение</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{lead.message}</p>
          </section>

          <section>
            <SectionTitle title="AI-анализ" />
            <div className="grid grid-cols-2 gap-2">
              <DetailKV label="Ниша" value={lead.niche} />
              <DetailKV label="Услуга" value={lead.service_type} />
              <DetailKV label="Бюджет" value={lead.budget} />
              <DetailKV label="Срочность" value={lead.urgency} />
            </div>
          </section>

          <section className="premium-surface rounded-3xl p-4">
            <SectionTitle title="Summary" />
            <p className="text-sm leading-relaxed text-slate-300">{lead.summary}</p>
          </section>

          <section className="premium-surface rounded-3xl p-4">
            <SectionTitle title="Причина приоритета" />
            <p className="text-sm leading-relaxed text-slate-300">{lead.priority_reason}</p>
          </section>

          {lead.questions_to_ask.length > 0 && (
            <section className="premium-surface rounded-3xl p-4">
              <SectionTitle title="Discovery questions" />
              <div className="space-y-2">
                {lead.questions_to_ask.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-2xl bg-slate-950/35 px-3 py-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[10px] font-bold text-violet-200 ring-1 ring-violet-400/25">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-slate-400">{q}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-cyan-300/15 bg-cyan-400/5 p-4">
            <SectionTitle title="Черновик ответа" />
            <p className="text-sm leading-relaxed text-slate-300">{lead.draft_reply}</p>
          </section>

          <section className="grid grid-cols-2 gap-2">
            <DetailKV label="Источник" value={lead.source} />
            <DetailKV label="Ответственный" value={lead.responsible} />
          </section>
        </div>
      </aside>
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-slate-500">{title}</div>;
}

function DetailKV({ label, value }: { label: string; value: string }) {
  return (
    <div className="premium-surface rounded-2xl px-3 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-600">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-200">{value || '—'}</div>
    </div>
  );
}
