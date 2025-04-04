import { test, expect } from '@playwright/test';
import { triggerCaptcha, loginWithEmail } from '../utils/auth-helpers';
import validCredentials from '../fixtures/valid-credentials.json';
import invalidCredentials from '../fixtures/invalid-credentials.json';

test.describe('Captcha Challenge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('triggers captcha after three failed login attempts', async ({ page }) => {
    const { email } = validCredentials.testUser;
    await triggerCaptcha(page, email, invalidCredentials.invalidPasswords[0]);
  });

  test('prevents login without solving captcha', async ({ page }) => {
    const { email } = validCredentials.testUser;
    const correctPassword = validCredentials.testUser.password;
    const wrongPassword = invalidCredentials.invalidPasswords[0];
    
    await triggerCaptcha(page, email, wrongPassword);
    
    await loginWithEmail(page, email, correctPassword);
    
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('.captcha-container')).toBeVisible();
    await expect(page.getByText(/Please complete the captcha/i)).toBeVisible();
  });

  // Note: Testing actual captcha solving is complex and may require mock services
});