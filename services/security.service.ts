import prisma, { DB } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/security/crypto';
import { generateSecret, generateKeyuri, verifyToken, generateBackupCodes } from '@/lib/totp';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';

export class SecurityService {
  /**
   * Generates a new TOTP secret for a user and saves it (encrypted).
   * Returns the QR code data URL.
   */
  static async generateSetup(userId: string, tx?: DB) {
    const db = tx || prisma;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!user) throw new Error('User not found');

    const secret = generateSecret();
    const encryptedSecret = encrypt(secret);

    // Save encrypted secret immediately (totpEnabled: false)
    await db.user.update({
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
  static async verifyAndEnable(userId: string, token: string, tx?: DB) {
    const db = tx || prisma;
    const user = await db.user.findUnique({
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

    const plainCodes = generateBackupCodes();
    const hashedCodes = await Promise.all(
      plainCodes.map(code => bcrypt.hash(code, 10))
    );

    // Enable 2FA and store hashed backup codes
    await db.user.update({
      where: { id: userId },
      data: {
        totpEnabled: true,
        twoFactorBackupCodes: hashedCodes
      }
    });

    return { success: true, backupCodes: plainCodes };
  }

  /**
   * Regenerates backup codes for a user.
   * Invalidates any existing backup codes.
   */
  static async regenerateBackupCodes(userId: string, tx?: DB) {
    const db = tx || prisma;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { totpEnabled: true }
    });

    if (!user || !user.totpEnabled) {
      throw new Error('2FA not enabled');
    }

    const plainCodes = generateBackupCodes();
    const hashedCodes = await Promise.all(
      plainCodes.map(code => bcrypt.hash(code, 10))
    );

    await db.user.update({
      where: { id: userId },
      data: {
        twoFactorBackupCodes: hashedCodes
      }
    });

    return { backupCodes: plainCodes };
  }

  /**
   * Verifies a security code (TOTP or Backup Code).
   * If it's a backup code, it is consumed (removed from the user's list).
   */
  static async verifySecurityCode(userId: string, code: string, tx?: DB): Promise<boolean> {
    const db = tx || prisma;
    const user = await db.user.findUnique({
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

    // 1. Try TOTP (6-digit numeric)
    if (user.totpSecret && /^\d{6}$/.test(code)) {
      const secret = decrypt(user.totpSecret);
      if (verifyToken(code, secret)) {
        return true;
      }
    }

    // 2. Try Backup Code
    // Since we store hashes, we need to check each one
    for (const hashedCode of user.twoFactorBackupCodes) {
      if (await bcrypt.compare(code, hashedCode)) {
        // Consume backup code: remove this hash
        await db.user.update({
          where: { id: userId },
          data: {
            twoFactorBackupCodes: {
              set: user.twoFactorBackupCodes.filter(h => h !== hashedCode)
            }
          }
        });
        return true;
      }
    }

    return false;
  }
}
