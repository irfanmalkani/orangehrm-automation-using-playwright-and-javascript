const { test, expect } = require('../fixtures/baseTest');
const testData = require('../test-data/testData.json');

test.describe.serial('OrangeHRM Admin Module', () => {
  const uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
  const testEmployeeId = uniqueId;
  const empFirstName = `Alex${uniqueId.substring(0, 3)}`;
  const empLastName = `Hunter${uniqueId.substring(3)}`;
  const testUsername = `alex.${uniqueId}`;
  
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    const { username, password } = testData.loginCredentials.valid;
    await loginPage.login(username, password);
    await dashboardPage.isLoaded();
  });

  test('TC_ADMIN_01: Add new user (Pre-requisite: Add Employee first)', async ({ dashboardPage, pimPage, adminPage }) => {
    // 1. Add Employee to use for User Creation
    await dashboardPage.navigateToModule('PIM');
    await pimPage.addEmployee(empFirstName, empLastName, testEmployeeId);
    
    // 2. Add Admin User linked to this Employee
    await dashboardPage.navigateToModule('Admin');
    const fullName = `${empFirstName} ${empLastName}`;
    const { role, password } = testData.userDetails;
    await adminPage.addUser(role, fullName, testUsername, password);
    
    // Verify user is in results
    await adminPage.searchUser(testUsername);
    await expect(adminPage.firstRowUsername).toHaveText(testUsername);
  });

  test('TC_ADMIN_02: Search user by username', async ({ dashboardPage, adminPage }) => {
    await dashboardPage.navigateToModule('Admin');
    await adminPage.searchUser(testUsername);
    await expect(adminPage.firstRowUsername).toHaveText(testUsername);
  });

  test('TC_ADMIN_03: Update user details', async ({ dashboardPage, adminPage }) => {
    await dashboardPage.navigateToModule('Admin');
    
    // Update user role from Admin to ESS (or vice versa, or select Admin again to verify toggle)
    await adminPage.updateUserRole(testUsername, 'ESS');
    
    // Verify it updated by opening edit again
    await adminPage.searchUser(testUsername);
    await expect(adminPage.firstRowUsername).toHaveText(testUsername, { timeout: 15000 });
    await adminPage.editButton.click();
    await expect(adminPage.usernameInput).toHaveValue(testUsername, { timeout: 15000 });
    await expect(adminPage.userRoleDropdown).toHaveText('ESS');
  });

  test('TC_ADMIN_04: Verify user role displays correctly in search results', async ({ dashboardPage, adminPage }) => {
    await dashboardPage.navigateToModule('Admin');
    await adminPage.searchUser(testUsername);
    await expect(adminPage.firstRowUsername).toHaveText(testUsername, { timeout: 15000 });
    
    // Verify role column displays ESS (from previous update)
    const roleText = await adminPage.firstRowRole.textContent();
    expect(roleText.trim()).toBe('ESS');
  });

  test('TC_ADMIN_05: Verify Admin page has Add button visible', async ({ dashboardPage, adminPage }) => {
    await dashboardPage.navigateToModule('Admin');
    await expect(adminPage.addButton).toBeVisible();
  });

  test('TC_ADMIN_06: Delete existing user and cleanup employee', async ({ dashboardPage, adminPage, pimPage }) => {
    // 1. Delete Admin User
    await dashboardPage.navigateToModule('Admin');
    await adminPage.deleteUser(testUsername);
    
    // Verify user deleted
    await adminPage.searchUser(testUsername);
    await expect(adminPage.tableRows).toHaveCount(0);

    // 2. Delete Employee (Cleanup)
    await dashboardPage.navigateToModule('PIM');
    await pimPage.deleteEmployee(testEmployeeId);
  });
});
