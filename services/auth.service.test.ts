import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as actionTokenService from './actionToken.service';
import * as emailLib from '@/lib/email';

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('./actionToken.service', () => ({
  createToken: vi.fn(),
  validateToken: vi.fn(),
}));

vi.mock('@/lib/email', () => ({
  sendMail: vi.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requestPasswordReset', () => {
    it('should create a token and send email if user exists', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' };
      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (actionTokenService.createToken as any).mockResolvedValue('mock-token');

      const result = await AuthService.requestPasswordReset('test@example.com');

      expect(result).toEqual({ success: true });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(actionTokenService.createToken).toHaveBeenCalledWith('user-1', 'PASSWORD_RESET');
      expect(emailLib.sendMail).toHaveBeenCalledWith(
        'test@example.com',
        'Reset your password',
        expect.stringContaining('token=mock-token')
      );
    });

    it('should return success but do nothing if user does not exist', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const result = await AuthService.requestPasswordReset('nonexistent@example.com');

      expect(result).toEqual({ success: true });
      expect(actionTokenService.createToken).not.toHaveBeenCalled();
      expect(emailLib.sendMail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should update password and disable TOTP if token is valid', async () => {
      (actionTokenService.validateToken as any).mockResolvedValue({ success: true });
      (bcrypt.hash as any).mockResolvedValue('hashed-password');

      const result = await AuthService.resetPassword('valid-token', 'user-1', 'new-password');

      expect(result).toEqual({ success: true });
      expect(actionTokenService.validateToken).toHaveBeenCalledWith('user-1', 'valid-token', 'PASSWORD_RESET');
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 12);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          password: 'hashed-password',
          totpEnabled: false,
        }
      });
    });

    it('should return error if token is invalid', async () => {
      (actionTokenService.validateToken as any).mockResolvedValue({ success: false, error: 'Invalid or expired token' });

      const result = await AuthService.resetPassword('invalid-token', 'user-1', 'new-password');

      expect(result).toEqual({ success: false, error: 'Invalid or expired token' });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});
