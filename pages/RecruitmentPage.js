const { expect } = require('@playwright/test');

class RecruitmentPage {
  constructor(page) {
    this.page = page;
    
    // Top Tabs/Headers
    this.candidatesTab = page.locator('.oxd-topbar-body-nav-tab-item', { hasText: 'Candidates' });
    
    // Search Form
    this.searchCandidateNameInput = page.locator('.oxd-input-group:has-text("Candidate Name") input');
    this.searchButton = page.locator('button[type="submit"]');
    
    // Results Table
    this.tableRows = page.locator('.oxd-table-card');
    this.firstRowCandidateName = page.locator('.oxd-table-card .oxd-table-cell:nth-child(3)');
    
    // Add Candidate Form
    this.addButton = page.locator('button:has-text("Add")');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('.oxd-input-group:has-text("Email") input');
    this.contactInput = page.locator('.oxd-input-group:has-text("Contact Number") input');
    this.resumeInput = page.locator('input[type="file"]');
    this.saveButton = page.locator('button[type="submit"]');
    
    // Autocomplete dropdown option
    this.autocompleteOption = page.locator('.oxd-autocomplete-option');
  }

  async addCandidate(firstName, lastName, email, contactNumber, resumePath) {
    await this.addButton.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    
    if (contactNumber) {
      await this.contactInput.fill(contactNumber);
    }
    
    if (resumePath) {
      await this.resumeInput.setInputFiles(resumePath);
    }
    
    await this.saveButton.click();
    await this.page.waitForTimeout(3000);
  }

  async searchCandidate(candidateName) {
    await this.candidatesTab.click();
    await this.searchCandidateNameInput.fill(candidateName);
    
    // Wait for the autocomplete option containing the name and select it
    const option = this.autocompleteOption.filter({ hasText: candidateName }).first();
    await option.waitFor({ state: 'visible', timeout: 20000 });
    await option.click();
    
    await this.searchButton.click();
    await this.page.waitForTimeout(2000);
  }

  async isCandidateInResults(candidateName) {
    try {
      await expect(this.firstRowCandidateName).toContainText(candidateName, { timeout: 15000 });
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = RecruitmentPage;
