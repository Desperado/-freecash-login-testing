import { test, expect } from '@playwright/test';
import { loginWithEmail } from '../utils/auth-helpers';
import validCredentials from '../fixtures/valid-credentials.json';
import invalidCredentials from '../fixtures/invalid-credentials.json';

test.describe('Login Security Features', () => {
  test('protects against XSS in login form', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill(invalidCredentials.invalidEmails[1]); // XSS payload
    await page.getByPlaceholder('Password').fill(invalidCredentials.invalidPasswords[1]); // XSS payload
    await page.getByRole('button', { name: /Log in|Sign in/i }).click();
    
    // Check if the XSS payload was properly sanitized
    // This is a basic check - actual implementation would depend on how site handles input
    await expect(page.locator('script:text("XSS")')).toHaveCount(0);
  });

  test('session persistence after login', async ({ page }) => {
    const { email, password } = validCredentials.testUser;
    await loginWithEmail(page, email, password);
    
    // After successful login, store cookies or local storage state
    const cookies = await page.context().cookies();
    expect(cookies.some(cookie => cookie.name === 'auth_token' || cookie.name === 'session_id')).toBeTruthy();
    
    // Navigate to another page that requires authentication
    await page.goto('/profile');
    
    // Verify we're still authenticated
    await expect(page.getByTestId('user-avatar')).toBeVisible();
  });

  test('secure transmission of login credentials', async ({ page }) => {
    // Create a request listener
    await page.route('**/login', route => {
      // Check that the request uses HTTPS
      expect(route.request().url()).toMatch(/^https:\/\//);
      route.continue();
    });
    
    await loginWithEmail(page, 'test-user@example.com', 'Test@1234');
  });
});