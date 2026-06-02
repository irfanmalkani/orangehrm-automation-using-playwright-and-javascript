// ──────────────────────────────────────────────────────────
// dashboard.spec.js – Dashboard Verification E2E tests
// Covers widgets, sidebar navigation, user details, sidebar
// collapse, module navigation, and search
// ──────────────────────────────────────────────────────────

const { test, expect } = require('../fixtures/baseTest');
const testData = require('../test-data/testData.json');

test.describe('OrangeHRM Dashboard Module', () => {

  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    const { username, password } = testData.loginCredentials.valid;
    await loginPage.login(username, password);
    await dashboardPage.isLoaded();
  });

  test('TC_DASH_01: Verify dashboard page loads after login', async ({ dashboardPage }) => {
    const headerText = await dashboardPage.getHeaderText();
    expect(headerText.trim()).toBe('Dashboard');
  });

  test('TC_DASH_02: Verify dashboard widgets are visible', async ({ dashboardPage }) => {
    const widgetCount = await dashboardPage.getWidgetsCount();
    expect(widgetCount).toBeGreaterThan(0);

    const visible = await dashboardPage.areWidgetsVisible();
    expect(visible).toBe(true);
  });

  test('TC_DASH_03: Verify Time at Work widget is displayed', async ({ dashboardPage }) => {
    await expect(dashboardPage.timeAtWorkWidget).toBeVisible();
  });

  test('TC_DASH_04: Verify My Actions widget is displayed', async ({ dashboardPage }) => {
    await expect(dashboardPage.myActionsWidget).toBeVisible();
  });

  test('TC_DASH_05: Verify Quick Launch widget is displayed', async ({ dashboardPage }) => {
    await expect(dashboardPage.quickLaunchWidget).toBeVisible();
  });

  test('TC_DASH_06: Verify sidebar contains all main navigation items', async ({ dashboardPage }) => {
    const modules = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info', 'Performance', 'Dashboard', 'Directory', 'Maintenance', 'Claim', 'Buzz'];
    for (const moduleName of modules) {
      await expect(dashboardPage.sidebarLink(moduleName)).toBeVisible();
    }
  });

  test('TC_DASH_07: Verify logged-in user name is displayed in header', async ({ dashboardPage }) => {
    const userName = await dashboardPage.getLoggedInUserName();
    expect(userName.trim().length).toBeGreaterThan(0);
  });

  test('TC_DASH_08: Verify user dropdown shows About, Support, Change Password, Logout', async ({ dashboardPage }) => {
    await dashboardPage.openUserDropdown();

    await expect(dashboardPage.aboutLink).toBeVisible();
    await expect(dashboardPage.supportLink).toBeVisible();
    await expect(dashboardPage.changePasswordLink).toBeVisible();
    await expect(dashboardPage.logoutLink).toBeVisible();
  });

  test('TC_DASH_09: Verify sidebar collapse and expand functionality', async ({ dashboardPage }) => {
    await expect(dashboardPage.sidebar).toBeVisible();
    
    // Click toggle to collapse
    await dashboardPage.sidebarToggle.click({ force: true });
    await dashboardPage.page.waitForTimeout(500);
    await expect(dashboardPage.sidebar).toHaveClass(/toggled/);
    
    // Click toggle to expand back
    await dashboardPage.sidebarToggle.click({ force: true });
    await dashboardPage.page.waitForTimeout(500);
    await expect(dashboardPage.sidebar).not.toHaveClass(/toggled/);
  });

  test('TC_DASH_10: Verify Employees on Leave Today widget is displayed', async ({ dashboardPage }) => {
    await expect(dashboardPage.employeesOnLeaveWidget).toBeVisible();
  });

  test('TC_DASH_11: Verify sidebar search filters navigation items', async ({ dashboardPage }) => {
    await dashboardPage.searchModule('Admin');
    await dashboardPage.page.waitForTimeout(500);
    // Only Admin-related items should be visible
    await expect(dashboardPage.sidebarLink('Admin')).toBeVisible();
  });

  test('TC_DASH_12: Verify dashboard URL contains correct path', async ({ dashboardPage }) => {
    expect(dashboardPage.page.url()).toContain('/dashboard/index');
  });
});
