class LeavePage {
  constructor(page) {
    this.page = page;
    
    // Top Tabs
    this.applyTab = page.locator('.oxd-topbar-body-nav-tab-item', { hasText: 'Apply' });
    this.myLeaveTab = page.locator('.oxd-topbar-body-nav-tab-item', { hasText: 'My Leave' });
    
    // Apply Form
    this.leaveTypeDropdown = page.locator('.oxd-input-group:has-text("Leave Type") .oxd-select-text');
    this.fromDateInput = page.locator('.oxd-input-group:has-text("From Date") input');
    this.toDateInput = page.locator('.oxd-input-group:has-text("To Date") input');
    this.commentsTextarea = page.locator('.oxd-input-group:has-text("Comments") textarea');
    this.applyButton = page.locator('button[type="submit"]');
    
    // Dropdown option selection
    this.dropdownOption = page.locator('.oxd-select-option');
    
    // My Leave Table
    this.tableRows = page.locator('.oxd-table-card');
    this.firstRowLeaveType = page.locator('.oxd-table-card').first().locator('.oxd-table-cell:nth-child(4)');
    this.firstRowStatus = page.locator('.oxd-table-card').first().locator('.oxd-table-cell:nth-child(7)');
  }

  async applyLeave(startDate, endDate, comments) {
    await this.applyTab.click();
    
    // Click Leave Type and select the first available option that is not "-- Select --"
    await this.leaveTypeDropdown.click();
    await this.dropdownOption.nth(1).click();
    
    // From Date
    await this.fromDateInput.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.fromDateInput.fill(startDate);
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(500);

    // To Date
    await this.toDateInput.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.toDateInput.fill(endDate);
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(500);
    
    if (comments) {
      await this.commentsTextarea.fill(comments);
    }
    
    // Click outside to close any calendar widget
    await this.page.click('h6:has-text("Apply Leave")');
    
    await this.applyButton.click();
    await this.page.waitForTimeout(3000);
  }

  async waitForSpinner() {
    const spinner = this.page.locator('.oxd-loading-spinner-container');
    try {
      await spinner.waitFor({ state: 'visible', timeout: 1500 });
      await spinner.waitFor({ state: 'detached', timeout: 15000 });
    } catch (e) {
      // Already detached or didn't appear
    }
  }

  async getLatestLeaveStatus(startDate, endDate) {
    if (!this.page.url().includes('viewMyLeaveList')) {
      await this.myLeaveTab.waitFor({ state: 'visible', timeout: 20000 });
      await this.myLeaveTab.click();
      await this.page.waitForSelector('.oxd-table-filter', { state: 'visible', timeout: 25000 });
      
      // Clear and fill date filters
      await this.fromDateInput.click();
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.press('Backspace');
      await this.fromDateInput.fill(startDate || '2026-01-01');
      
      await this.toDateInput.click();
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.press('Backspace');
      await this.toDateInput.fill(endDate || '2027-12-31');
      
      // Click Search button
      await this.page.locator('button[type="submit"]').click();
      await this.waitForSpinner();
    }
    
    const count = await this.tableRows.count();
    if (count === 0) {
      console.log(`[DEBUG] No rows found. URL: ${this.page.url()}`);
      const bodyText = await this.page.locator('body').innerText();
      console.log(`[DEBUG] Body Text:`, bodyText.substring(0, 1200));
      return null;
    }
    const text = await this.firstRowStatus.textContent();
    return text.trim();
  }

  async getLatestLeaveType(startDate, endDate) {
    if (!this.page.url().includes('viewMyLeaveList')) {
      await this.myLeaveTab.waitFor({ state: 'visible', timeout: 20000 });
      await this.myLeaveTab.click();
      await this.page.waitForSelector('.oxd-table-filter', { state: 'visible', timeout: 25000 });
      
      // Clear and fill date filters
      await this.fromDateInput.click();
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.press('Backspace');
      await this.fromDateInput.fill(startDate || '2026-01-01');
      
      await this.toDateInput.click();
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.press('Backspace');
      await this.toDateInput.fill(endDate || '2027-12-31');
      
      // Click Search button
      await this.page.locator('button[type="submit"]').click();
      await this.waitForSpinner();
    }
    
    const count = await this.tableRows.count();
    if (count === 0) return null;
    const text = await this.firstRowLeaveType.textContent();
    return text.trim();
  }
}

module.exports = LeavePage;
