'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    api
      .me()
      .then(() => setChecked(true))
      .catch(() => router.replace('/login'));
  }, [router]);

  if (!checked) {
    return <div className="min-h-screen flex items-center justify-center text-ink-muted text-sm">Loading…</div>;
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
