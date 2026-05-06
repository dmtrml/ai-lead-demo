'use client';

import type { Lead } from '@/lib/demo-data';
import { getPriorityColor, getStatusColor } from '@/lib/demo-data';

interface LeadDetailPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

const priorityEmojis: Record<string, string> = { hot: '🔥', warm: '💡', cold: '❄️' };

export default function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  if (!lead) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-slate-900 border-l border-slate-700/50 z-50 shadow-2xl animate-slide-in-right overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700/50 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-slate-600/50 flex items-center justify-center text-sm font-bold text-slate-300">
              {lead.name[0]}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">{lead.name}</div>
              <div className="text-[10px] text-slate-500">#{lead.id} · {lead.date}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getPriorityColor(lead.lead_priority)}`}>
              {priorityEmojis[lead.lead_priority]} {lead.priority_label_ru}
            </span>
            <span className={`text-[10px] font-medium px-2 py-1 rounded-full border ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-[10px] font-medium text-slate-500 mb-1">Исходное сообщение</div>
            <p className="text-sm text-slate-300 leading-relaxed">{lead.message}</p>
          </div>

          <div>
            <div className="text-[10px] font-medium text-slate-500 mb-2">AI-анализ</div>
            <div className="grid grid-cols-2 gap-2">
              <DetailKV label="Ниша" value={lead.niche} />
              <DetailKV label="Услуга" value={lead.service_type} />
              <DetailKV label="Бюджет" value={lead.budget} />
              <DetailKV label="Срочность" value={lead.urgency} />
            </div>
          </div>

          <div>
            <div className="text-[10px] font-medium text-slate-500 mb-1">Summary</div>
            <p className="text-sm text-slate-300 leading-relaxed">{lead.summary}</p>
          </div>

          <div>
            <div className="text-[10px] font-medium text-slate-500 mb-1">Причина приоритета</div>
            <p className="text-sm text-slate-300">{lead.priority_reason}</p>
          </div>

          {lead.questions_to_ask.length > 0 && (
            <div>
              <div className="text-[10px] font-medium text-slate-500 mb-1.5">Что уточнить</div>
              <div className="space-y-1.5">
                {lead.questions_to_ask.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="w-5 h-5 rounded bg-slate-700/50 flex items-center justify-center text-[10px] text-slate-500 flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-sm">✍️</span>
              <span className="text-[10px] font-medium text-indigo-400">Черновик ответа</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{lead.draft_reply}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
              <span className="text-slate-500">Источник</span>
              <p className="text-slate-300 font-medium mt-0.5">{lead.source}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
              <span className="text-slate-500">Ответственный</span>
              <p className="text-slate-300 font-medium mt-0.5">{lead.responsible}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailKV({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
      <div className="text-[10px] font-medium text-slate-500">{label}</div>
      <div className="text-sm text-slate-200 mt-0.5">{value}</div>
    </div>
  );
}
