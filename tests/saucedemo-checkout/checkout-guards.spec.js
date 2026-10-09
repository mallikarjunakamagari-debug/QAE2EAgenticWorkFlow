const { expect, test } = require('@playwright/test');
const { captureFailure, openCart, signIn } = require('./checkout-helpers');

test.describe('SauceDemo checkout access rules', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await captureFailure(page, testInfo);
  });

  test('prevents checkout when the cart is empty', async ({ page }) => {
    await openCart(page);
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/cart\.html$/);
  });

  test('redirects unauthenticated users away from checkout', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('alert')).toContainText('You can only access');
  });
});
