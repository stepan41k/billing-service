import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  set: (t: Theme) => void;
}

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const useThemeStore = create<ThemeState>((set) => {
  const initial = getSystemTheme();
  document.documentElement.classList.toggle('dark', initial === 'dark');

  return {
    theme: initial,
    toggle: () =>
      set((s) => {
        const next: Theme = s.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', next === 'dark');
        return { theme: next };
      }),
    set: (t: Theme) => {
      document.documentElement.classList.toggle('dark', t === 'dark');
      set({ theme: t });
    },
  };
});
