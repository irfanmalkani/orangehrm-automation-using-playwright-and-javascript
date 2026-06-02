const { test: base } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const PIMPage = require('../pages/PIMPage');
const AdminPage = require('../pages/AdminPage');
const LeavePage = require('../pages/LeavePage');
const RecruitmentPage = require('../pages/RecruitmentPage');
const MyInfoPage = require('../pages/MyInfoPage');

// Extend basic test with custom fixtures
const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  pimPage: async ({ page }, use) => {
    await use(new PIMPage(page));
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },
  leavePage: async ({ page }, use) => {
    await use(new LeavePage(page));
  },
  recruitmentPage: async ({ page }, use) => {
    await use(new RecruitmentPage(page));
  },
  myInfoPage: async ({ page }, use) => {
    await use(new MyInfoPage(page));
  },
});

module.exports = {
  test,
  expect: base.expect,
};
