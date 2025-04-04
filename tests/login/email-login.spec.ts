import { test, expect } from '@playwright/test';
import { loginWithEmail } from '../utils/auth-helpers';
import validCredentials from '../fixtures/valid-credentials.json';

// Extend the Window interface to include grecaptcha
declare global {
  interface Window {
    grecaptcha?: {
      execute: () => void;
    };
  }
}
import invalidCredentials from '../fixtures/invalid-credentials.json';

test.describe('Email/Password Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Handle cookies popup if present
    const cookiesButton = page.getByRole('button', { name: "Yes, I'm happy!" });
    if (await cookiesButton.isVisible()) {
      await cookiesButton.click();
    }

    await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  });

  test('successful login with valid credentials', async ({ page }) => {
    const { email, password } = validCredentials.testUser;
    
    // Fill login form in modal using specific IDs
    await page.locator('#basic-signin-email').fill(email);
    await page.locator('#basic-signin-password').fill(password);

    // Handle reCAPTCHA if present
    const frame = page.frameLocator('iframe[title="reCAPTCHA"]');
    if (await frame.locator('body').isVisible()) {
      // In test environment, we should either:
      // 1. Have reCAPTCHA in test mode
      // 2. Mock the reCAPTCHA response
      // 3. Disable reCAPTCHA for test environment
      await page.evaluate(() => {
        window.grecaptcha?.execute();
      });
    }

    await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
    
    // Verify successful login
    await expect(page.getByText(/Welcome back/i)).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('user-avatar')).toBeVisible();
  });

  test('shows error with invalid email format', async ({ page }) => {
    // Fill form with invalid data using specific IDs
    await page.locator('#basic-signin-email').fill(invalidCredentials.invalidEmails[0]);
    await page.locator('#basic-signin-password').fill(invalidCredentials.invalidPasswords[0]);
    await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
    
    // Verify error message appears
    await expect(page.getByText(/Please enter a valid email address/i)).toBeVisible();
    
    // Modal should still be visible
    await expect(page.locator('.chakra-modal__body')).toBeVisible();
  });

  test('shows error with incorrect password', async ({ page }) => {
    const { email } = validCredentials.testUser;
    
    await page.locator('#basic-signin-email').fill(email);
    await page.locator('#basic-signin-password').fill(invalidCredentials.invalidPasswords[0]);
    await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
    
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
    await expect(page.locator('.chakra-modal__body')).toBeVisible();
  });

  test('preserves user email after failed login attempt', async ({ page }) => {
    const { email } = validCredentials.testUser;
    
    await page.locator('#basic-signin-email').fill(email);
    await page.locator('#basic-signin-password').fill(invalidCredentials.invalidPasswords[0]);
    await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
    
    // Check if email field still contains the previously entered email
    await expect(page.locator('#basic-signin-email')).toHaveValue(email);
    
    // Password field should be cleared
    await expect(page.locator('#basic-signin-password')).toHaveValue('');
  });

  test('can switch between login and signup forms', async ({ page }) => {
    // Click registration link
    await page.getByText('Registrieren').click();
    
    // Verify signup form is visible
    await expect(page.getByText('Konto erstellen')).toBeVisible();
    
    // Switch back to login
    await page.getByText('Anmelden').last().click();
    
    // Verify login form is visible
    await expect(page.getByRole('button', { name: 'Anmelden', exact: true })).toBeVisible();
  });
});