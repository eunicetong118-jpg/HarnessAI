import { describe, it, expect, beforeEach, vi } from 'vitest';
import { encrypt, decrypt } from '../crypto';

describe('Crypto Utils', () => {
  const TEST_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

  beforeEach(() => {
    vi.stubEnv('ENCRYPTION_KEY', TEST_KEY);
  });

  it('should encrypt and decrypt a string', () => {
    const text = 'hello-world-secret';
    const encrypted = encrypt(text);
    expect(encrypted).not.toBe(text);
    expect(encrypted.split(':')).toHaveLength(3);

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(text);
  });

  it('should fail if ENCRYPTION_KEY is missing', () => {
    vi.stubEnv('ENCRYPTION_KEY', '');
    expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY must be a 32-byte (64-char) hex string');
  });

  it('should fail if ENCRYPTION_KEY is invalid length', () => {
    vi.stubEnv('ENCRYPTION_KEY', 'abc');
    expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY must be a 32-byte (64-char) hex string');
  });

  it('should fail if encrypted format is invalid', () => {
    expect(() => decrypt('invalid:format')).toThrow('Invalid encrypted text format');
  });
});
