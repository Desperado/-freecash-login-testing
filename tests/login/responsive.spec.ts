import { test, expect } from '@playwright/test';
import { loginWithEmail } from '../utils/auth-helpers';

// Define different viewport sizes to test
const viewports = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

test.describe('Login Responsive Design', () => {
  // Test login form appearance on different devices
  for (const [device, viewport] of Object.entries(viewports)) {
    test(`login form renders correctly on ${device}`, async ({ page }) => {
      // Set viewport to simulate different devices
      await page.setViewportSize(viewport);
      
      await page.goto('/login');
      
      // Verify all elements are visible and properly positioned
      await expect(page.getByPlaceholder('Email')).toBeVisible();
      await expect(page.getByPlaceholder('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: /Log in|Sign in/i })).toBeVisible();
      
      // Take screenshot for visual comparison
      await page.screenshot({ path: `login-form-${device}.png` });
    });

    test(`successful login flow on ${device}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      
      await loginWithEmail(page, 'test-user@example.com', 'Test@1234');
      
      // Verify successful login on different devices
      await expect(page.getByText(/Welcome back/i)).toBeVisible();
      await expect(page).toHaveURL(/\/dashboard/);
    });
  }
});