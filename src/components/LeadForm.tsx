'use client';

import { presets } from '@/lib/demo-data';

interface LeadFormProps {
  message: string;
  onMessageChange: (msg: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function LeadForm({ message, onMessageChange, onSubmit, disabled }: LeadFormProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-violet-300/70">Command input</div>
          <h2 className="mt-1 text-xl font-semibold text-slate-50">Analyze new lead</h2>
          <p className="mt-1 text-xs text-slate-500">Вставьте сообщение клиента или выберите готовый сценарий.</p>
        </div>
        <div className="premium-chip inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[10px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          AI ready
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {presets.map((preset, i) => {
          const isSelected = message === preset.message;

          return (
            <button
              key={i}
              onClick={() => onMessageChange(preset.message)}
              disabled={disabled}
              className={`group rounded-2xl border p-3 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-violet-300/40 bg-violet-500/15 shadow-lg shadow-violet-500/10'
                  : 'border-slate-700/50 bg-slate-950/30 hover:border-slate-500/70 hover:bg-slate-900/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/80 text-base ring-1 ring-slate-700/60 group-hover:ring-violet-400/30 transition-all">
                  {preset.icon}
                </span>
                <div>
                  <div className={`text-xs font-semibold ${isSelected ? 'text-violet-100' : 'text-slate-300'}`}>{preset.label}</div>
                  <div className="text-[10px] text-slate-600">Lead scenario</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative rounded-3xl border border-slate-700/50 bg-slate-950/50 p-1 shadow-2xl shadow-black/20">
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value.slice(0, 4000))}
          placeholder="Например: У нас онлайн-школа английского, хотим запустить рекламу. Бюджет 150 000 ₽ в месяц..."
          rows={7}
          disabled={disabled}
          maxLength={4000}
          className="min-h-[190px] w-full resize-none rounded-[1.35rem] bg-transparent px-5 py-4 text-sm leading-relaxed text-slate-100 outline-none placeholder:text-slate-600 disabled:opacity-50"
        />
        <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-3">
          <div className="flex items-center gap-2 text-[10px] text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/70" />
            {message.length} / 4000 символов
          </div>
          <button
            onClick={onSubmit}
            disabled={disabled || !message.trim()}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-cyan-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
          >
            {disabled ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing
              </>
            ) : (
              <>
                Analyze lead
                <span className="text-base leading-none">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
