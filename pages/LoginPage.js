// ──────────────────────────────────────────────────────────
// LoginPage.js – Page Object Model for OrangeHRM Login Page
// URL: /web/index.php/auth/login
// ──────────────────────────────────────────────────────────

class LoginPage {
  constructor(page) {
    this.page = page;

    // ── Login Form Elements ──
    this.usernameInput = page.locator('input[placeholder="Username"]');
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.loginButton = page.locator('button.orangehrm-login-button');

    // ── Error & Validation Elements ──
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.usernameRequiredError = page.locator('input[placeholder="Username"]').locator('xpath=ancestor::div[contains(@class,"oxd-input-group")]//span[contains(@class,"oxd-input-group__message")]');
    this.passwordRequiredError = page.locator('input[placeholder="Password"]').locator('xpath=ancestor::div[contains(@class,"oxd-input-group")]//span[contains(@class,"oxd-input-group__message")]');

    // ── Page Branding & Links ──
    this.orangeHrmLogo = page.locator('.orangehrm-login-branding img');
    this.loginTitle = page.locator('.orangehrm-login-title');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.credentialHintBox = page.locator('.orangehrm-login-slot');
    this.copyrightText = page.locator('.orangehrm-copyright-wrapper');

    // ── Forgot Password Page Elements ──
    this.resetUsernameInput = page.locator('input[placeholder="Username"]');
    this.resetButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button.orangehrm-forgot-password-button--cancel');
    this.resetSuccessTitle = page.locator('.orangehrm-forgot-password-wrapper h6');
  }

  // ── Navigation ──
  async navigate() {
    await this.page.goto('/web/index.php/auth/login');
    await this.loginButton.waitFor({ state: 'visible', timeout: 20000 });
  }

  // ── Actions ──
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickLoginButtonWithoutCredentials() {
    await this.loginButton.click();
  }

  async loginWithUsernameOnly(username) {
    await this.usernameInput.fill(username);
    await this.loginButton.click();
  }

  async loginWithPasswordOnly(password) {
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL('**/requestPasswordResetCode');
  }

  async resetPassword(username) {
    await this.resetUsernameInput.fill(username);
    await this.resetButton.click();
  }

  async clickCancelOnForgotPassword() {
    await this.cancelButton.click();
    await this.page.waitForURL('**/auth/login');
  }

  // ── Getter Methods ──
  async getErrorAlertText() {
    await this.errorAlert.waitFor({ state: 'visible' });
    return await this.errorAlert.textContent();
  }

  async getUsernameValidationText() {
    await this.usernameRequiredError.waitFor({ state: 'visible' });
    return await this.usernameRequiredError.textContent();
  }

  async getPasswordValidationText() {
    await this.passwordRequiredError.waitFor({ state: 'visible' });
    return await this.passwordRequiredError.textContent();
  }

  async getPageTitle() {
    return await this.loginTitle.textContent();
  }

  async getCredentialHintText() {
    return await this.credentialHintBox.textContent();
  }

  async getResetSuccessTitle() {
    await this.resetSuccessTitle.waitFor({ state: 'visible', timeout: 10000 });
    return await this.resetSuccessTitle.textContent();
  }

  // ── Verification Helpers ──
  async isLoginPageVisible() {
    return await this.loginButton.isVisible();
  }

  async isLogoVisible() {
    return await this.orangeHrmLogo.isVisible();
  }

  async isForgotPasswordLinkVisible() {
    return await this.forgotPasswordLink.isVisible();
  }
}

module.exports = LoginPage;
