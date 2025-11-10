// pages/BasePage.js
const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  // ---- BASIC ELEMENT ACTIONS ----
  async click(locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async enterText(locator, text, options = { clear: true }) {
    await locator.waitFor({ state: 'visible' });
    if (options.clear) await locator.fill('');
    await locator.fill(text);
  }

  async getText(locator) {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent();
  }

  // ---- DROPDOWNS ----
  async selectDropdownByValue(locator, value) {
    await locator.selectOption(value);
  }

  async selectDropdownByText(locator, text) {
    await locator.selectOption({ label: text });
  }

  async selectDropdownByIndex(locator, index) {
    const options = await locator.locator('option').all();
    await locator.selectOption(await options[index].getAttribute('value'));
  }

  // ---- RADIO BUTTON ----
  async selectRadioByValue(radioGroupLocator, value) {
    const radio = radioGroupLocator.locator(`input[value="${value}"]`);
    await this.click(radio);
  }

  // ---- MULTISELECT PICKLIST ----
  async selectMultipleOptions(locator, values = []) {
    await locator.selectOption(values);
  }

  // ---- HANDLE AUTOSUGGESTIONS ----
  async handleAutoSuggestion(inputLocator, suggestionListLocator, textToType, optionText) {
    await this.enterText(inputLocator, textToType);
    await this.page.waitForTimeout(500);
    const options = await suggestionListLocator.allInnerTexts();
    const match = options.find(opt => opt.includes(optionText));
    if (match) {
      await this.page.locator(`text=${optionText}`).click();
    }
  }

  // ---- HANDLE WINDOWS / POPUPS / TABS ----
  async handleNewWindow(actionCallback) {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      actionCallback(), // action that opens new window
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  async switchToTab(index = 1) {
    const pages = this.page.context().pages();
    if (pages[index]) {
      this.page = pages[index];
      await this.page.bringToFront();
    } else {
      throw new Error(`No tab found at index ${index}`);
    }
  }

  async closeCurrentTab() {
    await this.page.close();
  }

  // ---- HANDLE POPUPS / ALERTS ----
  async handlePopup(actionCallback, accept = true) {
    this.page.once('dialog', async dialog => {
      if (accept) await dialog.accept();
      else await dialog.dismiss();
    });
    await actionCallback();
  }

  // ---- ASSERTIONS / VALIDATION ----
  async verifyText(locator, expectedText) {
    await expect(locator).toHaveText(expectedText);
  }
}

module.exports = { BasePage };
