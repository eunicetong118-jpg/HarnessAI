import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateToken } from '@/services/actionToken.service';

export async function POST(req: Request) {
  try {
    const { userId, token } = await req.json();

    if (!userId || !token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validation = await validateToken(userId, token, 'EMAIL_VERIFICATION');

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
      },
    });

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
