'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface BackupCodesProps {
  initialCodes?: string[];
}

export function BackupCodes({ initialCodes = [] }: BackupCodesProps) {
  const [codes, setCodes] = useState<string[]>(initialCodes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCodes, setShowCodes] = useState(initialCodes.length > 0);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/2fa/backup-codes', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCodes(data.backupCodes);
      setShowCodes(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const content = codes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'harnessai-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-design-surface rounded-xl border border-white/10 mt-6">
      <h3 className="text-lg font-semibold mb-2 text-white">Backup Recovery Codes</h3>
      <p className="text-sm text-gray-400 mb-6">
        Recovery codes can be used to access your account if you lose access to your device.
        Store these codes in a safe place.
      </p>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </div>
      )}

      {!showCodes ? (
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-transparent border border-white/10 text-white hover:bg-white/5"
        >
          {loading ? 'Generating...' : 'Generate Backup Codes'}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-4 bg-design-card rounded-lg border border-white/5 font-mono text-sm text-gray-300">
            {codes.map((code, index) => (
              <div key={index} className="p-1">{code}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload} className="bg-design-pink hover:bg-design-pink/90 text-white">
              Download Codes
            </Button>
            <Button onClick={handleGenerate} className="bg-transparent border border-white/10 text-white hover:bg-white/5" disabled={loading}>
              Regenerate
            </Button>
          </div>
          <p className="text-xs text-design-pink font-medium">
            Warning: Regenerating codes will invalidate your old codes.
          </p>
        </div>
      )}
    </div>
  );
}
