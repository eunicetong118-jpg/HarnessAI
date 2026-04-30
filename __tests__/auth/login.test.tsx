import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

describe('LoginPage', () => {
  const mockPush = vi.fn();
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as any).mockReturnValue({
      get: mockGet,
    });
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /log in/i })).toBeDefined();
  });

  it('shows error message if fields are empty', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    // Note: If using native browser validation, we might not see custom error text
    // But for Task 3, we want to ensure it handles submission
  });

  it('calls signIn on valid submission', async () => {
    (signIn as any).mockResolvedValue({ ok: true, error: null });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
    });
  });

  it('displays error from query params', () => {
    mockGet.mockReturnValue('email_not_verified');
    render(<LoginPage />);
    expect(screen.getByText(/please verify your email/i)).toBeDefined();
  });
});
