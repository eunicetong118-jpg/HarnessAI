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
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">Security Verification</h3>
        <p className="text-sm text-gray-500">
          Enter your 6-digit TOTP code or 8-character backup code to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="block w-full text-center text-2xl tracking-[0.5em] font-mono border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-2xl"
            placeholder="000000"
            value={code}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 text-center" id="security-code-error">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            disabled={isLoading || code.length < 6}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify & Submit'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
