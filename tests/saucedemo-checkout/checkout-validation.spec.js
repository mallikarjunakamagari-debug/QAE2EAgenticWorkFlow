const { expect, test } = require('@playwright/test');
const {
  captureFailure,
  enterCheckoutInformation,
  openCheckout,
  signIn,
} = require('./checkout-helpers');

test.describe('SauceDemo checkout information validation', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await openCheckout(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await captureFailure(page, testInfo);
  });

  test('identifies First Name as required when all fields are blank', async ({ page }) => {
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByRole('alert')).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  test('identifies Last Name as required', async ({ page }) => {
    await enterCheckoutInformation(page, 'Alex', '', '12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByRole('alert')).toContainText('Last Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  test('identifies Zip/Postal Code as required', async ({ page }) => {
    await enterCheckoutInformation(page, 'Alex', 'QA', '');
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByRole('alert')).toContainText('Postal Code is required');
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  test('rejects special characters in customer information', async ({ page }) => {
    await enterCheckoutInformation(page, '!@#', 'QA', '12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await expect(page.getByRole('alert')).toBeVisible();
  });
});
