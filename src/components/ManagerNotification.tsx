'use client';

import type { Lead } from '@/lib/demo-data';
import { getPriorityColor } from '@/lib/demo-data';

interface ManagerNotificationProps {
  lead: Lead;
}

export default function ManagerNotification({ lead }: ManagerNotificationProps) {
  const priorityEmoji = lead.lead_priority === 'hot' ? '🔥' : lead.lead_priority === 'warm' ? '💡' : '❄️';

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-slate-500">Уведомление менеджеру</span>
        <span className="text-[9px] text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700/50">
          Telegram
        </span>
      </div>

      <div className="flex justify-center">
        <div className="relative w-[320px]">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 rounded-[3rem] border border-slate-700/50 shadow-2xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-slate-900 rounded-b-2xl border-b border-l border-r border-slate-700/50 z-10 flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-700" />
            <span className="w-16 h-1 rounded-full bg-slate-700" />
          </div>
          <div className="relative z-0 px-4 pt-10 pb-6">
            <div className="bg-slate-800 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2.5 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                  {priorityEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white">AI-ассистент</div>
                  <div className="text-[9px] text-indigo-200">бот • обработана заявка</div>
                </div>
                <span className="text-[8px] text-indigo-200 font-mono">12:45</span>
              </div>

              <div className="p-3 space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${getPriorityColor(lead.lead_priority)}`}>
                    {lead.priority_label_ru}
                  </span>
                  <span className="text-[10px] text-slate-500">{lead.niche}</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div><span className="text-slate-600">Запрос:</span> <span className="text-slate-300 ml-0.5">{lead.service_type}</span></div>
                  <div><span className="text-slate-600">Бюджет:</span> <span className="text-slate-300 ml-0.5 font-medium">{lead.budget}</span></div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{lead.summary}</p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-2.5 border border-slate-700/50">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[10px]">✍️</span>
                    <span className="text-[8px] font-medium text-slate-500">Черновик ответа</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed">{lead.draft_reply}</p>
                </div>

                <div className="flex items-center justify-end pt-1 border-t border-slate-700/50">
                  <span className="text-[9px] text-indigo-400 font-medium">{lead.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-center">
              <div className="w-[100px] h-[4px] rounded-full bg-slate-700/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
