const { test, expect } = require('@playwright/test');

test.describe('SCRUM-101: SauceDemo Checkout', () => {
  test('Successful Checkout Order Completion', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com and verify the login page is shown.
    await page.goto('https://www.saucedemo.com');
    await expect(page.getByRole('form', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();

    // 2. Sign in with standard_user / secret_sauce and verify the inventory page appears.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();

    // 3. Add the first product to the cart and verify the cart badge shows one item.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();

    // 4. Open the cart and verify the selected product is listed.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Backpack' })).toBeVisible();

    // 5. Proceed to checkout and enter first name, last name, and postal code.
    await page.locator('[data-test="checkout"]').click();
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();
    await page.locator('[data-test="firstName"]').fill('Ada');
    await page.locator('[data-test="lastName"]').fill('Lovelace');
    await page.locator('[data-test="postalCode"]').fill('10001');

    // 6. Continue to order overview and verify checkout summary is shown.
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    await expect(page.getByText('Total: $32.39', { exact: true })).toBeVisible();

    // 7. Finish checkout and verify the order completion confirmation appears.
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  });
});
