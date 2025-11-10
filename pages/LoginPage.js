const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#submit');
    this.successMessage = page.locator('h1:has-text("Logged In Successfully")');
    this.errorMessage = page.locator('#error');
  }

  async open() {
    await this.page.goto('/practice-test-login/', { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('#username');
  }

  /**
   * Context-aware login: handles both valid and invalid credentials
   */
  async login(username, password) {
    await this.enterText(this.usernameInput, username);
    await this.enterText(this.passwordInput, password);
    await this.click(this.loginButton);

    // If valid creds, expect success redirect or message
    if (username === 'student' && password === 'Password123') {
      await Promise.race([
        this.page.waitForURL(/.*logged-in-successfully/, { timeout: 10000 }),
        this.successMessage.waitFor({ state: 'visible', timeout: 10000 }),
      ]);
    } 
    // If invalid creds, expect error message
    else {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
    }
  }

  async verifySuccessfulLogin() {
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
    await expect(this.page).toHaveURL(/.*logged-in-successfully/);
  }

  async verifyInvalidLogin() {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    await expect(this.errorMessage).toHaveText(/Your username is invalid!/i);
  }
}

module.exports = { LoginPage };
