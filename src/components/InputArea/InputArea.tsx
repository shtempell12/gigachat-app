import { useState, useRef, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useChat } from '@/hooks/useChat';

export function InputArea() {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, stopGeneration, settings, updateSettings } = useChatStore();
  const { send } = useChat();

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setText('');
    setImageFile(null);
    setImagePreview(null);
    await send(trimmed, imageFile ?? undefined);
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
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }

  return (
    <div className="border-t border-border bg-main">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Settings panel */}
        {settingsOpen && (
          <div className="mb-3 p-4 bg-input rounded-xl grid grid-cols-2 gap-3 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-gray-400">Модель</span>
              <input
                className="bg-black/30 rounded px-2 py-1 outline-none border border-border focus:border-accent"
                value={settings.model}
                onChange={(e) => updateSettings({ model: e.target.value })}
                list="models-list"
              />
              <datalist id="models-list">
                <option value="gpt-4o" />
                <option value="gpt-4o-mini" />
                <option value="gpt-4-turbo" />
                <option value="gpt-3.5-turbo" />
              </datalist>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-400">Temperature: {settings.temperature}</span>
              <input
                type="range" min={0} max={2} step={0.1}
                value={settings.temperature}
                onChange={(e) => updateSettings({ temperature: +e.target.value })}
                className="accent-accent"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-400">Top-P: {settings.top_p}</span>
              <input
                type="range" min={0} max={1} step={0.05}
                value={settings.top_p}
                onChange={(e) => updateSettings({ top_p: +e.target.value })}
                className="accent-accent"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-400">Max tokens: {settings.max_tokens}</span>
              <input
                type="range" min={256} max={8192} step={256}
                value={settings.max_tokens}
                onChange={(e) => updateSettings({ max_tokens: +e.target.value })}
                className="accent-accent"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-400">Repetition penalty: {settings.repetition_penalty}</span>
              <input
                type="range" min={1} max={2} step={0.05}
                value={settings.repetition_penalty}
                onChange={(e) => updateSettings({ repetition_penalty: +e.target.value })}
                className="accent-accent"
              />
            </label>
          </div>
        )}

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

        {/* Input row */}
        <div className="flex items-end gap-2 bg-input rounded-2xl px-4 py-3">
          {/* Attach image */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 mb-0.5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
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
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 resize-none outline-none leading-relaxed"
            style={{ maxHeight: '200px' }}
          />

          {/* Settings toggle */}
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className={`shrink-0 mb-0.5 p-1.5 rounded-lg transition-colors ${
              settingsOpen ? 'text-accent bg-accent/10' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Настройки модели"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* Send / Stop */}
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
              className="shrink-0 mb-0.5 p-1.5 rounded-lg bg-accent text-black hover:bg-accent/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Отправить (Enter)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-center text-xs text-gray-600 mt-2">
          Enter — отправить · Shift+Enter — новая строка
        </p>
      </div>
    </div>
  );
}
