'use client';

import { SettingsShell } from '../profile/page';
import { useTheme } from '@/components/ThemeProvider';

const COLOR_SWATCHES: { key: any; label: string; hex: string }[] = [
  { key: 'amber', label: 'Amber', hex: '#d97706' },
  { key: 'blue', label: 'Blue', hex: '#6366f1' },
  { key: 'pink', label: 'Pink', hex: '#db2777' },
  { key: 'rose', label: 'Rose', hex: '#e11d48' },
  { key: 'emerald', label: 'Emerald', hex: '#059669' },
  { key: 'black', label: 'Black', hex: '#18181b' },
];

export default function ThemeSettingsPage() {
  const { themeMode, setThemeMode, colorMode, setColorMode } = useTheme();

  return (
    <SettingsShell active="theme">
      <h2 className="text-base font-semibold mb-4">Theme</h2>

      <div className="bg-surface border border-border rounded-md p-4 mb-6">
        <p className="text-sm font-medium mb-3">Appearance</p>
        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setThemeMode(m)}
              className={`text-sm px-3 py-1.5 rounded-md border capitalize ${
                themeMode === m ? 'border-accent bg-accent-soft text-accent' : 'border-border'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-md p-4">
        <p className="text-sm font-medium mb-3">Color Mode</p>
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => (
            <button
              key={c.key}
              onClick={() => setColorMode(c.key)}
              className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border ${
                colorMode === c.key ? 'border-accent bg-accent-soft' : 'border-border'
              }`}
            >
              <span className="w-3 h-3 rounded-sm" style={{ background: c.hex }} />
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </SettingsShell>
  );
}
