import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for combining Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats cents (BigInt or number) into a USD currency string.
 * @param cents - Amount in cents
 * @returns Formatted currency string (e.g. "$1,234.56")
 */
export function formatCurrency(cents: bigint | number): string {
  const amount = Number(cents) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
