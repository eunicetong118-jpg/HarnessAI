'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function BulkVerifyDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    verified: number;
    alreadyVerified: number;
    notFound: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/verify-accounts', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        router.refresh();
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Bulk Verify Accounts
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Bulk MT5 Verification</h3>
              <button onClick={() => { setIsOpen(false); setResult(null); setError(null); }} className="text-gray-400 hover:text-gray-600">
                &times;
              </button>
            </div>

            {!result ? (
              <form onSubmit={handleUpload} className="space-y-4">
                <p className="text-sm text-gray-500">
                  Upload a CSV file containing MT5 account numbers to verify.
                </p>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!file || isLoading}
                    isLoading={isLoading}
                  >
                    Upload & Verify
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h4 className="text-sm font-bold text-green-800 mb-2">Verification Complete</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>Newly Verified: {result.verified}</li>
                    <li>Already Verified: {result.alreadyVerified}</li>
                    <li>Not Found: {result.notFound}</li>
                  </ul>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => { setIsOpen(false); setResult(null); }}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
