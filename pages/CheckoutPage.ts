import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly subtotalLabel: Locator;
  readonly finishButton: Locator;
  readonly thankYouMessage: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.thankYouMessage = page.locator('.complete-header');
    this.errorMessages = page.locator('[data-test="error"]');
  }

  async fillCheckoutForm(first: string, last: string, zip: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
    await this.continueButton.click();
  }

  async getSubtotal(): Promise<number> {
    const subtotalText = await this.subtotalLabel.textContent();
    const match = subtotalText?.match(/\$([0-9]+\.[0-9]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async completeOrder() {
    await this.finishButton.click();
  }

  async getThankYouMessage(): Promise<string | null> {
    return await this.thankYouMessage.textContent();
  }
}