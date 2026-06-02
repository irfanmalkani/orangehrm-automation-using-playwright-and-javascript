// ──────────────────────────────────────────────────────────
// login.spec.js – E2E Authentication tests
// Covers login with valid/invalid credentials, password masking,
// page title, URL verification, and placeholder checks
// ──────────────────────────────────────────────────────────

const { test, expect } = require('../fixtures/baseTest');
const testData = require('../test-data/testData.json');

test.describe('OrangeHRM Login Module', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC_LOGIN_01: Verify successful login with valid credentials', async ({ loginPage, dashboardPage }) => {
    const { username, password } = testData.loginCredentials.valid;
    await loginPage.login(username, password);
    
    const isLoaded = await dashboardPage.isLoaded();
    expect(isLoaded).toBe(true);

    const headerText = await dashboardPage.getHeaderText();
    expect(headerText.trim()).toBe('Dashboard');
  });

  test('TC_LOGIN_02: Verify login with invalid credentials', async ({ loginPage }) => {
    const { username, password } = testData.loginCredentials.invalid;
    await loginPage.login(username, password);

    const errorText = await loginPage.getErrorAlertText();
    expect(errorText).toBe('Invalid credentials');
  });

  test('TC_LOGIN_03: Verify error with valid username and wrong password', async ({ loginPage }) => {
    await loginPage.login('Admin', 'wrongpassword');

    const errorText = await loginPage.getErrorAlertText();
    expect(errorText).toBe('Invalid credentials');
  });

  test('TC_LOGIN_04: Verify password field masks the input characters', async ({ loginPage }) => {
    const passwordType = await loginPage.passwordInput.getAttribute('type');
    expect(passwordType).toBe('password');
  });

  test('TC_LOGIN_05: Verify login page UI elements are visible', async ({ loginPage }) => {
    await expect(loginPage.orangeHrmLogo).toBeVisible();
    await expect(loginPage.loginTitle).toHaveText('Login');
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.copyrightText).toBeVisible();
  });

  test('TC_LOGIN_06: Verify credential hint box displays default credentials', async ({ loginPage }) => {
    const hintText = await loginPage.getCredentialHintText();
    expect(hintText).toContain('Admin');
    expect(hintText).toContain('admin123');
  });

  test('TC_LOGIN_07: Verify login page title contains OrangeHRM', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('OrangeHRM');
  });

  test('TC_LOGIN_08: Verify login page URL contains auth/login', async ({ page }) => {
    expect(page.url()).toContain('/auth/login');
  });

  test('TC_LOGIN_09: Verify input placeholders display correct text', async ({ loginPage }) => {
    const usernamePlaceholder = await loginPage.usernameInput.getAttribute('placeholder');
    const passwordPlaceholder = await loginPage.passwordInput.getAttribute('placeholder');
    expect(usernamePlaceholder).toBe('Username');
    expect(passwordPlaceholder).toBe('Password');
  });
});
