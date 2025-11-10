// tests/specs/login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { testData } = require('../data/dataManager');
const config = require('../../config/config');

test.describe('Login Tests', () => {
  test('Successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate using baseURL + relative URL
    await page.goto(config.urls.base + testData.urls.login);

    // Perform login
    await loginPage.login(
      testData.login.validUser.username,
      testData.login.validUser.password
    );

    // Verify login success
    await loginPage.verifySuccessfulLogin();
  });

  test('Invalid login with wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(config.urls.base + testData.urls.login);

    await loginPage.login(
      testData.login.invalidUser.username,
      testData.login.invalidUser.password
    );

    // Verify error message
    await loginPage.verifyInvalidLogin();
  });
});
