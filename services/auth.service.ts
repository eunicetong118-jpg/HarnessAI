import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createToken, validateToken } from './actionToken.service';
import { sendMail } from '@/lib/email';

export class AuthService {
  static async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Return success even if user not found to prevent enumeration
      return { success: true };
    }

    const token = await createToken(user.id, 'PASSWORD_RESET');
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}?userId=${user.id}`;

    await sendMail(
      email,
      'Reset your password',
      `Click the following link to reset your password: ${resetUrl}`
    );

    return { success: true };
  }

  static async resetPassword(token: string, userId: string, newPassword: string) {
    const validation = await validateToken(userId, token, 'PASSWORD_RESET');

    if (!validation.success) {
      return validation;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        totpEnabled: false,
      }
    });

    return { success: true };
  }
}
