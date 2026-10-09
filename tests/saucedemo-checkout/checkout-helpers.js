const { expect } = require('@playwright/test');

const baseURL = 'https://www.saucedemo.com';

async function signIn(page) {
  await page.goto(baseURL);
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html$/);
}

async function addItems(page, productIds = ['sauce-labs-backpack']) {
  for (const productId of productIds) {
    await page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }
}

async function openCart(page) {
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart\.html$/);
}

async function openCheckout(page, productIds = ['sauce-labs-backpack']) {
  await addItems(page, productIds);
  await openCart(page);
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/checkout-step-one\.html$/);
}

async function enterCheckoutInformation(page, firstName = 'Alex', lastName = 'QA', postalCode = '12345') {
  await page.locator('[data-test="firstName"]').fill(firstName);
  await page.locator('[data-test="lastName"]').fill(lastName);
  await page.locator('[data-test="postalCode"]').fill(postalCode);
}

async function captureFailure(page, testInfo) {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: testInfo.outputPath('failure.png'), fullPage: true });
  }
}

module.exports = {
  addItems,
  baseURL,
  captureFailure,
  enterCheckoutInformation,
  openCart,
  openCheckout,
  signIn,
};
