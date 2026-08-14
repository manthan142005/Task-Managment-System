'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function continueAsGuest() {
    setLoading(true);
    setError('');
    try {
      await api.guestLogin();
      router.push('/tasks');
    } catch (e: any) {
      setError(e.message || 'Could not sign in. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm bg-surface border border-border rounded-card p-6 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-6 h-6 rounded bg-ink flex items-center justify-center text-surface text-xs font-bold">
            P
          </div>
          <span className="font-semibold">Pyramid</span>
        </div>

        <h1 className="text-lg font-semibold text-center mb-1">Let&apos;s get back on track</h1>
        <p className="text-sm text-ink-muted text-center mb-6">
          Enter your email below to login to your account.
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2 mb-4">{error}</p>
        )}

        <button
          onClick={continueAsGuest}
          disabled={loading}
          className="w-full bg-ink text-surface rounded-full py-2.5 text-sm font-medium mb-2 disabled:opacity-60 transition-opacity"
        >
          {loading ? 'Signing in…' : 'Continue as Guest'}
        </button>

        <button
          disabled
          title="Configure Google OAuth to enable this"
          className="w-full border border-border rounded-full py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <GoogleIcon />
          Login with Google
        </button>

        <p className="text-xs text-ink-muted text-center mt-5">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.5-.4-3.5z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3c-7.4 0-13.7 4.2-16.9 10.3z"/>
      <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.6 2.3-7.2 2.3-5.3 0-9.7-3.4-11.3-8.1l-6.5 5c3.2 6.3 9.6 11.2 17.8 11.2z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C40.9 36 44 30.5 44 24c0-1.4-.1-2.5-.4-3.5z"/>
    </svg>
  );
}
