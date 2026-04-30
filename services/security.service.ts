import prisma from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/security/crypto';
import { generateSecret, generateKeyuri, verifyToken, generateBackupCodes } from '@/lib/totp';
import QRCode from 'qrcode';

export class SecurityService {
  /**
   * Generates a new TOTP secret for a user and saves it (encrypted).
   * Returns the QR code data URL.
   */
  static async generateSetup(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!user) throw new Error('User not found');

    const secret = generateSecret();
    const encryptedSecret = encrypt(secret);

    // Save encrypted secret immediately (totpEnabled: false)
    await prisma.user.update({
      where: { id: userId },
      data: {
        totpSecret: encryptedSecret,
        totpEnabled: false
      }
    });

    const keyuri = generateKeyuri(user.email, secret);
    const qrDataUrl = await QRCode.toDataURL(keyuri);

    return { qrDataUrl };
  }

  /**
   * Verifies the provided token and enables 2FA for the user.
   * Generates backup codes upon successful enablement.
   */
  static async verifyAndEnable(userId: string, token: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totpSecret: true }
    });

    if (!user || !user.totpSecret) {
      throw new Error('2FA enrollment not started');
    }

    const secret = decrypt(user.totpSecret);
    const isValid = verifyToken(token, secret);

    if (!isValid) {
      return { success: false, error: 'Invalid verification code' };
    }

    const backupCodes = generateBackupCodes();

    // Enable 2FA and store backup codes
    await prisma.user.update({
      where: { id: userId },
      data: {
        totpEnabled: true,
        twoFactorBackupCodes: backupCodes
      }
    });

    return { success: true, backupCodes };
  }

  /**
   * Verifies a security code (TOTP or Backup Code).
   * If it's a backup code, it is consumed (removed from the user's list).
   */
  static async verifySecurityCode(userId: string, code: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totpSecret: true,
        totpEnabled: true,
        twoFactorBackupCodes: true
      }
    });

    if (!user || !user.totpEnabled) {
      // If 2FA is not enabled, we consider it "verified" or "skipped"
      // but the caller should usually check totpEnabled first.
      // For withdrawal safety, we'll return true if disabled,
      // but the service logic will enforce the requirement.
      return true;
    }

    // 1. Try TOTP
    if (user.totpSecret && code.length === 6) {
      const secret = decrypt(user.totpSecret);
      if (verifyToken(code, secret)) {
        return true;
      }
    }

    // 2. Try Backup Code
    if (user.twoFactorBackupCodes.includes(code)) {
      // Consume backup code
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorBackupCodes: {
            set: user.twoFactorBackupCodes.filter(c => c !== code)
          }
        }
      });
      return true;
    }

    return false;
  }
}
