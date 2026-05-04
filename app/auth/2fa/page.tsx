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
    <div className="flex items-center justify-center min-h-screen bg-design-bg relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.1),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-md p-8 glass-card rounded-3xl border border-white/10 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Two-Factor Authentication</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Enter the 6-digit code from your authenticator app or a backup code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl text-center">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="code" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              className="w-full bg-white/5 p-4 text-center text-3xl tracking-[0.5em] font-mono text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-design-pink focus:border-transparent outline-none transition-all placeholder:text-white/10"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg"
            isLoading={loading}
          >
            Verify & Continue
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
