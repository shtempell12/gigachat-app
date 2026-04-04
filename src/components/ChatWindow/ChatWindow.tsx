import { useChatStore } from '@/store/chatStore';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { MessageItem } from './MessageItem';

export function ChatWindow() {
  const currentChat = useChatStore((s) => s.currentChat());
  const messages = currentChat?.messages ?? [];
  const bottomRef = useAutoScroll([messages.length, messages.at(-1)?.content]);

  if (!currentChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <span className="text-3xl">G</span>
        </div>
        <h1 className="text-2xl font-semibold mb-2">GigaChat</h1>
        <p className="text-gray-400 text-sm">Выберите чат или начните новый</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <p className="text-gray-400 text-sm">Начните диалог</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto pb-8">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
