const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LoginPage } = require('../../../pages/LoginPage');
const { testData } = require('../../data/dataManager');
const config = require('../../../config/config');

let page;
let loginPage;

Given('I navigate to the login page', async function () {
  page = this.page; // Playwright page context injected by Cucumber
  loginPage = new LoginPage(page);
  await page.goto(config.urls.base + testData.urls.login);
});

When('I log in with valid credentials', async function () {
  await loginPage.login(
    testData.login.validUser.username,
    testData.login.validUser.password
  );
});

When('I log in with invalid credentials', async function () {
  await loginPage.login(
    testData.login.invalidUser.username,
    testData.login.invalidUser.password
  );
});

Then('I should be logged in successfully', async function () {
  await loginPage.verifySuccessfulLogin();
});

Then('I should see an invalid login error', async function () {
  await loginPage.verifyInvalidLogin();
});
