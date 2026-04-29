import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Card = ({ children, title, className = '' }: CardProps) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      {title && (
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
};
