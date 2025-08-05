import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ProductPage } from '../pages/ProductPage';

test.describe('Cart & Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('TC01 - Add two items to cart and check badge', async ({ page }) => {
    const cartPage = new CartPage(page);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await expect(cartPage.cartBadge).toBeVisible();
    await expect(cartPage.cartBadge).toHaveText('2');
  });

  test('TC02 - Remove one item from cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await cartPage.goToCart();
    await cartPage.removeItem(0);

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });

  test('TC03 - Fill out checkout form', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await cartPage.goToCart();

    await page.locator('[data-test="checkout"]').click();
    await checkoutPage.fillCheckoutForm('Mahla', 'Zandieh', '12345');

    await expect(page).toHaveURL(/checkout-step-two/);
  });

  test('TC04 - Validate subtotal matches item prices', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const prices = [29.99, 9.99];

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await cartPage.goToCart();
    await page.locator('[data-test="checkout"]').click();
    await checkoutPage.fillCheckoutForm('Mahla', 'Zandieh', '12345');

    const displayedSubtotal = await checkoutPage.getSubtotal();
    const expectedSubtotal = prices.reduce((a, b) => a + b, 0);

    expect(displayedSubtotal).toBeCloseTo(expectedSubtotal, 2);
  });

  test('TC05 - Show final thank you message after finishing order', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await cartPage.goToCart();
    await page.locator('[data-test="checkout"]').click();
    await checkoutPage.fillCheckoutForm('Mahla', 'Zandieh', '12345');

    await checkoutPage.completeOrder();
    const message = await checkoutPage.getThankYouMessage();

    expect(message).toContain('Thank you for your order');
  });

  test('TC06 - Show error messages for empty checkout form', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await cartPage.goToCart();
    await page.locator('[data-test="checkout"]').click();

    await checkoutPage.continueButton.click();
    await expect(checkoutPage.errorMessages).toBeVisible();
    await expect(checkoutPage.errorMessages).toHaveText('Error: First Name is required');
  });
});