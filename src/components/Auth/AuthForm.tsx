import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function AuthForm() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const { setApiKey } = useUIStore();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) {
      setError('Введите API ключ');
      return;
    }
    if (!trimmed.startsWith('gsk_')) {
      setError('API ключ должен начинаться с «gsk_»');
      return;
    }
    setError('');
    setApiKey(trimmed);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-accent">G</span>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">GigaChat App</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            Введите API ключ для начала работы
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Groq API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => { setKey(e.target.value); setError(''); }}
              placeholder="gsk_..."
              className="w-full bg-[var(--color-input)] text-[var(--color-text)] rounded-xl px-4 py-3 outline-none border border-[var(--color-border)] focus:border-accent transition-colors placeholder-[var(--color-text-secondary)] text-sm"
              autoComplete="off"
            />
          </div>

          {error && <ErrorMessage message={error} />}

          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent/80 text-black font-medium rounded-xl py-3 text-sm transition-colors"
          >
            Войти
          </button>

          <p className="text-center text-xs text-[var(--color-text-secondary)]">
            Ключ хранится в localStorage вашего браузера.{' '}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Получить ключ →
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
