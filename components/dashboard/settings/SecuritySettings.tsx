'use client';

import { TwoFactorEnrollment } from './TwoFactorEnrollment';

export function SecuritySettings() {
  return (
    <div className="p-6 bg-design-card rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Account Security</h3>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-400 mb-4">
            Manage your two-factor authentication and security settings to keep your account safe.
          </p>
          <TwoFactorEnrollment />
        </div>
      </div>
    </div>
  );
}
