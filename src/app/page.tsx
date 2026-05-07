'use client';

import { useState, useCallback, useEffect } from 'react';
import { initialLeads, type Lead, type AiResult } from '@/lib/demo-data';
import PipelineFlow from '@/components/PipelineFlow';
import LeadForm from '@/components/LeadForm';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import AiResultCard from '@/components/AiResultCard';
import ManagerNotification from '@/components/ManagerNotification';
import LeadsTable from '@/components/LeadsTable';
import LeadDetailPanel from '@/components/LeadDetailPanel';
import Onboarding from '@/components/Onboarding';

interface IntegrationStatus {
  telegram: boolean;
  ai: boolean;
  sheets: boolean;
  mockMode: boolean;
  sheetsUrl?: string | null;
}

interface BotInfo {
  username: string | null;
  link: string | null;
}

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
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
  const [botInfo, setBotInfo] = useState<BotInfo>({ username: null, link: null });
  const [sheetsUrl, setSheetsUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setIntegrationStatus(data);
          if (data.sheetsUrl) setSheetsUrl(data.sheetsUrl);
        }
      })
      .catch(() => {
        setIntegrationStatus({ telegram: false, ai: false, sheets: false, mockMode: true });
      });

    fetch('/api/leads')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.leads.length > 0) {
          setLeads(data.leads);
        } else {
          setLeads(initialLeads);
        }
      })
      .catch(() => setLeads(initialLeads));

    fetch('/api/telegram/bot-info')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setBotInfo({ username: data.username, link: data.link });
      })
      .catch(() => {});
  }, []);

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

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
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
          </div>

          <div className="lg:col-span-2 space-y-6">
            {botInfo.link && (
              <section className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🤖</span>
                  <h2 className="text-sm font-bold text-slate-200">Попробуйте сами</h2>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Отправьте свою тестовую заявку в Telegram-бота — увидите, как AI анализирует
                  её в реальном времени, определяет приоритет и готовит черновик ответа.
                </p>
                <a
                  href={botInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500
                             text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/20
                             hover:shadow-xl hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Открыть в Telegram
                </a>
                <p className="text-[9px] text-slate-600 mt-2 text-center">
                  @{botInfo.username} · нажмите /start для инструкции
                </p>
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
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-sm font-bold text-slate-200">Статус интеграций</h2>
              </div>
              <div className="space-y-2.5">
                <StatusRow label="Telegram Bot" ok={!!botInfo.link} detail={botInfo.username ? `@${botInfo.username}` : undefined} />
                <StatusRow label="AI (Qwen)" ok={integrationStatus?.ai ?? false} detail={integrationStatus?.ai ? 'доступен' : 'не настроен'} />
                <StatusRow label="Google Sheets" ok={integrationStatus?.sheets ?? false} detail={integrationStatus?.sheets ? 'доступен' : 'не настроен'} />
              </div>
            </section>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h2 className="text-sm font-bold text-slate-200">Заявки</h2>
              {sheetsUrl && (
                <a
                  href={sheetsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 ml-2 px-2.5 py-1 bg-slate-800 border border-slate-700
                             text-slate-400 hover:text-slate-200 rounded-lg text-[9px] font-medium transition-colors"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                  </svg>
                  Открыть Google Sheets
                </a>
              )}
            </div>
            <span className="text-[10px] text-slate-600">{leads.length} заяв{leads.length === 1 ? 'ка' : leads.length < 5 ? 'ки' : 'ок'}</span>
          </div>
          <LeadsTable
            leads={leads}
            onSelectLead={setSelectedLead}
            onStatusChange={(id, status) =>
              setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
            }
          />
        </section>

        <footer className="text-center pb-8">
          <p className="text-[9px] text-slate-700">AI-ассистент для обработки заявок · v1.0 · {new Date().getFullYear()}</p>
        </footer>
      </main>

      <Onboarding botLink={botInfo.link} />

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

function StatusRow({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-400' : 'bg-slate-700'}`} />
        <span className="text-xs text-slate-300">{label}</span>
      </div>
      {detail && (
        <span className={`text-[10px] ${ok ? 'text-emerald-400' : 'text-slate-600'}`}>{detail}</span>
      )}
    </div>
  );
}
