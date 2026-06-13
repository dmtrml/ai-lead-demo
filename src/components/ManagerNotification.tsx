'use client';

import type { Lead } from '@/lib/demo-data';

interface ManagerNotificationProps {
  lead: Lead;
}

const priorityStyles: Record<string, { badge: string; dot: string; label: string }> = {
  hot: { badge: 'border-rose-400/30 bg-rose-500/15 text-rose-200', dot: 'bg-rose-300', label: 'High priority' },
  warm: { badge: 'border-amber-400/30 bg-amber-500/15 text-amber-200', dot: 'bg-amber-300', label: 'Qualified' },
  cold: { badge: 'border-slate-500/40 bg-slate-500/15 text-slate-300', dot: 'bg-slate-400', label: 'Low priority' },
};

export default function ManagerNotification({ lead }: ManagerNotificationProps) {
  const priority = priorityStyles[lead.lead_priority] || priorityStyles.cold;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">Manager handoff</div>
          <h3 className="mt-1 text-sm font-semibold text-slate-100">Telegram preview</h3>
        </div>
        <span className="premium-chip rounded-full px-3 py-1 text-[10px] text-slate-400">delivered</span>
      </div>

      <div className="premium-card rounded-[2rem] p-4">
        <div className="rounded-[1.5rem] border border-slate-700/50 bg-slate-950/45 p-3">
          <div className="mb-3 flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/25 text-sm font-bold text-cyan-100 ring-1 ring-cyan-300/20">
              AI
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-100">AI Lead Assistant</div>
              <div className="text-[10px] text-slate-500">бот • новая квалифицированная заявка</div>
            </div>
            <div className="text-[10px] text-slate-600">now</div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${priority.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                {lead.priority_label_ru} · {priority.label}
              </span>
              <span className="premium-chip rounded-full px-2.5 py-1 text-[10px] text-slate-400">{lead.niche}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Запрос" value={lead.service_type} />
              <Field label="Бюджет" value={lead.budget} />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-3">
              <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-600">Summary</div>
              <p className="text-xs leading-relaxed text-slate-300">{lead.summary}</p>
            </div>

            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/5 p-3">
              <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Draft reply</div>
              <p className="text-xs leading-relaxed text-slate-300">{lead.draft_reply}</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <span className="text-[10px] text-slate-600">Lead ID #{lead.id}</span>
              <span className="text-[10px] font-semibold text-cyan-300">{lead.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/35 px-3 py-2">
      <div className="text-[9px] uppercase tracking-[0.2em] text-slate-600">{label}</div>
      <div className="mt-1 truncate text-xs font-semibold text-slate-200">{value || '—'}</div>
    </div>
  );
}
