import { useState, useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useChatStore } from '@/store/chatStore';
import { Toggle } from '@/components/ui/Toggle';
import type { ChatSettings } from '@/types';

const DEFAULTS: ChatSettings = {
  model: 'gpt-4o-mini',
  temperature: 1.0,
  top_p: 0.9,
  max_tokens: 2048,
  repetition_penalty: 1.0,
};

const MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'];

export function SettingsPanel() {
  const { isSettingsOpen, closeSettings, theme, toggleTheme, clearApiKey } = useUIStore();
  const { settings, updateSettings } = useChatStore();
  const [local, setLocal] = useState<ChatSettings>(settings);
  const [systemPrompt, setSystemPrompt] = useState('Ты полезный ассистент.');

  useEffect(() => {
    if (isSettingsOpen) setLocal(settings);
  }, [isSettingsOpen, settings]);

  function handleSave() {
    updateSettings(local);
    closeSettings();
  }

  function handleReset() {
    setLocal(DEFAULTS);
    setSystemPrompt('Ты полезный ассистент.');
    updateSettings(DEFAULTS);
  }

  if (!isSettingsOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeSettings}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-sm bg-[var(--color-sidebar)] border-l border-[var(--color-border)] z-50 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-semibold text-[var(--color-text)]">Настройки</h2>
          <button
            onClick={closeSettings}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 space-y-6">

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Модель
            </label>
            <select
              value={local.model}
              onChange={(e) => setLocal({ ...local, model: e.target.value })}
              className="w-full bg-[var(--color-input)] text-[var(--color-text)] rounded-lg px-3 py-2 text-sm outline-none border border-[var(--color-border)] focus:border-accent"
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">Temperature</label>
              <span className="text-sm text-accent font-mono">{local.temperature.toFixed(1)}</span>
            </div>
            <input
              type="range" min={0} max={2} step={0.1}
              value={local.temperature}
              onChange={(e) => setLocal({ ...local, temperature: +e.target.value })}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-1">
              <span>Точнее</span><span>Креативнее</span>
            </div>
          </div>

          {/* Top-P */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">Top-P</label>
              <span className="text-sm text-accent font-mono">{local.top_p.toFixed(2)}</span>
            </div>
            <input
              type="range" min={0} max={1} step={0.05}
              value={local.top_p}
              onChange={(e) => setLocal({ ...local, top_p: +e.target.value })}
              className="w-full accent-accent"
            />
          </div>

          {/* Max tokens */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Max Tokens
            </label>
            <input
              type="number" min={256} max={8192} step={256}
              value={local.max_tokens}
              onChange={(e) => setLocal({ ...local, max_tokens: +e.target.value })}
              className="w-full bg-[var(--color-input)] text-[var(--color-text)] rounded-lg px-3 py-2 text-sm outline-none border border-[var(--color-border)] focus:border-accent"
            />
          </div>

          {/* Repetition penalty */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">Repetition Penalty</label>
              <span className="text-sm text-accent font-mono">{local.repetition_penalty.toFixed(2)}</span>
            </div>
            <input
              type="range" min={1} max={2} step={0.05}
              value={local.repetition_penalty}
              onChange={(e) => setLocal({ ...local, repetition_penalty: +e.target.value })}
              className="w-full accent-accent"
            />
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              System Prompt
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              className="w-full bg-[var(--color-input)] text-[var(--color-text)] rounded-lg px-3 py-2 text-sm outline-none border border-[var(--color-border)] focus:border-accent resize-none"
            />
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Светлая тема</span>
            <Toggle checked={theme === 'light'} onChange={toggleTheme} />
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-[var(--color-border)]">
            <button
              onClick={clearApiKey}
              className="w-full px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
            >
              Сменить API ключ
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--color-border)] flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-text-secondary)] transition-colors"
          >
            Сбросить
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 text-black text-sm font-medium transition-colors"
          >
            Сохранить
          </button>
        </div>
      </aside>
    </>
  );
}
