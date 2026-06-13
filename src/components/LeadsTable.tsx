'use client';

import { useMemo, useState } from 'react';
import type { Lead } from '@/lib/demo-data';

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onStatusChange?: (leadId: string, newStatus: string) => void;
}

const statusOptions = ['Новая', 'Связаться', 'В работе', 'Не подходит', 'Закрыта'];

const filterTabs = [
  { key: 'all', label: 'All leads' },
  { key: 'hot', label: 'Hot' },
  { key: 'warm', label: 'Warm' },
  { key: 'cold', label: 'Cold' },
];

const priorityStyles: Record<string, { badge: string; dot: string; label: string }> = {
  hot: { badge: 'border-rose-400/30 bg-rose-500/15 text-rose-200', dot: 'bg-rose-300', label: 'High intent' },
  warm: { badge: 'border-amber-400/30 bg-amber-500/15 text-amber-200', dot: 'bg-amber-300', label: 'Qualified' },
  cold: { badge: 'border-slate-500/40 bg-slate-500/15 text-slate-300', dot: 'bg-slate-400', label: 'Low intent' },
};

const statusDots: Record<string, string> = {
  'Новая': 'bg-blue-300',
  'Связаться': 'bg-violet-300',
  'В работе': 'bg-amber-300',
  'Не подходит': 'bg-rose-300',
  'Закрыта': 'bg-slate-500',
};

export default function LeadsTable({ leads, onSelectLead, onStatusChange }: LeadsTableProps) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [openStatusMenu, setOpenStatusMenu] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    let list = leads;

    if (filter !== 'all') list = list.filter((lead) => lead.lead_priority === filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((lead) => [lead.name, lead.niche, lead.message, lead.service_type, lead.budget]
        .some((value) => value.toLowerCase().includes(q)));
    }

    return list;
  }, [leads, filter, search]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: leads.length };
    for (const tab of filterTabs.slice(1)) result[tab.key] = leads.filter((lead) => lead.lead_priority === tab.key).length;
    return result;
  }, [leads]);

  return (
    <div className="space-y-4">
      <div className="premium-card rounded-[2rem] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">Lead inbox</div>
            <h2 className="mt-1 text-xl font-semibold text-slate-50">Pipeline-ready заявки</h2>
          </div>

          <div className="relative w-full lg:w-[320px]">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">⌕</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по клиенту, нише, бюджету..."
              className="w-full rounded-2xl border border-slate-700/50 bg-slate-950/45 py-2.5 pl-9 pr-3 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold transition-all ${
                filter === tab.key
                  ? 'border-cyan-300/35 bg-cyan-300/10 text-cyan-100 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-700/50 bg-slate-950/35 text-slate-500 hover:border-slate-500/60 hover:text-slate-300'
              }`}
            >
              {tab.label}
              <span className="ml-1 opacity-60">{counts[tab.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="premium-card rounded-[2rem] px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl ring-1 ring-slate-700/60">∅</div>
          <p className="mt-4 text-sm font-medium text-slate-400">Нет заявок по выбранному фильтру</p>
          <button
            onClick={() => {
              setFilter('all');
              setSearch('');
            }}
            className="mt-3 text-xs text-cyan-300 hover:text-cyan-200"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredLeads.map((lead) => (
            <LeadInboxCard
              key={lead.id}
              lead={lead}
              openStatusMenu={openStatusMenu}
              setOpenStatusMenu={setOpenStatusMenu}
              onSelectLead={onSelectLead}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between px-1 text-[10px] text-slate-600">
        <span>{filteredLeads.length} из {leads.length} заявок</span>
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

function LeadInboxCard({
  lead,
  openStatusMenu,
  setOpenStatusMenu,
  onSelectLead,
  onStatusChange,
}: {
  lead: Lead;
  openStatusMenu: string | null;
  setOpenStatusMenu: (id: string | null) => void;
  onSelectLead: (lead: Lead) => void;
  onStatusChange?: (leadId: string, newStatus: string) => void;
}) {
  const priority = priorityStyles[lead.lead_priority] || priorityStyles.cold;

  return (
    <article className="group premium-card rounded-[1.75rem] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/25">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_auto] lg:items-center">
        <button className="min-w-0 text-left" onClick={() => onSelectLead(lead)}>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-400/15 text-sm font-bold text-slate-100 ring-1 ring-slate-700/60">
              {lead.name?.[0] || 'L'}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-slate-100">{lead.name}</h3>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priority.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                  {lead.priority_label_ru}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{lead.message}</p>
            </div>
          </div>
        </button>

        <button className="grid grid-cols-3 gap-2 text-left" onClick={() => onSelectLead(lead)}>
          <Mini label="Ниша" value={lead.niche} />
          <Mini label="Услуга" value={lead.service_type} />
          <Mini label="Бюджет" value={lead.budget} />
        </button>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Intent</div>
            <div className="mt-1 text-xs font-semibold text-slate-300">{priority.label}</div>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenStatusMenu(openStatusMenu === lead.id ? null : lead.id);
              }}
              className="inline-flex min-w-[126px] items-center justify-between gap-2 rounded-2xl border border-slate-700/50 bg-slate-950/45 px-3 py-2 text-xs text-slate-300 transition-all hover:border-slate-500/70"
            >
              <span className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${statusDots[lead.status] || 'bg-slate-500'}`} />
                {lead.status}
              </span>
              <span className="text-slate-600">⌄</span>
            </button>

            {openStatusMenu === lead.id && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpenStatusMenu(null)} />
                <div className="absolute right-0 top-full z-20 mt-2 min-w-[160px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange?.(lead.id, status);
                        setOpenStatusMenu(null);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                        status === lead.status ? 'bg-violet-500/10 text-violet-200' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusDots[status] || 'bg-slate-500'}`} />
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/30 px-3 py-2">
      <div className="text-[9px] uppercase tracking-[0.18em] text-slate-600">{label}</div>
      <div className="mt-1 truncate text-xs font-semibold text-slate-300">{value || '—'}</div>
    </div>
  );
}
