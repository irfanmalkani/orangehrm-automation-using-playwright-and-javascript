// ──────────────────────────────────────────────────────────
// forgotPassword.spec.js – Forgot Password flow
// Covers reset link, cancellation, submit, and empty validation
// ──────────────────────────────────────────────────────────

const { test, expect } = require('../fixtures/baseTest');

test.describe('OrangeHRM Forgot Password Module', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC_FORGOT_01: Verify forgot password link navigates correctly', async ({ loginPage }) => {
    await loginPage.clickForgotPassword();

    await expect(loginPage.resetUsernameInput).toBeVisible();
    await expect(loginPage.resetButton).toBeVisible();
    await expect(loginPage.cancelButton).toBeVisible();
  });

  test('TC_FORGOT_02: Verify cancel button on forgot password returns to login', async ({ loginPage }) => {
    await loginPage.clickForgotPassword();
    await loginPage.clickCancelOnForgotPassword();

    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC_FORGOT_03: Verify password reset request with valid username', async ({ loginPage, page }) => {
    // Intercept POST request and mock redirect to success page due to slow public server SMTP
    await page.route('**/auth/requestResetPassword', async route => {
      await route.fulfill({
        status: 302,
        headers: {
          'Location': '/web/index.php/auth/sendPasswordReset'
        }
      });
    });

    await loginPage.clickForgotPassword();
    await loginPage.resetPassword('Admin');

    // Wait for the text content of resetSuccessTitle to change to the success message
    await expect(loginPage.resetSuccessTitle).toHaveText(/Reset Password link sent successfully/i, { timeout: 20000 });
  });

  test('TC_FORGOT_04: Verify forgot password page heading text', async ({ loginPage, page }) => {
    await loginPage.clickForgotPassword();

    // Verify the page heading says "Reset Password"
    const heading = page.locator('h6.orangehrm-forgot-password-title');
    await expect(heading).toHaveText('Reset Password');
  });
});
