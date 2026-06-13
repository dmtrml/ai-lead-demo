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

  const hotLeads = leads.filter((lead) => lead.lead_priority === 'hot').length;
  const activeLeads = leads.filter((lead) => !['Закрыта', 'Не подходит'].includes(lead.status)).length;
  const allAvailable = !!(integrationStatus?.telegram && integrationStatus?.ai && integrationStatus?.sheets);
  const isMockMode = integrationStatus?.mockMode ?? true;

  if (!pageReady) return <LoadingScreen />;

  return (
    <div className="premium-shell min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <div className="text-sm font-semibold text-slate-100">AI Lead Intelligence</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-600">Sales command center</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allAvailable && <TopBadge tone="live" label="Live" />}
            {isMockMode && <TopBadge tone="demo" label="Demo" />}
            <div className="hidden rounded-full border border-slate-800 bg-slate-950/60 px-2 py-1 sm:flex sm:items-center sm:gap-2">
              <IntegrationDot label="TG" active={integrationStatus?.telegram ?? false} />
              <IntegrationDot label="AI" active={integrationStatus?.ai ?? false} />
              <IntegrationDot label="GS" active={integrationStatus?.sheets ?? false} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:py-10">
        <section className="premium-card rounded-[2.5rem] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <div className="premium-chip mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse-dot" />
                AI sales automation
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-gradient sm:text-5xl lg:text-6xl">
                Премиальный AI-центр для квалификации заявок
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Веб-форма и Telegram превращаются в управляемый pipeline: AI определяет намерение клиента,
                приоритет, бюджет, вопросы для discovery и готовит черновик ответа менеджеру.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <HeroChip label="Telegram intake" active={!!botInfo.link} />
                <HeroChip label="AI qualification" active={integrationStatus?.ai ?? false} />
                <HeroChip label="Sheets sync" active={integrationStatus?.sheets ?? false} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard label="Processed" value={String(leads.length)} hint="total leads" />
              <MetricCard label="Hot leads" value={String(hotLeads)} hint="high intent" accent="rose" />
              <MetricCard label="Active" value={String(activeLeads)} hint="open pipeline" accent="cyan" />
              <MetricCard label="Mode" value={isMockMode ? 'Demo' : 'Live'} hint={allAvailable ? 'ready' : 'setup'} accent="violet" />
            </div>
          </div>
        </section>

        <PipelineFlow activeStep={activeStep} />

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="premium-card rounded-[2rem] p-5 sm:p-6">
            <LeadForm
              message={inputMessage}
              onMessageChange={setInputMessage}
              onSubmit={handleSubmit}
              disabled={isProcessing}
            />

            <div className="mt-5 space-y-3">
              {errorMessage && <Notice tone="error" title="Ошибка обработки" messages={[errorMessage]} />}
              {warnings.length > 0 && <Notice tone="warning" title="Предупреждения" messages={warnings} />}
              {isProcessing && <ProcessingAnimation />}
            </div>
          </section>

          <section className="space-y-5">
            {showResult && currentResult ? (
              <AiResultCard result={currentResult} isNew />
            ) : (
              <EmptyAnalysisPanel />
            )}

            {showNotification && currentLead && <ManagerNotification lead={currentLead} />}
          </section>
        </div>

        <section className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-violet-300/70">CRM layer</div>
              <h2 className="mt-1 text-2xl font-semibold text-slate-50">Lead Inbox</h2>
            </div>
            {sheetsUrl && (
              <a
                href={sheetsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-chip inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:text-cyan-200"
              >
                Open Google Sheets →
              </a>
            )}
          </div>
          <LeadsTable leads={leads} onSelectLead={setSelectedLead} onStatusChange={updateLeadStatus} />
        </section>

        <footer className="pb-8 text-center">
          <p className="text-[10px] text-slate-700">AI Lead Intelligence · premium demo · {new Date().getFullYear()}</p>
        </footer>
      </main>

      <Onboarding botLink={botInfo.link} />
      {selectedLead && <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="premium-shell flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Logo />
        <div className="flex items-end gap-1">
          <span className="w-2 rounded-full bg-cyan-300 animate-wave-1" />
          <span className="w-2 rounded-full bg-violet-300 animate-wave-2" />
          <span className="w-2 rounded-full bg-cyan-300 animate-wave-3" />
        </div>
        <p className="text-xs text-slate-600">Loading command center...</p>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 shadow-lg shadow-violet-500/25">
      <div className="absolute inset-0 rounded-2xl bg-white/10" />
      <span className="relative text-sm font-black text-white">AI</span>
    </div>
  );
}

function TopBadge({ tone, label }: { tone: 'live' | 'demo'; label: string }) {
  const classes = tone === 'live'
    ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
    : 'border-amber-400/25 bg-amber-400/10 text-amber-200';

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'live' ? 'bg-emerald-300 animate-live-pulse' : 'bg-amber-300'}`} />
      {label}
    </div>
  );
}

function IntegrationDot({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-1.5 px-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-cyan-300' : 'bg-slate-700'}`} />
      <span className={`text-[9px] font-semibold ${active ? 'text-cyan-200' : 'text-slate-700'}`}>{label}</span>
    </div>
  );
}

function HeroChip({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`premium-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ${active ? 'text-slate-200' : 'text-slate-600'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-300' : 'bg-slate-700'}`} />
      {label}
    </div>
  );
}

function MetricCard({ label, value, hint, accent = 'slate' }: { label: string; value: string; hint: string; accent?: 'slate' | 'rose' | 'cyan' | 'violet' }) {
  const accentClasses = {
    slate: 'from-slate-400/12 to-transparent text-slate-100',
    rose: 'from-rose-400/18 to-transparent text-rose-100',
    cyan: 'from-cyan-400/18 to-transparent text-cyan-100',
    violet: 'from-violet-400/18 to-transparent text-violet-100',
  }[accent];

  return (
    <div className={`rounded-3xl border border-slate-700/45 bg-gradient-to-br ${accentClasses} p-4 shadow-inner shadow-white/5`}>
      <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-slate-600">{hint}</div>
    </div>
  );
}

function EmptyAnalysisPanel() {
  return (
    <div className="premium-card rounded-[2rem] p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">AI Qualification</div>
          <h2 className="mt-1 text-xl font-semibold text-slate-50">Готов к анализу</h2>
        </div>
        <span className="premium-chip rounded-full px-3 py-1 text-[10px] text-slate-500">idle</span>
      </div>

      <div className="mt-8 rounded-[2rem] border border-slate-700/40 bg-slate-950/40 p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-300/20">◇</div>
          <div>
            <div className="text-sm font-semibold text-slate-200">AI report появится здесь</div>
            <div className="text-xs text-slate-600">Priority, budget, signals, next action, draft reply</div>
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton />
          <Skeleton wide="75%" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <SkeletonBox />
            <SkeletonBox />
            <SkeletonBox />
            <SkeletonBox />
          </div>
        </div>
      </div>
    </div>
  );
}

function Notice({ tone, title, messages }: { tone: 'error' | 'warning'; title: string; messages: string[] }) {
  const classes = tone === 'error'
    ? 'border-rose-400/25 bg-rose-500/10 text-rose-200'
    : 'border-amber-400/25 bg-amber-500/10 text-amber-200';

  return (
    <section className={`rounded-2xl border p-4 ${classes}`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-1 space-y-1">
        {messages.map((message, index) => <p key={index} className="text-xs opacity-80">{message}</p>)}
      </div>
    </section>
  );
}

function Skeleton({ wide = '100%' }: { wide?: string }) {
  return <div className="h-3 rounded-full animate-shimmer" style={{ width: wide }} />;
}

function SkeletonBox() {
  return <div className="h-16 rounded-2xl border border-slate-800 bg-slate-900/50" />;
}
