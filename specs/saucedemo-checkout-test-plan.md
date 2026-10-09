# SCRUM-101 E-commerce Checkout Test Plan

## Application Overview

Validate SauceDemo checkout against the requirements in user-stories/ecommerce-checkout.md using standard_user/secret_sauce. Exploration confirmed login and order submission work, checkout subtotal/tax/total are displayed on the overview, the cart does not display a calculated total, the overview Cancel action returns to inventory (not cart), and special characters in First Name are accepted. These requirement mismatches should be verified and recorded as defects, not weakened in assertions.

## Test Scenarios

### 1. SauceDemo checkout

**Seed:** `tests/seed.spec.ts`

#### 1.1. should show cart details and checkout actions for selected products

**File:** `tests/saucedemo-checkout/cart-review.spec.js`

**Steps:**
  1. Log in as standard_user and add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99).
    - expect: Each selected item appears in the cart with quantity 1, description and price.
  2. Open the cart.
    - expect: Continue Shopping and Checkout actions are available.
    - expect: Acceptance criterion also expects a cart total calculation; report failure if it is absent (observed absent during planning).

#### 1.2. should reject empty first name

**File:** `tests/saucedemo-checkout/checkout-validation.spec.js`

**Steps:**
  1. Log in, add an item, open cart, select Checkout, and leave all fields blank.
    - expect: Checkout information form contains First Name, Last Name and Zip/Postal Code.
  2. Select Continue.
    - expect: Remain on checkout information and show an error identifying First Name as required.

#### 1.3. should reject empty last name

**File:** `tests/saucedemo-checkout/checkout-validation.spec.js`

**Steps:**
  1. Enter a first name and postal code, leave Last Name blank, then select Continue.
    - expect: Remain on checkout information and show an error identifying Last Name as required.

#### 1.4. should reject empty postal code

**File:** `tests/saucedemo-checkout/checkout-validation.spec.js`

**Steps:**
  1. Enter first and last names, leave Zip/Postal Code blank, then select Continue.
    - expect: Remain on checkout information and show an error identifying Zip/Postal Code as required.

#### 1.5. should prevent invalid special-character customer data

**File:** `tests/saucedemo-checkout/checkout-validation.spec.js`

**Steps:**
  1. Enter !@# as First Name, a valid Last Name and postal code, and select Continue.
    - expect: Invalid special characters are rejected with a useful validation message and the user cannot proceed (AC5).

#### 1.6. should show order details and correct totals in overview

**File:** `tests/saucedemo-checkout/checkout-overview.spec.js`

**Steps:**
  1. Complete checkout information with Alex, QA, 12345.
    - expect: Navigate to checkout overview and show all cart items, payment information and shipping information.
  2. Verify calculated amounts for backpack and bike light.
    - expect: Item total is $39.98, tax is $3.20, and total is $43.18.
  3. Check Cancel behavior from overview.
    - expect: According to business rules cancellation returns to cart and preserves items; report actual destination if it differs (planning observed inventory).

#### 1.7. should complete order and clear cart

**File:** `tests/saucedemo-checkout/order-completion.spec.js`

**Steps:**
  1. Complete checkout with valid details and select Finish.
    - expect: Navigate to confirmation with Thank you for your order! and Back Home.
    - expect: Cart is empty after completion.
  2. Select Back Home.
    - expect: Return to products page.

#### 1.8. should not allow checkout when cart is empty

**File:** `tests/saucedemo-checkout/checkout-guard.spec.js`

**Steps:**
  1. Log in with an empty cart, navigate to the cart, then attempt Checkout or directly open checkout information.
    - expect: Checkout is unavailable or the application safely redirects/prevents progression; no order can be created without items.

#### 1.9. should prevent checkout while logged out

**File:** `tests/saucedemo-checkout/checkout-guard.spec.js`

**Steps:**
  1. Log out, then navigate directly to checkout information URL.
    - expect: Unauthenticated user is redirected to login and cannot access checkout.

#### 1.10. should remain usable on mobile viewport

**File:** `tests/saucedemo-checkout/mobile-checkout.spec.js`

**Steps:**
  1. Set a mobile viewport (390x844), log in, add an item and progress through checkout information and overview.
    - expect: Checkout form, cart, order totals and primary actions remain visible and usable without horizontal overflow or inaccessible controls.
