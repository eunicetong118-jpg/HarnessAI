import { authenticator } from 'otplib';
import { randomBytes } from 'crypto';

/**
 * Generates a new TOTP secret.
 */
export function generateSecret(): string {
  return authenticator.generateSecret();
}

/**
 * Generates random backup codes.
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate 8 characters random hex string
    codes.push(randomBytes(4).toString('hex'));
  }
  return codes;
}

/**
 * Generates a keyuri for QR code generation.
 */
export function generateKeyuri(email: string, secret: string): string {
  return authenticator.keyuri(email, 'HarnessAI', secret);
}

/**
 * Verifies a TOTP token against a secret.
 */
export function verifyToken(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}
