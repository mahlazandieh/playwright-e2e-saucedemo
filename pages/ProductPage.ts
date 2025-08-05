import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly sortDropdown: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async sortBy(optionValue: string) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getPrices(): Promise<number[]> {
    const prices = await this.productPrices.allInnerTexts();
    return prices.map((price) =>
      parseFloat(price.replace('$', '').trim())
    );
  }
}