// ──────────────────────────────────────────────────────────
// validations.spec.js – Form validations
// Covers required field errors and special character handling
// ──────────────────────────────────────────────────────────

const { test, expect } = require('../fixtures/baseTest');

test.describe('OrangeHRM Login Validations', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC_VALID_01: Verify required field validations for empty fields', async ({ loginPage }) => {
    await loginPage.clickLoginButtonWithoutCredentials();

    const usernameError = await loginPage.getUsernameValidationText();
    const passwordError = await loginPage.getPasswordValidationText();

    expect(usernameError).toBe('Required');
    expect(passwordError).toBe('Required');
  });

  test('TC_VALID_02: Verify validation when only password is entered', async ({ loginPage }) => {
    await loginPage.loginWithPasswordOnly('admin123');

    const usernameError = await loginPage.getUsernameValidationText();
    expect(usernameError).toBe('Required');
  });

  test('TC_VALID_03: Verify validation when only username is entered', async ({ loginPage }) => {
    await loginPage.loginWithUsernameOnly('Admin');

    const passwordError = await loginPage.getPasswordValidationText();
    expect(passwordError).toBe('Required');
  });

  test('TC_VALID_04: Verify login fails with special characters in credentials', async ({ loginPage }) => {
    await loginPage.login('<script>alert(1)</script>', '!@#$%^&*()');

    const errorText = await loginPage.getErrorAlertText();
    expect(errorText).toBe('Invalid credentials');
  });
});
