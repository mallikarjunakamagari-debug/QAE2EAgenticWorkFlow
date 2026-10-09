const { expect, test } = require('@playwright/test');
const {
  captureFailure,
  enterCheckoutInformation,
  openCart,
  signIn,
} = require('./checkout-helpers');

test.describe('SauceDemo mobile checkout', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await captureFailure(page, testInfo);
  });

  test('keeps checkout information and overview usable at mobile width', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await openCart(page);
    await page.locator('[data-test="checkout"]').click();

    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Zip/Postal Code' })).toBeVisible();
    await enterCheckoutInformation(page, 'Mobile', 'Tester', '90210');
    await page.locator('[data-test="continue"]').click();

    await expect(page.getByText('Total: $32.39')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
