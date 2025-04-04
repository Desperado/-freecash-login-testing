import { Page, expect } from '@playwright/test';

/**
 * Helper functions for authentication and login flows
 */
export async function loginWithEmail(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: /Log in|Sign in/i }).click();
}

export async function loginWithGoogle(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByRole('button', { name: /Continue with Google/i }).click();
  // Handle Google OAuth flow - this will require special handling
  // as it navigates away from your site
}

export async function loginWithFacebook(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByRole('button', { name: /Continue with Facebook/i }).click();
  // Handle Facebook OAuth flow
}

export async function loginWithSteam(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.getByRole('button', { name: /Continue with Steam/i }).click();
  // Handle Steam authentication
}

export async function triggerCaptcha(page: Page, email: string, password: string) {
  // Attempt to login 3 times with invalid credentials to trigger captcha
  for (let i = 0; i < 3; i++) {
    await loginWithEmail(page, email, password);
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
  }
  
  // Check if captcha is now visible
  await expect(page.locator('.captcha-container')).toBeVisible();
}