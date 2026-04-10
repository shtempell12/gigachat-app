import { v4 as uuidv4 } from 'uuid';
import type { Chat, Message } from '@/types';

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
}

export type ChatAction =
  | { type: 'ADD_MESSAGE'; chatId: string; message: Omit<Message, 'id' | 'timestamp'> }
  | { type: 'CREATE_CHAT' }
  | { type: 'DELETE_CHAT'; id: string }
  | { type: 'RENAME_CHAT'; id: string; title: string };

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'CREATE_CHAT': {
      const id = uuidv4();
      const newChat: Chat = {
        id,
        title: 'Новый чат',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return {
        chats: [newChat, ...state.chats],
        activeChatId: id,
      };
    }

    case 'DELETE_CHAT': {
      const chats = state.chats.filter((c) => c.id !== action.id);
      const activeChatId =
        state.activeChatId === action.id ? (chats[0]?.id ?? null) : state.activeChatId;
      return { chats, activeChatId };
    }

    case 'RENAME_CHAT': {
      return {
        ...state,
        chats: state.chats.map((c) =>
          c.id === action.id ? { ...c, title: action.title, updatedAt: Date.now() } : c,
        ),
      };
    }

    case 'ADD_MESSAGE': {
      const message: Message = {
        ...action.message,
        id: uuidv4(),
        timestamp: Date.now(),
      };
      return {
        ...state,
        chats: state.chats.map((c) => {
          if (c.id !== action.chatId) return c;
          return {
            ...c,
            messages: [...c.messages, message],
            updatedAt: Date.now(),
          };
        }),
      };
    }

    default:
      return state;
  }
}
