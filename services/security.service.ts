import prisma from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/security/crypto';
import { generateSecret, generateKeyuri, verifyToken } from '@/lib/totp';
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

    // Enable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: { totpEnabled: true }
    });

    return { success: true };
  }
}
