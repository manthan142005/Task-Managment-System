'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

interface ThemeContextValue {
  themeMode: ThemeMode;
  colorMode: ColorMode;
  setThemeMode: (m: ThemeMode) => void;
  setColorMode: (c: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Persists to localStorage immediately (so refresh never flashes the wrong
// theme) and best-effort syncs to the backend so it follows the user across
// devices, matching "selected theme should persist across page refreshes".
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1. Restore from localStorage immediately (no flicker).
    const storedTheme = (localStorage.getItem('pyramid_theme') as ThemeMode) || 'system';
    const storedColor = (localStorage.getItem('pyramid_color') as ColorMode) || 'blue';
    setThemeModeState(storedTheme);
    setColorModeState(storedColor);
    setReady(true);

    // 2. Bug 8 fix: Also sync from the backend so the user's preference
    //    follows them across devices/sessions. We do this after setting
    //    localStorage so there is no visible delay on the happy path.
    import('../lib/api').then(({ api }) => {
      api.me().then((user: { themeMode?: string; colorMode?: string }) => {
        if (user.themeMode && user.themeMode !== storedTheme) {
          const serverTheme = user.themeMode as ThemeMode;
          setThemeModeState(serverTheme);
          localStorage.setItem('pyramid_theme', serverTheme);
        }
        if (user.colorMode && user.colorMode !== storedColor) {
          const serverColor = user.colorMode as ColorMode;
          setColorModeState(serverColor);
          localStorage.setItem('pyramid_color', serverColor);
        }
      }).catch(() => {
        // Not logged in yet — that's fine, localStorage values are used.
      });
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    const isDark =
      themeMode === 'dark' ||
      (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-color', colorMode);
    localStorage.setItem('pyramid_theme', themeMode);
    localStorage.setItem('pyramid_color', colorMode);
  }, [themeMode, colorMode, ready]);

  const setThemeMode = (m: ThemeMode) => {
    setThemeModeState(m);
    import('../lib/api').then(({ api }) => api.updateTheme({ themeMode: m }).catch(() => {}));
  };
  const setColorMode = (c: ColorMode) => {
    setColorModeState(c);
    import('../lib/api').then(({ api }) => api.updateTheme({ colorMode: c }).catch(() => {}));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, colorMode, setThemeMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
