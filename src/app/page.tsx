'use client';

import { useState } from 'react';
import type { Lead } from '@/lib/demo-data';
import PipelineFlow from '@/components/PipelineFlow';
import LeadForm from '@/components/LeadForm';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import AiResultCard from '@/components/AiResultCard';
import ManagerNotification from '@/components/ManagerNotification';
import LeadsTable from '@/components/LeadsTable';
import LeadDetailPanel from '@/components/LeadDetailPanel';
import Onboarding from '@/components/Onboarding';
import { useIntegrationStatus } from '@/hooks/useIntegrationStatus';
import { useLeads } from '@/hooks/useLeads';
import { useLeadProcessing } from '@/hooks/useLeadProcessing';

export default function Home() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { integrationStatus, botInfo, sheetsUrl, pageReady } = useIntegrationStatus();
  const { leads, addLead, updateLeadStatus } = useLeads(pageReady);
  const {
    inputMessage,
    setInputMessage,
    isProcessing,
    currentResult,
    currentLead,
    activeStep,
    showNotification,
    showResult,
    warnings,
    errorMessage,
    handleSubmit,
  } = useLeadProcessing({ onLeadCreated: addLead });

  const allAvailable = integrationStatus?.telegram && integrationStatus?.ai && integrationStatus?.sheets;
  const isMockMode = integrationStatus?.mockMode ?? true;

  if (!pageReady) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <h1 className="text-base font-bold text-slate-100">AI-ассистент</h1>
              <p className="text-[10px] text-slate-500">Обработка входящих заявок</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {allAvailable && <ModeBadge tone="live" label="LIVE" />}
            {isMockMode && <ModeBadge tone="demo" label="DEMO" />}
            <div className="hidden sm:flex items-center gap-2">
              <IntegrationDot label="TG" active={integrationStatus?.telegram ?? false} />
              <IntegrationDot label="AI" active={integrationStatus?.ai ?? false} />
              <IntegrationDot label="GS" active={integrationStatus?.sheets ?? false} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Card>
          <PipelineFlow activeStep={activeStep} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <SectionTitle icon="✉️" title="Входящая заявка" subtitle="Выберите сценарий или введите текст" />
              <LeadForm
                message={inputMessage}
                onMessageChange={setInputMessage}
                onSubmit={handleSubmit}
                disabled={isProcessing}
              />
            </Card>

            {errorMessage && <Notice tone="error" title="Ошибка обработки" messages={[errorMessage]} />}
            {isProcessing && <ProcessingAnimation />}

            {showResult && currentResult && (
              <section className="space-y-3">
                <SectionTitle icon="📄" title="Результат AI-анализа" />
                <AiResultCard result={currentResult} isNew />
              </section>
            )}

            {showNotification && currentLead && <ManagerNotification lead={currentLead} />}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {botInfo.link && <TelegramTryCard botInfo={botInfo} />}
            {warnings.length > 0 && <Notice tone="warning" title="Предупреждения" messages={warnings} />}

            <Card>
              <SectionTitle icon="⚙️" title="Статус интеграций" />
              <div className="space-y-2.5">
                <StatusRow label="Telegram Bot" ok={!!botInfo.link} detail={botInfo.username ? `@${botInfo.username}` : undefined} />
                <StatusRow label="AI (Qwen)" ok={integrationStatus?.ai ?? false} detail={integrationStatus?.ai ? 'доступен' : 'не настроен'} />
                <StatusRow label="Google Sheets" ok={integrationStatus?.sheets ?? false} detail={integrationStatus?.sheets ? 'доступен' : 'не настроен'} />
              </div>
            </Card>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <SectionTitle icon="🗂️" title="Заявки" />
              {sheetsUrl && (
                <a
                  href={sheetsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 ml-2 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-[9px] font-medium transition-colors"
                >
                  Открыть Google Sheets
                </a>
              )}
            </div>
            <span className="text-[10px] text-slate-600">{leads.length} заяв{leads.length === 1 ? 'ка' : leads.length < 5 ? 'ки' : 'ок'}</span>
          </div>
          <LeadsTable leads={leads} onSelectLead={setSelectedLead} onStatusChange={updateLeadStatus} />
        </section>

        <footer className="text-center pb-8">
          <p className="text-[9px] text-slate-700">AI-ассистент для обработки заявок · v1.0 · {new Date().getFullYear()}</p>
        </footer>
      </main>

      <Onboarding botLink={botInfo.link} />
      {selectedLead && <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Logo />
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-wave-1" />
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-wave-2" />
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-wave-3" />
        </div>
        <p className="text-xs text-slate-600">Загрузка демо...</p>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
      <span className="text-white text-sm font-bold">AI</span>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5 backdrop-blur-sm">{children}</section>;
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-slate-500">{icon}</span>
      <h2 className="text-sm font-bold text-slate-200">{title}</h2>
      {subtitle && <span className="text-[9px] text-slate-600">{subtitle}</span>}
    </div>
  );
}

function ModeBadge({ tone, label }: { tone: 'live' | 'demo'; label: string }) {
  const classes = tone === 'live'
    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    : 'bg-amber-500/10 border-amber-500/20 text-amber-400';

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${classes}`}>
      <span className={`w-2 h-2 rounded-full ${tone === 'live' ? 'bg-emerald-400 animate-live-pulse' : 'bg-amber-400'}`} />
      <span className="text-[9px] font-bold tracking-wider">{label}</span>
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

function TelegramTryCard({ botInfo }: { botInfo: { username: string | null; link: string | null } }) {
  if (!botInfo.link) return null;

  return (
    <section className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-sm">
      <SectionTitle icon="🤖" title="Попробуйте сами" />
      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        Отправьте тестовую заявку в Telegram-бота — увидите, как AI анализирует её в реальном времени,
        определяет приоритет и готовит черновик ответа.
      </p>
      <a
        href={botInfo.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
      >
        Открыть в Telegram
      </a>
      <p className="text-[9px] text-slate-600 mt-2 text-center">@{botInfo.username} · нажмите /start для инструкции</p>
    </section>
  );
}

function Notice({ tone, title, messages }: { tone: 'error' | 'warning'; title: string; messages: string[] }) {
  const classes = tone === 'error'
    ? 'bg-red-500/5 border-red-500/20 text-red-300'
    : 'bg-amber-500/5 border-amber-500/20 text-amber-300';

  return (
    <section className={`rounded-2xl p-4 border animate-fade-in-up ${classes}`}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-sm">{tone === 'error' ? '⛔' : '⚠️'}</span>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          {messages.map((message, index) => <p key={index} className="text-xs opacity-80">{message}</p>)}
        </div>
      </div>
    </section>
  );
}

function StatusRow({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-400' : 'bg-slate-700'}`} />
        <span className="text-xs text-slate-300">{label}</span>
      </div>
      {detail && <span className={`text-[10px] ${ok ? 'text-emerald-400' : 'text-slate-600'}`}>{detail}</span>}
    </div>
  );
}
