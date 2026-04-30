import { authenticator } from 'otplib';

/**
 * Generates a new TOTP secret.
 */
export function generateSecret(): string {
  return authenticator.generateSecret();
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
