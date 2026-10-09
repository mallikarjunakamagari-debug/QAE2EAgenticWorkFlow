const { expect, test } = require('@playwright/test');
const {
  captureFailure,
  enterCheckoutInformation,
  openCheckout,
  signIn,
} = require('./checkout-helpers');

test.describe('SauceDemo checkout overview', () => {
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

  test('shows the items, payment, shipping, subtotal, tax, and total', async ({ page }) => {
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('SauceCard #31337')).toBeVisible();
    await expect(page.getByText('Free Pony Express Delivery!')).toBeVisible();
    await expect(page.getByText('Item total: $39.98')).toBeVisible();
    await expect(page.getByText('Tax: $3.20')).toBeVisible();
    await expect(page.getByText('Total: $43.18')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
  });

  test('returns to the cart when checkout is cancelled from the overview', async ({ page }) => {
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  });

  test('browser Back from overview returns to checkout information', async ({ page }) => {
    await page.goBack();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, 2 items' })).toBeVisible();
  });
});
