import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthService } from '@/services/auth.service';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  userId: z.string().uuid('Invalid user ID'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, userId, password } = resetPasswordSchema.parse(body);

    const result = await AuthService.resetPassword(token, userId, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to reset password' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Password has been successfully reset.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
