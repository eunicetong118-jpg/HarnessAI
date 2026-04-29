'use server';

import { auth } from '@/lib/auth';
import { linkAccount } from '@/services/broker.service';
import { revalidatePath } from 'next/cache';

/**
 * Server action to link a broker account.
 * Validates the user session and calls the broker service.
 */
export async function linkBrokerAccount(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('You must be logged in to link a broker account');
  }

  const mt5AccountNo = formData.get('mt5AccountNo') as string;
  const countryCode = formData.get('countryCode') as string;

  if (!mt5AccountNo || !countryCode) {
    throw new Error('Missing required fields');
  }

  try {
    await linkAccount(session.user.id, mt5AccountNo, countryCode);
    revalidatePath('/onboarding');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
