import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import type { Chat } from '@/types';

interface Props {
  chat: Chat;
  isActive: boolean;
  onSelect?: () => void;
}

export function ChatItem({ chat, isActive, onSelect }: Props) {
  const { selectChat, deleteChat, updateChatTitle } = useChatStore();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(chat.title);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function handleRename() {
    const trimmed = title.trim();
    if (trimmed && trimmed !== chat.title) {
      updateChatTitle(chat.id, trimmed);
    } else {
      setTitle(chat.title);
    }
    setEditing(false);
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirmDelete(true);
  }

  function handleConfirmDelete(e: React.MouseEvent) {
    e.stopPropagation();
    deleteChat(chat.id);
  }

  function handleCancelDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirmDelete(false);
  }

  return (
    <div
      onClick={() => { selectChat(chat.id); onSelect?.(); }}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isActive ? 'bg-input' : 'hover:bg-white/5'
      }`}
    >
      <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
      </svg>

      {editing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') { setTitle(chat.title); setEditing(false); }
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent text-sm outline-none border-b border-accent min-w-0"
        />
      ) : (
        <span className="flex-1 text-sm truncate text-gray-200">{chat.title}</span>
      )}

      {confirmDelete ? (
        <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleConfirmDelete}
            className="text-xs text-red-400 hover:text-red-300 px-1"
            title="Удалить"
          >
            Да
          </button>
          <button
            onClick={handleCancelDelete}
            className="text-xs text-gray-400 hover:text-gray-300 px-1"
            title="Отмена"
          >
            Нет
          </button>
        </div>
      ) : (
        <div className="hidden group-hover:flex gap-1 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            title="Переименовать"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400"
            title="Удалить"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
