import { create } from 'zustand';

const API_KEY_STORAGE = 'gigachat_api_key';
const THEME_STORAGE = 'gigachat_theme';

type Theme = 'dark' | 'light';

interface UIStore {
  theme: Theme;
  toggleTheme: () => void;

  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;

  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;
}

function applyTheme(theme: Theme) {
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }
}

const savedTheme = (localStorage.getItem(THEME_STORAGE) as Theme) ?? 'dark';
applyTheme(savedTheme);

export const useUIStore = create<UIStore>((set) => ({
  theme: savedTheme,
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_STORAGE, next);
      applyTheme(next);
      return { theme: next };
    }),

  apiKey: localStorage.getItem(API_KEY_STORAGE) ?? '',
  setApiKey: (key) => {
    localStorage.setItem(API_KEY_STORAGE, key);
    set({ apiKey: key });
  },
  clearApiKey: () => {
    localStorage.removeItem(API_KEY_STORAGE);
    set({ apiKey: '' });
  },

  isSettingsOpen: false,
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),

  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (v) => set({ isSidebarOpen: v }),
}));

export function getApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) ?? '';
}
