import { test, expect } from '@playwright/test';

test.describe('Checkout Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to SauceDemo and verify the login page is shown.
    await page.goto('https://www.saucedemo.com');
    await expect(page.getByRole('form', { name: 'Login' })).toBeVisible();

    // 2. Log in with standard_user / secret_sauce.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test.afterEach(async ({ page }) => {
    const menuButton = page.getByRole('button', { name: 'Open Menu' });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.locator('[data-test="logout-sidebar-link"]').click();
    }
  });

  test('Continue Shopping returns to inventory and preserves the cart item', async ({ page }) => {
    // 3. Add the Sauce Labs Backpack to the cart.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // 4. Open the cart and verify the backpack and one-item badge.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();

    // 5. Continue shopping and verify inventory and the one-item badge remain visible.
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();
  });

  test('Checkout information Cancel returns to cart with item preserved', async ({ page }) => {
    // 3. Add Sauce Labs Backpack to the cart and open the cart.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    // 4. Click Checkout and verify checkout information is shown.
    await page.locator('[data-test="checkout"]').click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

    // 5. Click Cancel and verify the cart item and one-item badge remain.
    await page.locator('[data-test="cancel"]').click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();
  });

  test('Browser Back from checkout information returns to cart with item preserved', async ({ page }) => {
    // 3. Add Sauce Labs Backpack to the cart and open the cart.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    // 4. Click Checkout and verify checkout information is shown.
    await page.locator('[data-test="checkout"]').click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

    // 5. Use browser Back and verify the cart item and one-item badge remain.
    await page.goBack();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();
  });
});
