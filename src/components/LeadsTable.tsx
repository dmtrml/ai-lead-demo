'use client';

import { useState, useMemo } from 'react';
import type { Lead } from '@/lib/demo-data';
import { getPriorityColor, getStatusColor } from '@/lib/demo-data';

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onStatusChange?: (leadId: string, newStatus: string) => void;
}

const statusOptions = ['Новая', 'Связаться', 'В работе', 'Не подходит', 'Закрыта'];

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

const filterTabs = [
  { key: 'all', label: 'Все' },
  { key: 'hot', label: '🔥 Горячие' },
  { key: 'warm', label: '💡 Тёплые' },
  { key: 'cold', label: '❄️ Холодные' },
];

export default function LeadsTable({ leads, onSelectLead, onStatusChange }: LeadsTableProps) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [openStatusMenu, setOpenStatusMenu] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    let list = leads;

    if (filter !== 'all') {
      list = list.filter((l) => l.lead_priority === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.niche.toLowerCase().includes(q) ||
          l.message.toLowerCase().includes(q) ||
          l.service_type.toLowerCase().includes(q),
      );
    }

    return list;
  }, [leads, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    for (const t of filterTabs.slice(1)) {
      c[t.key] = leads.filter((l) => l.lead_priority === t.key).length;
    }
    return c;
  }, [leads]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex flex-wrap gap-1">
          {filterTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                filter === t.key
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              {t.label}
              <span className="ml-1 text-[9px] opacity-60">({counts[t.key]})</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs w-full sm:ml-auto">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по заявкам..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg
                       text-xs text-slate-300 placeholder:text-slate-600 outline-none
                       focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/30 shadow-sm">
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-xs text-slate-600">Нет заявок по выбранному фильтру</p>
          </div>
        ) : (
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
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-700/20 transition-colors cursor-pointer group"
                >
                  <Td onClick={() => onSelectLead(lead)}>
                    <span className="font-mono text-xs text-slate-500">#{lead.id}</span>
                  </Td>
                  <Td onClick={() => onSelectLead(lead)}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-slate-600/50 flex items-center justify-center text-xs font-bold text-slate-300">
                        {lead.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{lead.name}</div>
                      </div>
                    </div>
                  </Td>
                  <Td onClick={() => onSelectLead(lead)}>
                    <span className="text-sm text-slate-300">{lead.niche || '—'}</span>
                  </Td>
                  <Td onClick={() => onSelectLead(lead)}>
                    <span className="text-sm text-slate-300">{lead.service_type || '—'}</span>
                  </Td>
                  <Td onClick={() => onSelectLead(lead)}>
                    <span className="text-sm font-medium text-slate-200">{lead.budget}</span>
                  </Td>
                  <Td onClick={() => onSelectLead(lead)}>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${priorityDots[lead.lead_priority] || 'bg-slate-500'}`} />
                      <span className={`text-[10px] font-medium ${getPriorityColor(lead.lead_priority).split(' ')[0]}`}>
                        {lead.priority_label_ru}
                      </span>
                    </div>
                  </Td>
                  <Td>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenStatusMenu(openStatusMenu === lead.id ? null : lead.id);
                        }}
                        className="flex items-center gap-1.5 px-1.5 py-1 rounded-md hover:bg-slate-700/50 transition-colors group/status w-full"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDots[lead.status] || 'bg-slate-500'}`} />
                        <span className={`text-[10px] font-medium ${getStatusColor(lead.status).split(' ')[0]}`}>
                          {lead.status}
                        </span>
                        <svg className="w-3 h-3 text-slate-600 group-hover/status:text-slate-400 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {openStatusMenu === lead.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenStatusMenu(null)} />
                          <div className="absolute right-0 top-full mt-1 z-20 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 min-w-[140px]">
                            {statusOptions.map((s) => (
                              <button
                                key={s}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onStatusChange?.(lead.id, s);
                                  setOpenStatusMenu(null);
                                }}
                                className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-2
                                  ${s === lead.status ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-slate-700/50'}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusDots[s] || 'bg-slate-500'}`} />
                                {s}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-600 px-1">
        <span>
          {filteredLeads.length} из {leads.length} заяв{leads.length === 1 ? 'ки' : 'ок'}
        </span>
        <button
          onClick={() => {
            setFilter('all');
            setSearch('');
          }}
          className="hover:text-slate-400 transition-colors"
        >
          Сбросить фильтры
        </button>
      </div>
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

function Td({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <td className={`px-4 py-3 whitespace-nowrap ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      {children}
    </td>
  );
}
