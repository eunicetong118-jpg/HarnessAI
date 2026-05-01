'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type OmittedProps = 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, OmittedProps> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = 'relative overflow-hidden inline-flex items-center justify-center font-medium transition-all rounded-xl focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95';

  const variants = {
    primary: 'bg-design-pink text-white hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:brightness-110',
    secondary: 'bg-design-surface text-white hover:bg-design-card',
    outline: 'border border-white/10 bg-transparent hover:bg-white/5',
    ghost: 'hover:bg-white/5 text-gray-400 hover:text-white',
    destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_25px_rgba(239,68,68,0.2)]',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6',
    lg: 'h-14 px-8 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && (
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children as React.ReactNode}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
    </motion.button>
  );
};
