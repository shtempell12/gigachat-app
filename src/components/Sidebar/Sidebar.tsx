import { useChatStore } from '@/store/chatStore';
import { ChatItem } from './ChatItem';
import { SearchBar } from './SearchBar';

export function Sidebar() {
  const { currentChatId, createChat, filteredChats } = useChatStore();
  const chats = filteredChats();

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-sidebar h-full border-r border-border">
      <div className="p-3 border-b border-border">
        <button
          onClick={() => createChat()}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Новый чат
        </button>
      </div>

      <div className="p-3">
        <SearchBar />
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
        {chats.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">Нет чатов</p>
        ) : (
          chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === currentChatId}
            />
          ))
        )}
      </div>
    </aside>
  );
}
