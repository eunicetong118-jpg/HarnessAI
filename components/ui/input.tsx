import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-gray-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-design-pink focus:ring-1 focus:ring-design-pink/50 block w-full rounded-xl transition-all",
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : '',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
