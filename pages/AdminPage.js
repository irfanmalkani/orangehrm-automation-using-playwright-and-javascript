const { expect } = require('@playwright/test');

class AdminPage {
  constructor(page) {
    this.page = page;
    
    // Search Form
    this.searchUsernameInput = page.locator('.oxd-input-group:has-text("Username") input').first();
    this.searchButton = page.locator('button[type="submit"]');
    
    // Results Table
    this.tableRows = page.locator('.oxd-table-card');
    this.firstRowUsername = page.locator('.oxd-table-card').first().locator('.oxd-table-cell:nth-child(2)');
    this.firstRowRole = page.locator('.oxd-table-card').first().locator('.oxd-table-cell:nth-child(3)');
    this.editButton = page.locator('.oxd-table-cell-actions button .bi-pencil-fill').first();
    this.deleteButton = page.locator('.oxd-table-cell-actions button .bi-trash').first();
    this.confirmDeleteButton = page.locator('.oxd-button--label-danger');
    
    // Add User Page
    this.addButton = page.locator('button:has-text("Add")');
    this.userRoleDropdown = page.locator('.oxd-input-group:has-text("User Role") .oxd-select-text');
    this.statusDropdown = page.locator('.oxd-input-group:has-text("Status") .oxd-select-text');
    this.employeeNameInput = page.locator('.oxd-input-group:has-text("Employee Name") input');
    this.usernameInput = page.locator('.oxd-input-group:has-text("Username") input').last();
    this.passwordInput = page.locator('.oxd-input-group:has-text("Password") input').first();
    this.confirmPasswordInput = page.locator('.oxd-input-group:has-text("Confirm Password") input');
    this.saveButton = page.locator('button[type="submit"]');
    
    // Autocomplete dropdown option
    this.autocompleteDropdown = page.locator('.oxd-autocomplete-dropdown');
    this.autocompleteOption = page.locator('.oxd-autocomplete-option');
    this.selectOption = (optionText) => page.locator('.oxd-select-option', { hasText: optionText });
  }

  async searchUser(username) {
    await this.searchUsernameInput.fill(username);
    await this.searchButton.click();
  }

  async isUserInResults(username) {
    const count = await this.tableRows.count();
    if (count === 0) return false;
    const text = await this.firstRowUsername.textContent();
    return text.trim() === username;
  }

  async addUser(userRole, employeeName, username, password) {
    await this.addButton.click();
    
    // Select User Role
    await this.userRoleDropdown.click();
    await this.selectOption(userRole).click();
    
    // Select Status (Enabled)
    await this.statusDropdown.click();
    await this.selectOption('Enabled').click();
    
    // Enter Employee Name
    await this.employeeNameInput.fill(employeeName);
    
    // Wait for autocomplete options to load and ensure "Searching...." is gone
    const option = this.autocompleteOption.first();
    await expect(option).toBeVisible({ timeout: 10000 });
    await expect(option).not.toHaveText('Searching....', { timeout: 10000 });
    await option.click();
    
    // Enter Username
    await this.usernameInput.fill(username);
    
    // Enter Passwords
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    
    await this.saveButton.click();
    await this.page.waitForURL('**/admin/viewSystemUsers', { timeout: 30000 });
  }

  async updateUserRole(username, newUserRole) {
    await this.searchUser(username);
    await expect(this.firstRowUsername).toHaveText(username, { timeout: 15000 });
    await this.editButton.click();
    await expect(this.usernameInput).toHaveValue(username, { timeout: 15000 });
    
    await this.userRoleDropdown.click();
    await this.selectOption(newUserRole).click();
    
    await this.saveButton.click();
    await this.page.waitForURL('**/admin/viewSystemUsers', { timeout: 30000 });
  }

  async deleteUser(username) {
    await this.searchUser(username);
    await expect(this.firstRowUsername).toHaveText(username, { timeout: 15000 });
    await this.deleteButton.click();
    await this.confirmDeleteButton.click();
    await expect(this.page.locator('.oxd-toast')).toBeVisible();
  }
}

module.exports = AdminPage;
