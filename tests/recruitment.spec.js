const { test, expect } = require('../fixtures/baseTest');
const testData = require('../test-data/testData.json');

test.describe.serial('OrangeHRM Recruitment Module', () => {
  const uniqueId = Math.floor(1000 + Math.random() * 9000);
  const candidateFirstName = `Sophia${uniqueId}`;
  const candidateLastName = `Miller${uniqueId}`;
  const candidateFullName = `${candidateFirstName} ${candidateLastName}`;
  const candidateEmail = `sophia.${uniqueId}@example.com`;
  
  test.beforeEach(async ({ loginPage, dashboardPage, recruitmentPage }) => {
    await loginPage.navigate();
    const { username, password } = testData.loginCredentials.valid;
    await loginPage.login(username, password);
    await dashboardPage.isLoaded();
    await dashboardPage.navigateToModule('Recruitment');
    await recruitmentPage.addButton.waitFor({ state: 'visible', timeout: 25000 });
  });

  test('TC_REC_01: Add candidate details', async ({ recruitmentPage }) => {
    const { contactNumber } = testData.candidateDetails;
    await recruitmentPage.addCandidate(candidateFirstName, candidateLastName, candidateEmail, contactNumber, null);
    await expect(recruitmentPage.page.locator('h6:has-text("Application Stage"), h6:has-text("Candidate Profile")').first()).toBeVisible({ timeout: 30000 });
  });

  test('TC_REC_02: Search candidate records', async ({ recruitmentPage }) => {
    await recruitmentPage.searchCandidate(candidateFirstName);
    const exists = await recruitmentPage.isCandidateInResults(candidateFullName);
    expect(exists).toBe(true);
  });

  test('TC_REC_03: Verify Recruitment page has Add button visible', async ({ recruitmentPage }) => {
    await expect(recruitmentPage.addButton).toBeVisible();
  });

  test('TC_REC_04: Verify Candidates tab is functional', async ({ recruitmentPage }) => {
    await recruitmentPage.candidatesTab.click();
    await recruitmentPage.page.waitForTimeout(1500);
    await expect(recruitmentPage.searchButton).toBeVisible();
  });
});
