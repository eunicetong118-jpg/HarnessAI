import { authConfig } from './lib/auth.config';

async function test() {
  const session = { user: {} };
  const token = {
    sub: 'user_123',
    role: 'ADMIN',
    isDisabled: false,
    isEmailVerified: true,
    totpEnabled: false,
    twoFactorVerified: false
  };

  try {
    console.log('Running session callback...');
    const result = await (authConfig.callbacks as any).session({ session, token });
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error in session callback:', error);
  }
}

test();
