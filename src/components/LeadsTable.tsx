'use client';

import type { Lead } from '@/lib/demo-data';
import { getPriorityColor, getStatusColor } from '@/lib/demo-data';

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export default function LeadsTable({ leads, onSelectLead }: LeadsTableProps) {
  const priorityDots: Record<string, string> = {
    hot: 'bg-red-400',
    warm: 'bg-amber-400',
    cold: 'bg-slate-500',
  };
  const statusDots: Record<string, string> = {
    'Новая': 'bg-blue-400',
    'Связаться': 'bg-purple-400',
    'В работе': 'bg-amber-400',
    'Не подходит': 'bg-red-400',
    'Закрыта': 'bg-slate-500',
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/30 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700/50">
            <Th>ID</Th>
            <Th>Клиент</Th>
            <Th>Ниша</Th>
            <Th>Услуга</Th>
            <Th>Бюджет</Th>
            <Th>Приоритет</Th>
            <Th>Статус</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className="hover:bg-slate-700/20 transition-colors cursor-pointer group"
            >
              <Td>
                <span className="font-mono text-xs text-slate-500">#{lead.id}</span>
              </Td>
              <Td>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-slate-600/50 flex items-center justify-center text-xs font-bold text-slate-300">
                    {lead.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">{lead.name}</div>
                    <div className="text-[10px] text-slate-600">{lead.contact}</div>
                  </div>
                </div>
              </Td>
              <Td>
                <span className="text-sm text-slate-300">{lead.niche || '—'}</span>
              </Td>
              <Td>
                <span className="text-sm text-slate-300">{lead.service_type || '—'}</span>
              </Td>
              <Td>
                <span className="text-sm font-medium text-slate-200">{lead.budget}</span>
              </Td>
              <Td>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${priorityDots[lead.lead_priority] || 'bg-slate-500'}`} />
                  <span className={`text-[10px] font-medium ${getPriorityColor(lead.lead_priority).split(' ')[0]}`}>
                    {lead.priority_label_ru}
                  </span>
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDots[lead.status] || 'bg-slate-500'}`} />
                  <span className={`text-[10px] font-medium ${getStatusColor(lead.status).split(' ')[0]}`}>
                    {lead.status}
                  </span>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-[10px] font-medium text-slate-600 tracking-wider">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 whitespace-nowrap">{children}</td>;
}
