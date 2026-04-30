import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-white">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`px-3 py-2 bg-design-card border border-white/10 text-white focus:outline-none focus:border-design-pink focus:ring-design-pink block w-full rounded-xl sm:text-sm focus:ring-1 transition-all ${className} ${
            error ? 'border-red-500' : ''
          }`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-design-card">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
