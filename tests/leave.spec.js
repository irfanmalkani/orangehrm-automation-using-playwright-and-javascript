const { test, expect } = require('../fixtures/baseTest');
const testData = require('../test-data/testData.json');

function formatDate(date) {
  const yyyy = date.getFullYear();
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getTuesdayOfOffsetWeek(offsetWeeks) {
  const date = new Date();
  date.setDate(date.getDate() + 7 * offsetWeeks);
  const day = date.getDay();
  const daysToTuesday = (2 - day + 7) % 7;
  const finalDate = new Date(date.getTime() + daysToTuesday * 24 * 60 * 60 * 1000);
  return finalDate;
}

test.describe('OrangeHRM Leave Module', () => {
  let startDate, endDate;
  
  test.beforeAll(() => {
    const today = new Date();
    // Ensure unique but safe Tuesday/Wednesday date range in 2026/2027 to avoid overlaps and weekends
    const offsetWeeks = 2 + (today.getSeconds() + today.getMilliseconds()) % 40;
    const start = getTuesdayOfOffsetWeek(offsetWeeks);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    
    startDate = formatDate(start);
    endDate = formatDate(end);
    console.log(`[TEST SETUP] Generated unique dates: Start=${startDate}, End=${endDate}`);
  });
  
  test.beforeEach(async ({ loginPage, dashboardPage, leavePage }) => {
    await loginPage.navigate();
    const { username, password } = testData.loginCredentials.valid;
    await loginPage.login(username, password);
    await dashboardPage.isLoaded();
    await dashboardPage.navigateToModule('Leave');
    await leavePage.applyTab.waitFor({ state: 'visible', timeout: 25000 });
  });

  test('TC_LEAVE_01_03: Apply and verify leave request flow', async ({ leavePage }) => {
    console.log(`[TC_LEAVE] Applying leave for dates: ${startDate} to ${endDate}`);
    
    // Apply leave request (TC_LEAVE_01)
    await leavePage.applyLeave(startDate, endDate, testData.leaveDetails.comments);
    
    // Let's check for any immediate errors or toasts on the page
    const errors = await leavePage.page.evaluate(() => {
      const msgs = [];
      document.querySelectorAll('.oxd-input-group__message, .oxd-toast-content').forEach(el => {
        msgs.push(el.innerText.trim());
      });
      return msgs;
    });
    console.log('[TC_LEAVE] Errors or toasts visible on Apply page:', errors);
    
    // Verify status of applied leave (TC_LEAVE_02)
    const status = await leavePage.getLatestLeaveStatus(startDate, endDate);
    console.log('[TC_LEAVE] Latest leave status from table:', status);
    expect(status).not.toBeNull();
    expect(status.toLowerCase()).toContain('pending approval');
    
    // Verify details of applied leave (TC_LEAVE_03)
    const leaveType = await leavePage.getLatestLeaveType(startDate, endDate);
    console.log('[TC_LEAVE] Latest leave type from table:', leaveType);
    expect(leaveType).not.toBeNull();
  });
});
