import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Chat, Message, ChatSettings } from '@/types';
import { loadChats, saveChats } from '@/utils/storage';

const DEFAULT_SETTINGS: ChatSettings = {
  model: 'GigaChat',
  temperature: 1.0,
  top_p: 0.9,
  max_tokens: 2048,
  repetition_penalty: 1.0,
};

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  settings: ChatSettings;
  isLoading: boolean;
  abortController: AbortController | null;
  searchQuery: string;

  // Selectors
  currentChat: () => Chat | null;
  filteredChats: () => Chat[];

  // Chat actions
  createChat: () => string;
  deleteChat: (id: string) => void;
  updateChatTitle: (id: string, title: string) => void;
  selectChat: (id: string) => void;

  // Message actions
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => Message;
  updateLastAssistantMessage: (chatId: string, content: string, done?: boolean) => void;
  removeLastMessage: (chatId: string) => void;

  // UI actions
  setLoading: (v: boolean) => void;
  setAbortController: (ctrl: AbortController | null) => void;
  stopGeneration: () => void;
  setSearchQuery: (q: string) => void;
  updateSettings: (patch: Partial<ChatSettings>) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: loadChats(),
  currentChatId: null,
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  abortController: null,
  searchQuery: '',

  currentChat: () => {
    const { chats, currentChatId } = get();
    return chats.find((c) => c.id === currentChatId) ?? null;
  },

  filteredChats: () => {
    const { chats, searchQuery } = get();
    if (!searchQuery.trim()) return chats;
    const q = searchQuery.toLowerCase();
    return chats.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => {
          const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
          return content.toLowerCase().includes(q);
        }),
    );
  },

  createChat: () => {
    const id = uuidv4();
    const newChat: Chat = {
      id,
      title: 'Новый чат',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => {
      const chats = [newChat, ...state.chats];
      saveChats(chats);
      return { chats, currentChatId: id };
    });
    return id;
  },

  deleteChat: (id) => {
    set((state) => {
      const chats = state.chats.filter((c) => c.id !== id);
      saveChats(chats);
      const currentChatId =
        state.currentChatId === id
          ? (chats[0]?.id ?? null)
          : state.currentChatId;
      return { chats, currentChatId };
    });
  },

  updateChatTitle: (id, title) => {
    set((state) => {
      const chats = state.chats.map((c) =>
        c.id === id ? { ...c, title, updatedAt: Date.now() } : c,
      );
      saveChats(chats);
      return { chats };
    });
  },

  selectChat: (id) => set({ currentChatId: id }),

  addMessage: (chatId, messageData) => {
    const message: Message = {
      ...messageData,
      id: uuidv4(),
      timestamp: Date.now(),
    };
    set((state) => {
      const chats = state.chats.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          messages: [...c.messages, message],
          updatedAt: Date.now(),
        };
      });
      saveChats(chats);
      return { chats };
    });
    return message;
  },

  updateLastAssistantMessage: (chatId, content, done = false) => {
    set((state) => {
      const chats = state.chats.map((c) => {
        if (c.id !== chatId) return c;
        const messages = [...c.messages];
        const lastIdx = messages.length - 1;
        if (lastIdx < 0 || messages[lastIdx].role !== 'assistant') return c;
        messages[lastIdx] = {
          ...messages[lastIdx],
          content,
          isStreaming: !done,
        };
        return { ...c, messages, updatedAt: Date.now() };
      });
      saveChats(chats);
      return { chats };
    });
  },

  removeLastMessage: (chatId) => {
    set((state) => {
      const chats = state.chats.map((c) => {
        if (c.id !== chatId) return c;
        return { ...c, messages: c.messages.slice(0, -1) };
      });
      saveChats(chats);
      return { chats };
    });
  },

  setLoading: (v) => set({ isLoading: v }),

  setAbortController: (ctrl) => set({ abortController: ctrl }),

  stopGeneration: () => {
    const { abortController, currentChatId } = get();
    abortController?.abort();
    if (currentChatId) {
      const chat = get().currentChat();
      const last = chat?.messages.at(-1);
      if (last?.isStreaming) {
        get().updateLastAssistantMessage(currentChatId, last.content as string, true);
      }
    }
    set({ isLoading: false, abortController: null });
  },

  setSearchQuery: (q) => set({ searchQuery: q }),

  updateSettings: (patch) =>
    set((state) => ({ settings: { ...state.settings, ...patch } })),
}));
