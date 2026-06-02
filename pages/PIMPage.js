const { expect } = require('@playwright/test');

class PIMPage {
  constructor(page) {
    this.page = page;
    
    // Top Navigation Tabs
    this.addEmployeeTab = page.locator('.oxd-topbar-body-nav-tab-item', { hasText: 'Add Employee' });
    this.employeeListTab = page.locator('.oxd-topbar-body-nav-tab-item', { hasText: 'Employee List' });
    
    // Add Employee Form
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.saveButton = page.locator('button[type="submit"]');
    
    // Employee Search Form
    this.searchEmployeeIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input').first();
    this.searchButton = page.locator('button', { hasText: 'Search' });
    this.resetButton = page.locator('button', { hasText: 'Reset' });
    
    // Search Results Table
    this.tableRows = page.locator('.oxd-table-card');
    this.firstRowId = page.locator('.oxd-table-card').first().locator('.oxd-table-cell:nth-child(2)');
    this.editButton = page.locator('.oxd-table-cell-actions button .bi-pencil-fill').first();
    this.deleteButton = page.locator('.oxd-table-cell-actions button .bi-trash').first();
    
    // Delete Confirmation Dialog
    this.confirmDeleteButton = page.locator('.oxd-button--label-danger');
    
    // Edit Details Form
    this.otherIdInput = page.locator('.oxd-input-group:has-text("Other Id") input');
    this.nickNameInput = page.locator('.oxd-input-group:has-text("Nickname") input');
  }

  async addEmployee(firstName, lastName, employeeId) {
    await this.addEmployeeTab.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    
    if (employeeId) {
      await this.employeeIdInput.click();
      // Clear auto-generated ID if present
      await this.employeeIdInput.press('Control+A');
      await this.employeeIdInput.press('Delete');
      await this.employeeIdInput.fill(employeeId);
    }
    
    await this.saveButton.click();
    // Wait for the personal details page to load
    await this.page.waitForSelector('.orangehrm-horizontal-padding', { timeout: 35000 });
  }

  async searchEmployee(employeeId) {
    await this.employeeListTab.click();
    await this.searchEmployeeIdInput.fill(employeeId);
    await this.searchButton.click();
  }

  async isEmployeeInResults(employeeId) {
    const rows = await this.tableRows.count();
    if (rows === 0) return false;
    const text = await this.firstRowId.textContent();
    return text.trim() === employeeId;
  }

  async updateEmployeeNickname(employeeId, nickName) {
    await this.searchEmployee(employeeId);
    await expect(this.firstRowId).toHaveText(employeeId, { timeout: 15000 });
    await this.editButton.click();
    await expect(this.employeeIdInput).toHaveValue(employeeId, { timeout: 15000 });
    const isNicknameVisible = await this.nickNameInput.isVisible();
    if (isNicknameVisible) {
      await this.nickNameInput.fill(nickName);
    } else {
      await this.otherIdInput.fill(nickName);
    }
    // Click the first save button (Personal Details Save)
    await this.saveButton.first().click();
    await this.page.locator('.oxd-toast').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return isNicknameVisible;
  }

  async deleteEmployee(employeeId) {
    await this.searchEmployee(employeeId);
    await expect(this.firstRowId).toHaveText(employeeId, { timeout: 15000 });
    await this.deleteButton.click();
    await this.confirmDeleteButton.click();
    await this.page.locator('.oxd-toast').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }
}

module.exports = PIMPage;
