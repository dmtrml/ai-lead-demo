'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { initialLeads, type Lead, type AiResult } from '@/lib/demo-data';
import PipelineFlow from '@/components/PipelineFlow';
import LeadForm from '@/components/LeadForm';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import AiResultCard from '@/components/AiResultCard';
import ManagerNotification from '@/components/ManagerNotification';
import LeadsTable from '@/components/LeadsTable';
import LeadDetailPanel from '@/components/LeadDetailPanel';

interface IntegrationStatus {
  telegram: boolean;
  ai: boolean;
  sheets: boolean;
  mockMode: boolean;
}

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AiResult | null>(null);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [botListening, setBotListening] = useState(false);
  const [lastPollTime, setLastPollTime] = useState<string | null>(null);
  const pollingRef = useRef(false);

  const doPoll = useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    try {
      const res = await fetch('/api/telegram/poll', { method: 'POST' });
      const data = await res.json();
      setLastPollTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (data.success && data.processed > 0) {
        const leadsRes = await fetch('/api/leads');
        const leadsData = await leadsRes.json();
        if (leadsData.success && leadsData.leads.length > 0) {
          setLeads(leadsData.leads);
        }
      }
    } catch {
      /* silent */
    }
    pollingRef.current = false;
  }, []);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setIntegrationStatus(data);
          if (data.telegram && !data.mockMode) setBotListening(true);
        }
      })
      .catch(() => {
        setIntegrationStatus({ telegram: false, ai: false, sheets: false, mockMode: true });
      });

    fetch('/api/leads')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.leads.length > 0) setLeads(data.leads);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!botListening) return;
    let timer: ReturnType<typeof setInterval>;
    const poll = () => doPoll();
    timer = setInterval(poll, 3000);
    const onVisibility = () => {
      if (document.hidden) { clearInterval(timer); }
      else { poll(); timer = setInterval(poll, 3000); }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [botListening, doPoll]);

  const handleSubmit = useCallback(() => {
    if (!inputMessage.trim() || isProcessing) return;

    setIsProcessing(true);
    setActiveStep(1);
    setCurrentResult(null);
    setCurrentLead(null);
    setShowNotification(false);
    setShowResult(false);
    setWarnings([]);

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: inputMessage, source: 'Web form' }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) { setIsProcessing(false); return; }
        setCurrentResult(data.aiResult);
        setCurrentLead(data.lead);
        setLeads((prev) => [data.lead, ...prev]);
        if (data._warnings?.length) setWarnings(data._warnings);

        setActiveStep(2);
        setTimeout(() => setActiveStep(3), 600);
        setTimeout(() => { setActiveStep(4); setShowNotification(true); }, 1200);
        setTimeout(() => { setActiveStep(5); setShowResult(true); setIsProcessing(false); }, 1800);
      })
      .catch(() => setIsProcessing(false));
  }, [inputMessage, isProcessing]);

  const allAvailable = integrationStatus?.telegram && integrationStatus?.ai && integrationStatus?.sheets;
  const isMockMode = integrationStatus?.mockMode ?? true;

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-100">AI-ассистент</h1>
                <p className="text-[10px] text-slate-500">Обработка входящих заявок</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {allAvailable && (
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-pulse" />
                  <span className="text-[9px] font-bold text-emerald-400 tracking-wider">LIVE</span>
                </div>
              )}
              {isMockMode && (
                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[9px] font-bold text-amber-400 tracking-wider">DEMO</span>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-2">
                <IntegrationDot label="TG" active={integrationStatus?.telegram ?? false} />
                <IntegrationDot label="AI" active={integrationStatus?.ai ?? false} />
                <IntegrationDot label="GS" active={integrationStatus?.sheets ?? false} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
          <PipelineFlow activeStep={activeStep} />
        </div>

        <section className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-slate-500">✉️</span>
            <h2 className="text-sm font-bold text-slate-200">Входящая заявка</h2>
            <span className="text-[9px] text-slate-600">Выберите сценарий или введите текст</span>
          </div>
          <LeadForm
            message={inputMessage}
            onMessageChange={setInputMessage}
            onSubmit={handleSubmit}
            disabled={isProcessing}
          />
        </section>

        {isProcessing && (
          <section className="animate-fade-in-up">
            <ProcessingAnimation />
          </section>
        )}

        {showResult && currentResult && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-sm font-bold text-slate-200">Результат AI-анализа</h2>
            </div>
            <AiResultCard result={currentResult} isNew />
          </section>
        )}

        {showNotification && currentLead && (
          <section>
            <ManagerNotification lead={currentLead} />
          </section>
        )}

        {warnings.length > 0 && (
          <section className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-sm">⚠️</span>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-amber-300">Предупреждения</h3>
                {warnings.map((w, i) => (
                  <p key={i} className="text-xs text-amber-400/80">{w}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">🤖</span>
              <div>
                <h2 className="text-sm font-bold text-slate-200">Telegram Bot</h2>
                {botListening && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-status-pulse" />
                    <span className="text-[10px] text-emerald-400 font-medium">Приём заявок</span>
                    {lastPollTime && <span className="text-[9px] text-slate-600">· проверка {lastPollTime}</span>}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => { setWarnings([]); doPoll(); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300
                         rounded-lg text-[10px] font-medium hover:bg-slate-700 hover:text-slate-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Проверить
            </button>
          </div>
          {!integrationStatus?.telegram && (
            <div className="text-xs text-amber-400/80 bg-amber-500/5 rounded-lg px-3 py-2 border border-amber-500/20">
              Telegram бот не настроен. Укажите <code className="text-indigo-400 bg-indigo-500/10 px-1 rounded">TELEGRAM_BOT_TOKEN</code> в .env.local
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h2 className="text-sm font-bold text-slate-200">Заявки</h2>
            </div>
            <span className="text-[10px] text-slate-600">{leads.length} заяв{leads.length === 1 ? 'ка' : leads.length < 5 ? 'ки' : 'ок'}</span>
          </div>
          <LeadsTable leads={leads} onSelectLead={setSelectedLead} />
        </section>

        <footer className="text-center pb-8">
          <p className="text-[9px] text-slate-700">AI-ассистент для обработки заявок · v1.0 · {new Date().getFullYear()}</p>
        </footer>
      </main>

      {selectedLead && (
        <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  );
}

function IntegrationDot({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 animate-pulse-dot' : 'bg-slate-700'}`} />
      <span className={`text-[9px] font-medium ${active ? 'text-emerald-400' : 'text-slate-700'}`}>{label}</span>
    </div>
  );
}
