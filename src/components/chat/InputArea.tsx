import { useState, useRef, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function InputArea() {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, stopGeneration } = useChatStore();
  const { send } = useChat();

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setError('');
    setText('');
    setImageFile(null);
    setImagePreview(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    try {
      await send(trimmed, imageFile ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки');
    }
  }, [text, isLoading, imageFile, send]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 130)}px`; // ~5 строк
  }

  return (
    <div
      className="border-t shrink-0"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
    >
      <div className="max-w-3xl mx-auto px-4 py-3">

        {/* Image preview */}
        {imagePreview && (
          <div className="mb-2 relative inline-block">
            <img src={imagePreview} alt="preview" className="h-20 rounded-lg object-cover" />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-2">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Input row */}
        <div
          className="flex items-end gap-2 rounded-2xl px-4 py-3"
          style={{ background: 'var(--color-input)' }}
        >
          {/* Attach image */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 mb-0.5 p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            title="Прикрепить изображение"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          <textarea
            ref={textareaRef}
            value={text}
            onChange={autoResize}
            onKeyDown={handleKeyDown}
            placeholder="Напишите сообщение..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed disabled:opacity-50"
            style={{ maxHeight: '130px', color: 'var(--color-text)' }}
          />

          {/* Stop / Send */}
          {isLoading ? (
            <button
              onClick={stopGeneration}
              className="shrink-0 mb-0.5 p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              title="Остановить генерацию"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => void handleSend()}
              disabled={!text.trim()}
              className="shrink-0 mb-0.5 p-1.5 rounded-lg bg-accent hover:bg-accent/80 text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Отправить (Enter)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          )}
        </div>

        <p className="text-center text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
          Enter — отправить · Shift+Enter — новая строка
        </p>
      </div>
    </div>
  );
}
