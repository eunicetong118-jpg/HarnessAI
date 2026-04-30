import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { createWithdrawal } from '@/services/withdrawal.service';

const withdrawalSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
});

/**
 * Handles withdrawal requests from authenticated users.
 */
export const POST = auth(async (req) => {
  const session = (req as any).auth;

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount } = withdrawalSchema.parse(body);

    // Convert USD to cents (BigInt)
    // We use Math.round to handle floating point issues if any
    const amountInCents = BigInt(Math.round(amount * 100));

    const ticket = await createWithdrawal(session.user.id, amountInCents);

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === 'Insufficient balance') {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message === 'Amount must be greater than zero') {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    console.error('[WITHDRAWAL] Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}) as any;
