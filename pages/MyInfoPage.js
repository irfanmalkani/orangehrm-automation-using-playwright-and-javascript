class MyInfoPage {
  constructor(page) {
    this.page = page;
    
    // Personal Details section elements
    this.firstNameInput = page.locator('input.orangehrm-firstname');
    this.nickNameInput = page.locator('.oxd-input-group:has-text("Nickname") input');
    this.otherIdInput = page.locator('.oxd-input-group:has-text("Other Id") input');
    this.savePersonalDetailsButton = page.locator('button[type="submit"]').first();
    
    // Profile Image elements
    this.profileImageContainer = page.locator('.orangehrm-edit-employee-image');
    this.fileInput = page.locator('input[type="file"]');
    this.saveImageButton = page.locator('button[type="submit"]');
  }

  async updatePersonalDetails(nickname, otherId) {
    const isNicknameVisible = await this.nickNameInput.isVisible();
    if (isNicknameVisible && nickname) {
      await this.nickNameInput.fill(nickname);
    }
    
    if (otherId) {
      await this.otherIdInput.waitFor({ state: 'visible' });
      await this.otherIdInput.fill(otherId);
    }
    
    await this.savePersonalDetailsButton.click();
    await this.page.waitForTimeout(3000);
  }

  async uploadProfileImage(filePath) {
    await this.profileImageContainer.click();
    await this.fileInput.waitFor({ state: 'attached' });
    await this.fileInput.setInputFiles(filePath);
    await this.saveImageButton.click();
    await this.page.waitForTimeout(3000);
  }

  async getNicknameValue() {
    const isNicknameVisible = await this.nickNameInput.isVisible();
    if (isNicknameVisible) {
      return await this.nickNameInput.inputValue();
    }
    return await this.otherIdInput.inputValue();
  }
}

module.exports = MyInfoPage;
