const { test, expect } = require('../fixtures/baseTest');
const testData = require('../test-data/testData.json');
const fs = require('fs');
const path = require('path');

test.describe('OrangeHRM My Info Module', () => {
  const profilePicPath = path.resolve(__dirname, '../test-data/profile_pic.png');

  test.beforeAll(() => {
    if (!fs.existsSync(profilePicPath)) {
      const dummyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const buffer = Buffer.from(dummyPngBase64, 'base64');
      fs.mkdirSync(path.dirname(profilePicPath), { recursive: true });
      fs.writeFileSync(profilePicPath, buffer);
    }
  });

  test.beforeEach(async ({ loginPage, dashboardPage, myInfoPage }) => {
    await loginPage.navigate();
    const { username, password } = testData.loginCredentials.valid;
    await loginPage.login(username, password);
    await dashboardPage.isLoaded();
    await dashboardPage.navigateToModule('My Info');
    await myInfoPage.savePersonalDetailsButton.waitFor({ state: 'visible', timeout: 25000 });
    await expect(myInfoPage.firstNameInput).not.toHaveValue('', { timeout: 25000 });
  });

  test('TC_MYINFO_01: Update personal details', async ({ myInfoPage }) => {
    const isNicknameVisible = await myInfoPage.nickNameInput.isVisible();
    if (isNicknameVisible) {
      const { nickname } = testData.employeeDetails;
      const updatedNickname = `${nickname}_${Math.floor(Math.random() * 1000)}`;
      await myInfoPage.updatePersonalDetails(updatedNickname, '');
      await myInfoPage.page.reload();
      await expect(myInfoPage.firstNameInput).not.toHaveValue('', { timeout: 25000 });
      const nicknameValue = await myInfoPage.getNicknameValue();
      expect(nicknameValue).toBe(updatedNickname);
    } else {
      const randomOtherId = `ID${Math.floor(100000 + Math.random() * 900000)}`;
      await myInfoPage.updatePersonalDetails('', randomOtherId);
      await myInfoPage.page.reload();
      await expect(myInfoPage.firstNameInput).not.toHaveValue('', { timeout: 25000 });
      await myInfoPage.otherIdInput.waitFor({ state: 'visible' });
      const otherIdValue = await myInfoPage.otherIdInput.inputValue();
      expect(otherIdValue).toBe(randomOtherId);
    }
  });

  test('TC_MYINFO_02: Upload profile image', async ({ myInfoPage }) => {
    await myInfoPage.uploadProfileImage(profilePicPath);
    await expect(myInfoPage.profileImageContainer).toBeVisible();
  });

  test('TC_MYINFO_03: Verify first name field is pre-populated', async ({ myInfoPage }) => {
    const firstName = await myInfoPage.firstNameInput.inputValue();
    expect(firstName.length).toBeGreaterThan(0);
  });

  test('TC_MYINFO_04: Verify My Info page heading displays Personal Details', async ({ myInfoPage }) => {
    const heading = myInfoPage.page.locator('h6.orangehrm-main-title').first();
    await expect(heading).toHaveText('Personal Details');
  });
});
