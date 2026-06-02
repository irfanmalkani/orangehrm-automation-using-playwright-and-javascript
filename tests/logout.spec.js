// ──────────────────────────────────────────────────────────
// logout.spec.js – Logout & Session security tests
// Covers successful logout, direct page access restriction,
// and browser back button after logout
// ──────────────────────────────────────────────────────────

const { test, expect } = require('../fixtures/baseTest');
const testData = require('../test-data/testData.json');

test.describe('OrangeHRM Logout Module', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC_LOGOUT_01: Verify logout functionality redirects to login page', async ({ loginPage, dashboardPage }) => {
    const { username, password } = testData.loginCredentials.valid;
    await loginPage.login(username, password);
    await dashboardPage.isLoaded();

    await dashboardPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC_LOGOUT_02: Verify dashboard is not accessible after logout', async ({ loginPage, dashboardPage, page }) => {
    const { username, password } = testData.loginCredentials.valid;
    await loginPage.login(username, password);
    await dashboardPage.isLoaded();
    await dashboardPage.logout();

    // Direct url access attempt
    await page.goto('/web/index.php/dashboard/index');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('TC_LOGOUT_03: Verify browser back button does not access dashboard after logout', async ({ loginPage, dashboardPage, page }) => {
    const { username, password } = testData.loginCredentials.valid;
    await loginPage.login(username, password);
    await dashboardPage.isLoaded();
    await dashboardPage.logout();
    await expect(loginPage.loginButton).toBeVisible();

    // Press browser back button
    await page.goBack();
    await page.waitForTimeout(2000);
    // Should still be on login page or redirected to login
    await expect(loginPage.loginButton).toBeVisible({ timeout: 10000 });
  });
});
