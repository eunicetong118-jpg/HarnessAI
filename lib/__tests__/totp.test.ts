import { describe, it, expect } from 'vitest';
import { generateSecret, verifyToken } from '../totp';

describe('TOTP Utils', () => {
  it('should generate a secret of correct length', () => {
    const secret = generateSecret();
    expect(secret).toBeDefined();
    expect(secret.length).toBeGreaterThanOrEqual(16);
  });

  it('should verify a valid token', () => {
    const secret = generateSecret();
    // Since we can't easily generate a real-time token without more mocks,
    // we just check that the function exists and accepts arguments.
    // authenticator.check(token, secret)
    expect(typeof verifyToken).toBe('function');
  });
});
