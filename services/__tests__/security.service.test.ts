import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SecurityService } from '../security.service';
import prisma from '@/lib/prisma';
import * as crypto from '@/lib/security/crypto';
import * as totp from '@/lib/totp';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/security/crypto', () => ({
  encrypt: vi.fn((s) => `enc:${s}`),
  decrypt: vi.fn((s) => s.replace('enc:', '')),
}));

vi.mock('@/lib/totp', () => ({
  generateSecret: vi.fn(() => 'secret123'),
  generateKeyuri: vi.fn(() => 'keyuri123'),
  verifyToken: vi.fn(() => true),
  generateBackupCodes: vi.fn(() => ['backup1', 'backup2']),
}));

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(() => Promise.resolve('data:image/png;base64,qr')),
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn((s) => Promise.resolve(`hashed:${s}`)),
    compare: vi.fn((s, h) => Promise.resolve(h === `hashed:${s}`)),
  },
}));

describe('SecurityService', () => {
  const userId = 'user-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateSetup', () => {
    it('should generate a secret, encrypt it, save it, and return a QR code', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ id: userId, email: 'test@example.com' });

      const result = await SecurityService.generateSetup(userId);

      expect(totp.generateSecret).toHaveBeenCalled();
      expect(crypto.encrypt).toHaveBeenCalledWith('secret123');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          totpSecret: 'enc:secret123',
          totpEnabled: false,
        },
      });
      expect(QRCode.toDataURL).toHaveBeenCalledWith('keyuri123');
      expect(result.qrDataUrl).toBe('data:image/png;base64,qr');
    });

    it('should throw if user not found', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);
      await expect(SecurityService.generateSetup(userId)).rejects.toThrow('User not found');
    });
  });

  describe('verifyAndEnable', () => {
    it('should decrypt secret, verify token, enable 2FA, and generate hashed backup codes', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ id: userId, totpSecret: 'enc:secret123' });

      const result = await SecurityService.verifyAndEnable(userId, '123456');

      expect(crypto.decrypt).toHaveBeenCalledWith('enc:secret123');
      expect(totp.verifyToken).toHaveBeenCalledWith('123456', 'secret123');
      expect(bcrypt.hash).toHaveBeenCalledWith('backup1', 10);
      expect(bcrypt.hash).toHaveBeenCalledWith('backup2', 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          totpEnabled: true,
          twoFactorBackupCodes: ['hashed:backup1', 'hashed:backup2']
        },
      });
      expect(result.success).toBe(true);
      expect(result.backupCodes).toEqual(['backup1', 'backup2']);
    });

    it('should return error for invalid token', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ id: userId, totpSecret: 'enc:secret123' });
      (totp.verifyToken as any).mockReturnValue(false);

      const result = await SecurityService.verifyAndEnable(userId, 'wrong');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid verification code');
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('verifySecurityCode', () => {
    it('should return true if 2FA is disabled', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ id: userId, totpEnabled: false });

      const result = await SecurityService.verifySecurityCode(userId, 'any');
      expect(result).toBe(true);
    });

    it('should verify valid TOTP token', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        id: userId,
        totpEnabled: true,
        totpSecret: 'enc:secret123',
        twoFactorBackupCodes: []
      });
      (totp.verifyToken as any).mockReturnValue(true);

      const result = await SecurityService.verifySecurityCode(userId, '123456');
      expect(result).toBe(true);
      expect(totp.verifyToken).toHaveBeenCalledWith('123456', 'secret123');
    });

    it('should verify and consume valid backup code', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        id: userId,
        totpEnabled: true,
        totpSecret: 'enc:secret123',
        twoFactorBackupCodes: ['hashed:backup1', 'hashed:backup2']
      });
      (totp.verifyToken as any).mockReturnValue(false); // TOTP fails

      const result = await SecurityService.verifySecurityCode(userId, 'backup1');
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('backup1', 'hashed:backup1');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          twoFactorBackupCodes: {
            set: ['hashed:backup2']
          }
        }
      });
    });

    it('should return false if both fail', async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        id: userId,
        totpEnabled: true,
        totpSecret: 'enc:secret123',
        twoFactorBackupCodes: ['hashed:backup1']
      });
      (totp.verifyToken as any).mockReturnValue(false);

      const result = await SecurityService.verifySecurityCode(userId, 'wrong');
      expect(result).toBe(false);
    });
  });
});
