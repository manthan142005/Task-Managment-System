'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/lib/types';
import { useTheme } from './ThemeProvider';

const NAV = [
  { href: '/tasks', label: 'Tasks', icon: '▦' },
  { href: '/projects', label: 'Projects', icon: '▤' },
];

const COLOR_SWATCHES: { key: any; label: string; hex: string }[] = [
  { key: 'amber', label: 'Amber', hex: '#d97706' },
  { key: 'blue', label: 'Blue', hex: '#6366f1' },
  { key: 'pink', label: 'Pink', hex: '#db2777' },
  { key: 'rose', label: 'Rose', hex: '#e11d48' },
  { key: 'emerald', label: 'Emerald', hex: '#059669' },
  { key: 'black', label: 'Black', hex: '#18181b' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const { colorMode, setColorMode, themeMode, setThemeMode } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.me().then(setUser).catch(() => {});
  }, []);

  // Close the user menu (and color sub-menu) when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setColorOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-surface flex flex-col h-screen sticky top-0">
      <div className="relative p-3 border-b border-border" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-muted text-left"
        >
          <div className="w-6 h-6 rounded-full bg-accent text-accent-fg text-xs flex items-center justify-center font-semibold">
            {(user?.fullName || 'U')[0]}
          </div>
          <span className="text-sm font-medium truncate">{user?.fullName || 'Loading…'}</span>
        </button>

        {menuOpen && (
          <div className="absolute left-3 right-3 top-14 z-20 bg-surface border border-border rounded-md shadow-lg py-1 text-sm">
            <button
              className="w-full flex justify-between items-center px-3 py-2 hover:bg-surface-muted"
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            >
              Change Theme <span>›</span>
            </button>
            <div className="relative">
              <button
                className="w-full flex justify-between items-center px-3 py-2 hover:bg-surface-muted"
                onClick={() => setColorOpen((v) => !v)}
              >
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ background: 'var(--accent)' }} />
                  Color Mode
                </span>
                <span>›</span>
              </button>
              {colorOpen && (
                <div className="absolute left-full top-0 ml-1 bg-surface border border-border rounded-md shadow-lg py-1 w-36">
                  {COLOR_SWATCHES.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => { setColorMode(c.key); setColorOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-surface-muted text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ background: c.hex }} />
                        {c.label}
                      </span>
                      {colorMode === c.key && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href="/settings/profile" className="block px-3 py-2 hover:bg-surface-muted">
              Settings
            </Link>
          </div>
        )}
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        <p className="px-2 pt-2 pb-1 text-xs font-medium text-ink-muted uppercase tracking-wide">
          Workspace
        </p>
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${
                active ? 'bg-accent-soft text-accent font-medium' : 'hover:bg-surface-muted text-ink'
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

