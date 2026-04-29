'use client';

import { useState } from 'react';
import { IB_MAPPING } from '@/config/ib-mapping';
import { linkBrokerAccount } from '@/lib/actions/broker-actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function OnboardingPage() {
  const [countryCode, setCountryCode] = useState(IB_MAPPING[0].countryCode);
  const [mt5AccountNo, setMt5AccountNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedIB = IB_MAPPING.find((m) => m.countryCode === countryCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('mt5AccountNo', mt5AccountNo);
    formData.append('countryCode', countryCode);

    try {
      const result = await linkBrokerAccount(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Card title="Account Linked Successfully" className="text-center">
          <div className="py-6">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Your MT5 account <strong>{mt5AccountNo}</strong> has been submitted for verification.
              Our team will review it shortly. You can now access your dashboard.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
      <p className="text-gray-600 mb-8">
        Follow these steps to link your MT5 account and start earning rebates.
      </p>

      <div className="space-y-8">
        {/* Step 1: Country Selection */}
        <Card title="Step 1: Select Your Country">
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Select your country to get the correct IB registration link.
            </p>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                options={IB_MAPPING.map((m) => ({
                  label: m.countryName,
                  value: m.countryCode,
                }))}
              />
            </div>
          </div>
        </Card>

        {/* Step 2: Registration Link */}
        <Card title="Step 2: Register via Our IB Link">
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              If you haven't already, please register your MT5 account using the link below.
              This ensures your account is under our IB for rebate tracking.
            </p>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Your Registration Link ({selectedIB?.countryName}):
              </p>
              <a
                href={selectedIB?.ibUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all text-sm"
              >
                {selectedIB?.ibUrl}
              </a>
            </div>
          </div>
        </Card>

        {/* Step 3: Link Account Form */}
        <Card title="Step 3: Link Your MT5 Account">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-500">
              Enter your MT5 account number below. We will verify the linkage with the broker.
            </p>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="mt5AccountNo">MT5 Account Number</Label>
              <Input
                id="mt5AccountNo"
                type="text"
                placeholder="e.g. 1234567"
                value={mt5AccountNo}
                onChange={(e) => setMt5AccountNo(e.target.value.replace(/\D/g, ''))}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Link Account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
