const { test, expect } = require('../fixtures/baseTest');
const testData = require('../test-data/testData.json');

test.describe.serial('OrangeHRM PIM Module', () => {
  const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
  const testEmployeeId = uniqueId;
  const empFirstName = `Alex${uniqueId.substring(0, 3)}`;
  const empLastName = `Hunter${uniqueId.substring(3)}`;
  const testNickname = `Nick${uniqueId.substring(0, 4)}`;
  
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    const { username, password } = testData.loginCredentials.valid;
    await loginPage.login(username, password);
    await dashboardPage.isLoaded();
    await dashboardPage.navigateToModule('PIM');
  });

  test('TC_PIM_01: Add new employee', async ({ pimPage }) => {
    await pimPage.addEmployee(empFirstName, empLastName, testEmployeeId);
    
    // Search to verify addition
    await pimPage.searchEmployee(testEmployeeId);
    await expect(pimPage.firstRowId).toHaveText(testEmployeeId);
  });

  test('TC_PIM_02: Search employee details', async ({ pimPage }) => {
    await pimPage.searchEmployee(testEmployeeId);
    await expect(pimPage.firstRowId).toHaveText(testEmployeeId);
  });

  test('TC_PIM_03: Update employee information', async ({ pimPage, page }) => {
    const isNicknameTested = await pimPage.updateEmployeeNickname(testEmployeeId, testNickname);
    
    // Navigate and check
    await pimPage.searchEmployee(testEmployeeId);
    await expect(pimPage.firstRowId).toHaveText(testEmployeeId, { timeout: 15000 });
    await pimPage.editButton.click();
    await expect(pimPage.employeeIdInput).toHaveValue(testEmployeeId, { timeout: 15000 });
    if (isNicknameTested) {
      await expect(pimPage.nickNameInput).toHaveValue(testNickname);
    } else {
      await expect(pimPage.otherIdInput).toHaveValue(testNickname);
    }
  });

  test('TC_PIM_04: Delete employee records', async ({ pimPage }) => {
    await pimPage.deleteEmployee(testEmployeeId);
    
    // Verify deletion
    await pimPage.searchEmployee(testEmployeeId);
    await expect(pimPage.tableRows).toHaveCount(0);
  });

  test('TC_PIM_05: Verify PIM search with non-existent employee ID returns no records', async ({ pimPage }) => {
    const fakeId = '999999';
    await pimPage.searchEmployee(fakeId);
    
    // Wait for the "No Records Found" message to be visible
    const noRecords = pimPage.page.locator('span:has-text("No Records Found")').first();
    await expect(noRecords).toBeVisible({ timeout: 15000 });
  });

  test('TC_PIM_06: Verify PIM Employee List tab loads correctly', async ({ pimPage }) => {
    await pimPage.employeeListTab.waitFor({ state: 'visible', timeout: 15000 });
    await pimPage.employeeListTab.click();
    await pimPage.page.waitForTimeout(1500);
    
    // Verify search form elements are visible
    await expect(pimPage.searchEmployeeIdInput).toBeVisible();
    await expect(pimPage.searchButton).toBeVisible();
    await expect(pimPage.resetButton).toBeVisible();
  });
});
