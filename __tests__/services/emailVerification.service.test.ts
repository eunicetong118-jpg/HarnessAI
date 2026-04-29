import { sendVerificationEmail } from '@/services/emailVerification.service';
import { sendMail } from '@/lib/email';
import { createToken } from '@/services/actionToken.service';

jest.mock('@/lib/email', () => ({ sendMail: jest.fn() }));
jest.mock('@/services/actionToken.service', () => ({
  createToken: jest.fn().mockResolvedValue('mock-token')
}));

describe('EmailVerification Service', () => {
  it('calls sendMail with correct link', async () => {
    await sendVerificationEmail('user-1', 'test@example.com');
    expect(sendMail).toHaveBeenCalledWith(
      'test@example.com',
      'Verify your email',
      expect.stringContaining('/auth/verify/email?token=mock-token')
    );
  });
});
