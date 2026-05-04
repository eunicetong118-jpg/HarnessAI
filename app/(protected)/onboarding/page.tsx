'use client';

import { useState } from 'react';
import { IB_MAPPING } from '@/config/ib-mapping';
import { linkBrokerAccount } from '@/lib/actions/broker-actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DesignBackground } from '@/components/shared/DesignBackground';

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
      <div className="max-w-2xl mx-auto py-10 px-4 relative overflow-hidden">
        {/* Background Mesh */}
        <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.1),transparent_50%)] pointer-events-none" />

        <Card className="text-center relative z-10 glass-card border-white/10 bg-white/5 backdrop-blur-3xl rounded-3xl">
          <div className="py-12 px-8">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                <div className="rounded-full bg-green-500/10 p-4 relative z-10 border border-green-500/20">
                  <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Account Linked!</h2>
            <p className="text-gray-400 mb-8 text-lg">
              MT5 account <strong className="text-white font-mono bg-white/5 px-2 py-1 rounded">{mt5AccountNo}</strong> submitted.
              Review in progress. Start exploring your dashboard.
            </p>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              className="px-10 h-14 text-lg bg-gradient-to-r from-design-pink to-design-purple text-white hover:scale-[1.02] active:scale-[0.98] transition-all border-none font-bold"
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 relative min-h-screen">
      <DesignBackground />

      <div className="relative z-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome to Rebatengine</h1>
          <p className="text-gray-400 text-lg">
            Complete these steps to activate your automated rebate tracking.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Step 1: Country Selection */}
          <Card className="glass-card border-white/10 bg-white/5 backdrop-blur-3xl rounded-3xl overflow-hidden group">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-design-pink/10 border border-design-pink/20 flex items-center justify-center text-design-pink font-bold">1</div>
                <h3 className="text-xl font-bold text-white tracking-tight">Select Your Country</h3>
              </div>

              <div className="space-y-6">
                <p className="text-gray-400">
                  Select your country to get the correct IB registration link.
                </p>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="country" className="text-xs font-bold uppercase tracking-widest text-gray-500">Residence Country</Label>
                  <Select
                    id="country"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    options={IB_MAPPING.map((m) => ({
                      label: m.countryName,
                      value: m.countryCode,
                    }))}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-design-pink"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2: Registration Link */}
          <Card className="glass-card border-white/10 bg-white/5 backdrop-blur-3xl rounded-3xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-design-purple/10 border border-design-purple/20 flex items-center justify-center text-design-purple font-bold">2</div>
                <h3 className="text-xl font-bold text-white tracking-tight">Register via IB Link</h3>
              </div>

              <div className="space-y-6">
                <p className="text-gray-400">
                  Register your MT5 account using the link below to enable rebate tracking.
                </p>
                <div className="p-6 bg-gradient-to-br from-design-pink/10 to-design-purple/10 border border-white/10 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-design-pink uppercase tracking-widest mb-3">
                    Your Registration Link ({selectedIB?.countryName}):
                  </p>
                  <a
                    href={selectedIB?.ibUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-design-pink font-mono text-sm break-all underline-offset-4 hover:underline transition-all block relative z-10"
                  >
                    {selectedIB?.ibUrl}
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 3: Link Account Form */}
          <Card className="glass-card border-white/10 bg-white/5 backdrop-blur-3xl rounded-3xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold">3</div>
                <h3 className="text-xl font-bold text-white tracking-tight">Link Your MT5 Account</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-gray-400">
                  Enter your MT5 account number. We will verify linkage with the broker.
                </p>
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="mt5AccountNo" className="text-xs font-bold uppercase tracking-widest text-gray-500">MT5 Account Number</Label>
                  <Input
                    id="mt5AccountNo"
                    type="text"
                    placeholder="e.g. 1234567"
                    value={mt5AccountNo}
                    onChange={(e) => setMt5AccountNo(e.target.value.replace(/\D/g, ''))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 h-12 rounded-xl focus:ring-design-pink text-lg font-mono tracking-widest"
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 text-lg bg-gradient-to-r from-design-pink to-design-purple text-white hover:scale-[1.01] active:scale-[0.99] transition-all border-none font-bold shadow-xl shadow-design-pink/10"
                  isLoading={isLoading}
                >
                  Link Account & Start Earning
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
