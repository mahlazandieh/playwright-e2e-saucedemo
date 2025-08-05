import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartItems: Locator;
  readonly removeButtons: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartItems = page.locator('.cart_item');
    this.removeButtons = page.locator('[data-test^="remove-"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async removeItem(index: number = 0) {
    await this.removeButtons.nth(index).click();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartBadgeCount(): Promise<number> {
    const count = await this.cartBadge.innerText();
    return parseInt(count);
  }
}