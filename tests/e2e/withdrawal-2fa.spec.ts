import { test, expect } from '@playwright/test';

test.describe('Withdrawal 2FA Flow', () => {
  // This test assumes a seed or setup that has a user with 2FA enabled.
  // In a real CI environment, we would use a global setup to create this user
  // and inject the session.

  test.skip('should prompt for 2FA when initiating a withdrawal', async ({ page }) => {
    // 1. Login as 2FA enabled user (placeholder for auth setup)
    // await page.goto('/login');
    // ... auth logic ...

    // 2. Navigate to withdrawal page
    await page.goto('/dashboard/withdraw');

    // 3. Enter amount and submit
    await page.fill('input[id="amount"]', '50.00');
    await page.click('button[type="submit"]');

    // 4. Verify 2FA challenge is shown
    await expect(page.locator('text=Security Verification')).toBeVisible();
    await expect(page.locator('text=Enter your 6-digit TOTP code')).toBeVisible();

    // 5. Enter invalid code
    await page.fill('input[id="securityCode"]', '000000');
    await page.click('button:has-text("Verify & Submit")');

    // 6. Verify error message
    await expect(page.locator('text=Invalid security code')).toBeVisible();

    // 7. Enter valid code (would need otplib to generate)
    // const validCode = authenticator.generate(secret);
    // await page.fill('input[id="securityCode"]', validCode);
    // await page.click('button:has-text("Verify & Submit")');

    // 8. Verify success
    // await expect(page.locator('text=submitted successfully')).toBeVisible();
  });

  test.skip('should allow withdrawal with backup code', async ({ page }) => {
    // Similar to above but using an 8-character backup code
  });
});
