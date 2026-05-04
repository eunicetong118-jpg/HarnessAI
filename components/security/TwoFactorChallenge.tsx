'use client';

import { useState, useRef, useEffect } from 'react';

interface TwoFactorChallengeProps {
  onVerify: (code: string) => void;
  onCancel: () => void;
  error?: string | null;
  isLoading?: boolean;
}

export function TwoFactorChallenge({
  onVerify,
  onCancel,
  error,
  isLoading
}: TwoFactorChallengeProps) {
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length >= 6) {
      onVerify(code);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    if (value.length <= 8) {
      setCode(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white tracking-tight">Security Verification</h3>
        <p className="text-sm text-gray-400 mt-2">
          Enter code from app or backup.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="securityCode" className="sr-only">
            Security Code
          </label>
          <input
            ref={inputRef}
            type="text"
            id="securityCode"
            name="securityCode"
            autoComplete="one-time-code"
            required
            className="block w-full bg-white/5 text-center text-3xl tracking-[0.5em] font-mono text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-design-pink focus:border-transparent outline-none transition-all py-4 placeholder:text-white/5"
            placeholder="000000"
            value={code}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          {error && (
            <p className="mt-4 text-sm text-red-400 text-center bg-red-400/10 p-2 rounded-lg border border-red-400/20" id="security-code-error">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={isLoading || code.length < 6}
            className="w-full h-12 bg-gradient-to-r from-design-pink to-design-purple text-white font-bold rounded-xl shadow-lg shadow-design-pink/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify & Submit'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full h-12 bg-white/5 text-gray-400 hover:text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
