'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function TwoFactorPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/2fa/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Update session to reflect 2fa_verified
      await update({ twoFactorVerified: true });

      // Redirect to dashboard or return URL
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null; // or loading
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Two-Factor Authentication</h1>
          <p className="text-slate-600 mt-2">
            Enter the 6-digit code from your authenticator app or a backup code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              className="w-full p-3 text-center text-2xl tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Verify
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/auth/signin')}
            className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
