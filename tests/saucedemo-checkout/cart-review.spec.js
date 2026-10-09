const { expect, test } = require('@playwright/test');
const { addItems, captureFailure, openCart, signIn } = require('./checkout-helpers');

test.describe('SauceDemo cart review', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await captureFailure(page, testInfo);
  });

  test('shows selected item details, total calculation, and cart actions', async ({ page }) => {
    await addItems(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);
    await openCart(page);

    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
    await expect(page.getByText('$39.98')).toBeVisible();
  });
});
