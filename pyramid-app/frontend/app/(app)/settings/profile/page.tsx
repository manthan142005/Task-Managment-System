'use client';
import { SettingsShell } from "../SettingsShell";
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { api } from '@/lib/api';
import { User } from '@/lib/types';

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.me().then(setUser);
  }, []);

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      await api.updateProfile({
        fullName: user.fullName,
        title: user.title,
        username: user.username,
      });
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <SettingsShell active="profile">
      <h2 className="text-base font-semibold mb-4">Profile</h2>
      <div className="bg-surface border border-border rounded-md divide-y divide-border">
        <Row label="Profile picture">
          <div className="w-8 h-8 rounded-full bg-accent text-accent-fg flex items-center justify-center text-sm font-medium">
            {(user.fullName || '?')[0]}
          </div>
        </Row>
        <Row label="Email">
          <span className="text-sm text-ink-muted">{user.email}</span>
        </Row>
        <Row label="Full name">
          <input
            value={user.fullName || ''}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            className="text-sm border border-border rounded-md px-2.5 py-1.5 bg-surface w-48"
          />
        </Row>
        <Row label="Title" sub="Your job title or role">
          <input
            value={user.title || ''}
            onChange={(e) => setUser({ ...user, title: e.target.value })}
            className="text-sm border border-border rounded-md px-2.5 py-1.5 bg-surface w-48"
          />
        </Row>
        <Row label="Username" sub="One word, like a nickname or first name">
          <input
            value={user.username || ''}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="text-sm border border-border rounded-md px-2.5 py-1.5 bg-surface w-48"
          />
        </Row>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-4 bg-ink text-surface text-sm px-4 py-2 rounded-md font-medium disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>

      <h3 className="text-sm font-medium mt-8 mb-2">Workspace access</h3>
      <div className="bg-surface border border-border rounded-md p-4 flex items-center justify-between">
        <span className="text-sm text-ink-muted">Remove yourself from the workspace</span>
        <button className="text-sm text-red-600 border border-red-200 rounded-md px-3 py-1.5 hover:bg-red-50">
          Leave Workspace
        </button>
      </div>
    </SettingsShell>
  );
}

function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-sm">{label}</p>
        {sub && <p className="text-xs text-ink-muted">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

 
 