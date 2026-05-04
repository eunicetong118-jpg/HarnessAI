import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthService } from '@/services/auth.service';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    await AuthService.requestPasswordReset(email);

    return NextResponse.json(
      { message: 'If an account exists with that email, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
