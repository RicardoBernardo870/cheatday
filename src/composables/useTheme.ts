type Theme = 'dark' | 'light';

const STORAGE_KEY = 'cheatday-theme';

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

let systemThemeListenerAttached = false;

export const useTheme = () => {
  const init = () => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const theme = stored ?? getSystemTheme();
    applyTheme(theme);

    if (!systemThemeListenerAttached) {
      systemThemeListenerAttached = true;
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };

  const current = (): Theme =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  const toggle = () => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const set = (theme: Theme) => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  return { init, current, toggle, set };
};
