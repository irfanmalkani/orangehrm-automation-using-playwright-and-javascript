// ──────────────────────────────────────────────────────────
// DashboardPage.js – Page Object Model for OrangeHRM Dashboard
// URL: /web/index.php/dashboard/index
// ──────────────────────────────────────────────────────────

class DashboardPage {
  constructor(page) {
    this.page = page;

    // ── Header & Breadcrumb ──
    this.headerBreadcrumb = page.locator('.oxd-topbar-header-breadcrumb h6');

    // ── Dashboard Widgets ──
    this.widgets = page.locator('.oxd-sheet.orangehrm-dashboard-widget');
    this.timeAtWorkWidget = page.locator('.oxd-sheet.orangehrm-dashboard-widget', { hasText: 'Time at Work' });
    this.myActionsWidget = page.locator('.oxd-sheet.orangehrm-dashboard-widget', { hasText: 'My Actions' });
    this.quickLaunchWidget = page.locator('.oxd-sheet.orangehrm-dashboard-widget', { hasText: 'Quick Launch' });
    this.buzzWidget = page.locator('.oxd-sheet.orangehrm-dashboard-widget', { hasText: 'Buzz Latest Posts' });
    this.employeesOnLeaveWidget = page.locator('.oxd-sheet.orangehrm-dashboard-widget', { hasText: 'Employees on Leave Today' });

    // ── Sidebar Navigation ──
    this.sidebar = page.locator('.oxd-sidepanel');
    this.searchInput = page.locator('.oxd-main-menu-search input');
    this.sidebarLink = (moduleName) =>
      page.locator('a.oxd-main-menu-item', { hasText: moduleName });

    // ── User Dropdown (Top Right) ──
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.userDropdownName = page.locator('.oxd-userdropdown-name');
    this.logoutLink = page.locator('a.oxd-userdropdown-link', { hasText: 'Logout' });
    this.aboutLink = page.locator('a.oxd-userdropdown-link', { hasText: 'About' });
    this.supportLink = page.locator('a.oxd-userdropdown-link', { hasText: 'Support' });
    this.changePasswordLink = page.locator('a.oxd-userdropdown-link', { hasText: 'Change Password' });

    // ── Sidebar Collapse Toggle ──
    this.sidebarToggle = page.locator('.oxd-main-menu-button');
  }

  // ── Page Load Verification ──
  async isLoaded() {
    await this.page.waitForURL('**/dashboard/index', { timeout: 40000 });
    await this.headerBreadcrumb.waitFor({ state: 'visible', timeout: 30000 });
    return true;
  }

  async getHeaderText() {
    return await this.headerBreadcrumb.textContent();
  }

  // ── Widget Methods ──
  async getWidgetsCount() {
    await this.page.waitForTimeout(1000);
    return await this.widgets.count();
  }

  async areWidgetsVisible() {
    const count = await this.getWidgetsCount();
    if (count === 0) return false;
    for (let i = 0; i < count; i++) {
      if (!(await this.widgets.nth(i).isVisible())) {
        return false;
      }
    }
    return true;
  }

  // ── Navigation Methods ──
  async navigateToModule(moduleName) {
    await this.sidebarLink(moduleName).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchModule(moduleName) {
    await this.searchInput.fill(moduleName);
  }

  async toggleSidebar() {
    await this.sidebarToggle.click();
  }

  // ── User Dropdown Methods ──
  async openUserDropdown() {
    await this.userDropdown.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async logout() {
    await this.openUserDropdown();
    await this.logoutLink.click();
    await this.page.waitForURL('**/auth/login');
  }

  async getLoggedInUserName() {
    return await this.userDropdownName.textContent();
  }

  async clickAbout() {
    await this.openUserDropdown();
    await this.aboutLink.click();
  }

  async clickChangePassword() {
    await this.openUserDropdown();
    await this.changePasswordLink.click();
    await this.page.waitForURL('**/updatePassword');
  }
}

module.exports = DashboardPage;
