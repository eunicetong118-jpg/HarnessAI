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
    <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200 mt-6">
      <h3 className="text-lg font-semibold mb-2">Backup Recovery Codes</h3>
      <p className="text-sm text-slate-600 mb-6">
        Recovery codes can be used to access your account if you lose access to your device.
        Store these codes in a safe place.
      </p>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      {!showCodes ? (
        <Button
          onClick={handleGenerate}
          disabled={loading}
          variant="outline"
        >
          {loading ? 'Generating...' : 'Generate Backup Codes'}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50 rounded border border-slate-100 font-mono text-sm">
            {codes.map((code, index) => (
              <div key={index} className="p-1">{code}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="default">
              Download Codes
            </Button>
            <Button onClick={handleGenerate} variant="outline" disabled={loading}>
              Regenerate
            </Button>
          </div>
          <p className="text-xs text-amber-600 font-medium">
            Warning: Regenerating codes will invalidate your old codes.
          </p>
        </div>
      )}
    </div>
  );
}
