import { AlertCircle } from 'lucide-react';

export const PendingBanner = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-700 font-medium">
            Account Verification Pending: Your MT5 account is currently being reviewed.
            Rebates will start accumulating once verified.
          </p>
        </div>
      </div>
    </div>
  );
};
