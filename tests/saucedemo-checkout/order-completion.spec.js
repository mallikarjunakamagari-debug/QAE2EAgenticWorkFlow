const { expect, test } = require('@playwright/test');
const {
  captureFailure,
  enterCheckoutInformation,
  openCheckout,
  signIn,
} = require('./checkout-helpers');

test.describe('SauceDemo order completion', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await openCheckout(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);
    await enterCheckoutInformation(page);
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await captureFailure(page, testInfo);
  });

  test('confirms the order, clears the cart, and returns home', async ({ page }) => {
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/checkout-complete\.html$/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back Home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();

    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html$/);
  });
});
