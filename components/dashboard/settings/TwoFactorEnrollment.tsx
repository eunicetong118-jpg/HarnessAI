'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BackupCodes } from './BackupCodes';

export function TwoFactorEnrollment() {
  const [step, setStep] = useState<'idle' | 'qr' | 'verify' | 'success'>('idle');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleStartEnroll = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/2fa/enroll', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQrDataUrl(data.qrDataUrl);
      setStep('qr');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBackupCodes(data.backupCodes);
      setStep('success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication (TOTP)</h3>
        <p className="text-sm text-slate-600 mb-6">
          Enhance your account security by requiring a code from your authenticator app.
        </p>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        {step === 'idle' && (
          <button
            onClick={handleStartEnroll}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Enable 2FA'}
          </button>
        )}

        {step === 'qr' && (
          <div className="space-y-4">
            <p className="text-sm">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
            {qrDataUrl && (
              <div className="flex justify-center p-4 bg-slate-50 rounded border border-slate-100">
                <Image src={qrDataUrl} alt="2FA QR Code" width={200} height={200} />
              </div>
            )}
            <button
              onClick={() => setStep('verify')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              I have scanned it
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <p className="text-sm">Enter the 6-digit code from your app:</p>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="000000"
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={6}
            />
            <div className="flex gap-2">
              <button
                onClick={handleVerify}
                disabled={loading || token.length !== 6}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </button>
              <button
                onClick={() => setStep('qr')}
                className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700">
            <p className="font-semibold">2FA Enabled Successfully!</p>
            <p className="text-sm">Your account is now more secure.</p>
          </div>
        )}
      </div>

      {step === 'success' && backupCodes.length > 0 && (
        <BackupCodes initialCodes={backupCodes} />
      )}
    </div>
  );
}
