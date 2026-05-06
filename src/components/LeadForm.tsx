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
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
          K
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-slate-200">Клиент</span>
            <span className="text-[9px] text-slate-600">online</span>
          </div>
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Введите текст заявки клиента..."
              rows={3}
              disabled={disabled}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200
                         placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                         focus:border-indigo-500/50 transition-all resize-none disabled:opacity-50
                         backdrop-blur-sm"
            />
            <div className="absolute right-3 bottom-3 text-[9px] text-slate-600">{message.length} зн.</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pl-12">
        {presets.map((preset, i) => (
          <button
            key={i}
            onClick={() => onMessageChange(preset.message)}
            disabled={disabled}
            className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium
              border transition-all duration-200
              ${message === preset.message
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span>{preset.icon}</span>
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end pl-12">
        <button
          onClick={onSubmit}
          disabled={disabled || !message.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600
                     text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/20
                     hover:shadow-xl hover:shadow-indigo-500/30 hover:from-indigo-400 hover:to-purple-500
                     active:scale-[0.98] transition-all duration-200
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
        >
          {disabled ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Обработка...
            </>
          ) : (
            <>
              Отправить заявку
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9-7-9-7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
