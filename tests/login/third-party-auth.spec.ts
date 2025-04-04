import { test, expect } from '@playwright/test';
import { loginWithGoogle, loginWithFacebook, loginWithSteam } from '../utils/auth-helpers';
import validCredentials from '../fixtures/valid-credentials.json';

test.describe('Third-Party Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // Note: These tests will likely require special handling for OAuth flows
  // and may need mock services or specific test environments
  test('shows Google authentication popup', async ({ page }) => {
    // Start listening for popup before clicking
    const popupPromise = page.waitForEvent('popup');
    
    await page.getByRole('button', { name: /Continue with Google/i }).click();
    
    const popup = await popupPromise;
    await expect(popup.url()).toContain('accounts.google.com');
  });

  test('shows Facebook authentication popup', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup');
    
    await page.getByRole('button', { name: /Continue with Facebook/i }).click();
    
    const popup = await popupPromise;
    await expect(popup.url()).toContain('facebook.com');
  });

  test('redirects to Steam for authentication', async ({ page }) => {
    await page.getByRole('button', { name: /Continue with Steam/i }).click();
    
    // Steam might use redirection rather than popup
    await expect(page.url()).toContain('steamcommunity.com');
  });

  test('completes Google authentication flow', async ({ page }) => {
    const { email, password } = validCredentials.googleUser;
    await loginWithGoogle(page, email, password);
  });

  test('completes Facebook authentication flow', async ({ page }) => {
    const { email, password } = validCredentials.facebookUser;
    await loginWithFacebook(page, email, password);
  });

  test('completes Steam authentication flow', async ({ page }) => {
    const { username, password } = validCredentials.steamUser;
    await loginWithSteam(page, username, password);
  });
});