import { useChatStore } from '@/store/chatStore';
import { useUIStore } from '@/store/uiStore';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { Message } from '@/components/chat/Message';
import { TypingIndicator } from '@/components/ui/TypingIndicator';

export function ChatWindow() {
  const currentChat = useChatStore((s) => s.currentChat());
  const isLoading = useChatStore((s) => s.isLoading);
  const messages = currentChat?.messages ?? [];
  const { toggleSidebar, openSettings } = useUIStore();
  const bottomRef = useAutoScroll([messages.length, messages.at(-1)?.content]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[var(--color-bg)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] shrink-0">
        {/* Burger (mobile) */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          title="Открыть меню"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h2 className="text-sm font-medium text-[var(--color-text)] truncate flex-1 mx-3 md:mx-0">
          {currentChat?.title ?? 'GigaChat App'}
        </h2>

        {/* Settings button */}
        <button
          onClick={openSettings}
          className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          title="Настройки"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Messages or empty state */}
      {!currentChat || messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-accent">G</span>
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text)] mb-1">
            {currentChat ? 'Начните диалог' : 'Выберите чат или создайте новый'}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Напишите сообщение, чтобы начать
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto pb-6">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
            <TypingIndicator isVisible={isLoading && messages.at(-1)?.role !== 'assistant'} />
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </div>
  );
}
