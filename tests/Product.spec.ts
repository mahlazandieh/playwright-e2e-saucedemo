import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';

test.describe('Product Sorting Tests', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
  
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  
    await expect(page).toHaveURL(/.*inventory.html/);
    await productPage.sortDropdown.waitFor({ state: 'visible', timeout: 10000 });
  });

  test('Sort by Price: low to high', async () => {
    await productPage.sortBy('lohi');
    const prices = await productPage.getPrices();

    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('Sort by Price: high to low', async () => {
    await productPage.sortBy('hilo');
    const prices = await productPage.getPrices();

    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });
});
