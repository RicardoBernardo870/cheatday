type Theme = 'dark' | 'light';

const STORAGE_KEY = 'cheatday-theme';

const getSystemTheme = (): Theme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useTheme = () => {
  const init = () => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const theme = stored ?? getSystemTheme();
    applyTheme(theme);

    // Keep in sync if user changes system preference and has no stored override
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  };

  const current = (): Theme => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  };

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
