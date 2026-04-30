import { createToken } from './actionToken.service';
import { sendMail } from '@/lib/email';

export async function sendVerificationEmail(userId: string, email: string) {
  const token = await createToken(userId, 'EMAIL_VERIFICATION');
  const url = `${process.env.NEXTAUTH_URL}/verify/email?token=${token}&uid=${userId}`;
  await sendMail(email, 'Verify your email', `Click here: ${url}`);
}
