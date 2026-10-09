const { test, expect } = require('@playwright/test');

test.describe('SauceDemo checkout', () => {
  test('completes a purchase and returns home', async ({ page }) => {
    // Navigate to the SauceDemo application.
    await page.goto('https://www.saucedemo.com');

    // Sign in using the standard checkout test account.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html$/);

    // Add the Backpack and open the cart.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html$/);

    // Proceed to checkout information and enter valid customer details.
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await page.locator('[data-test="firstName"]').fill('Alex');
    await page.locator('[data-test="lastName"]').fill('QA');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    // Verify the order overview amounts.
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
    await expect(page.getByText('Item total: $29.99')).toBeVisible();
    await expect(page.getByText('Tax: $2.40')).toBeVisible();
    await expect(page.getByText('Total: $32.39')).toBeVisible();

    // Finish the order and verify confirmation and cart clearing.
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/checkout-complete\.html$/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cart, empty' })).toBeVisible();

    // Return to the products page.
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html$/);
  });
});