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
      <div className="p-6 bg-design-surface rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold mb-2 text-white">Two-Factor Authentication (TOTP)</h3>
        <p className="text-sm text-gray-400 mb-6">
          Enhance your account security by requiring a code from your authenticator app.
        </p>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
            {error}
          </div>
        )}

        {step === 'idle' && (
          <button
            onClick={handleStartEnroll}
            disabled={loading}
            className="px-4 py-2 bg-design-pink text-white rounded-lg hover:bg-design-pink/90 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Starting...' : 'Enable 2FA'}
          </button>
        )}

        {step === 'qr' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
            {qrDataUrl && (
              <div className="flex justify-center p-4 bg-white rounded-lg border border-white/5 shadow-inner">
                <Image src={qrDataUrl} alt="2FA QR Code" width={200} height={200} />
              </div>
            )}
            <button
              onClick={() => setStep('verify')}
              className="w-full px-4 py-2 bg-design-pink text-white rounded-lg hover:bg-design-pink/90 transition-colors"
            >
              I have scanned it
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">Enter the 6-digit code from your app:</p>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="000000"
              className="w-full p-2 bg-design-card border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-design-pink/50 focus:border-transparent outline-none"
              maxLength={6}
            />
            <div className="flex gap-2">
              <button
                onClick={handleVerify}
                disabled={loading || token.length !== 6}
                className="flex-1 px-4 py-2 bg-design-pink text-white rounded-lg hover:bg-design-pink/90 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </button>
              <button
                onClick={() => setStep('qr')}
                className="px-4 py-2 border border-white/10 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
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
