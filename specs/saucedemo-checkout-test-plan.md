# Sauce Demo Checkout Test Plan — SCRUM-101

## Application Overview

Validate the end-to-end checkout journey for SCRUM-101 using a fresh browser state per scenario and the standard_user / secret_sauce account. Cover cart contents and arithmetic, mandatory checkout information and invalid input, order overview, completion and cart clearing, checkout guards/cancellation/back navigation, and mobile layout at 390x844. Acceptance criteria remain authoritative. Known live observations that violate them are explicitly identified as expected failures for defect validation; they must not be treated as passing or used to weaken assertions.

## Test Scenarios

### 1. cart-review.spec.js — Cart Review

**Seed:** `tests/seed.spec.ts`

#### 1.1. Cart shows each selected item's description, price, quantity, total, and actions

**File:** `cart-review.spec.js`

**Steps:**
  1. Starting from a fresh browser state, log in as standard_user / secret_sauce. Add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99), then open the cart.
    - expect: The cart displays both selected item names and their descriptions, each unit price, and quantity 1.
    - expect: The cart displays a total calculation for the contents: $39.98 for one of each item.
    - expect: Continue Shopping and Checkout are both present and enabled.
    - expect: DEFECT VALIDATION: the live cart was observed without a cart total. The test must assert that the total is shown; record this as a failure if still absent, not as an accepted behavior.
  2. From a fresh logged-in state, add the Backpack and Bike Light, open the cart, and select Continue Shopping.
    - expect: The inventory page opens.
    - expect: The cart retains the two selected items and the cart badge reflects 2 items.
  3. From a fresh logged-in state, add the Backpack and Bike Light, open the cart, and select Checkout, then select Cancel on the checkout information page.
    - expect: Cancel returns to the cart page, not the inventory page.
    - expect: Both cart items remain in the cart.

### 2. checkout-validation.spec.js — Checkout Information Validation

**Seed:** `tests/seed.spec.ts`

#### 2.1. Each required field produces its own field-specific error when empty

**File:** `checkout-validation.spec.js`

**Steps:**
  1. Starting from a fresh browser state, log in as standard_user / secret_sauce, add one item, open the cart, select Checkout, and select Continue with all fields empty.
    - expect: Checkout does not proceed to the overview.
    - expect: A visible error identifies First Name as required.
  2. Dismiss the error, enter a First Name and Zip/Postal Code, leave Last Name empty, and select Continue.
    - expect: Checkout does not proceed.
    - expect: A visible error identifies Last Name as required.
  3. Dismiss the error, enter First Name and Last Name, leave Zip/Postal Code empty, and select Continue.
    - expect: Checkout does not proceed.
    - expect: A visible error identifies Postal Code as required.

#### 2.2. Valid customer information advances to the order overview

**File:** `checkout-validation.spec.js`

**Steps:**
  1. Starting from a fresh browser state, log in, add the Backpack and Bike Light, open Checkout, enter First Name Ada, Last Name Lovelace, and Zip/Postal Code 10001, then select Continue.
    - expect: Checkout advances to the order overview.
    - expect: The entered values are accepted and the selected cart items are retained.

#### 2.3. Reject special characters and incomplete customer values without proceeding

**File:** `checkout-validation.spec.js`

**Steps:**
  1. Starting from a fresh browser state, log in, add one item, and open the checkout information page. Enter !@# as First Name with valid Last Name and Zip/Postal Code and select Continue.
    - expect: Invalid special-character input is rejected with a visible validation error.
    - expect: The page remains on checkout information and does not advance to the overview.
    - expect: DEFECT VALIDATION: the live application was observed accepting !@# as First Name and advancing. Keep this assertion strict and record failure if reproduced.
  2. Repeat from a fresh browser state, submitting whitespace-only or incomplete values in each mandatory field while keeping the other fields valid.
    - expect: Whitespace-only and incomplete values are rejected with clear validation feedback.
    - expect: Checkout remains on the information page; no overview or order is created.

### 3. checkout-overview.spec.js — Checkout Overview

**Seed:** `tests/seed.spec.ts`

#### 3.1. Overview contains every selected item, payment and shipping details, and correct totals

**File:** `checkout-overview.spec.js`

**Steps:**
  1. Starting from a fresh browser state, log in, add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99), open Checkout, enter Ada / Lovelace / 10001, and select Continue.
    - expect: The overview lists every selected item with its name, description, unit price, and quantity.
    - expect: Payment and shipping information are displayed.
    - expect: Item total/subtotal is $39.98, tax is $3.20, and total is $43.18.
    - expect: Cancel and Finish are both present and enabled.

#### 3.2. Browser Back from overview returns to checkout information without losing the cart

**File:** `checkout-overview.spec.js`

**Steps:**
  1. Starting from a fresh browser state, build a two-item cart, enter valid checkout information, continue to the overview, then use the browser Back button.
    - expect: The browser returns to checkout information.
    - expect: The cart remains associated with the checkout and the entered information is retained where supported; no order is placed.

#### 3.3. Cancel on overview returns to the cart and preserves its items

**File:** `checkout-overview.spec.js`

**Steps:**
  1. Starting from a fresh browser state, build a two-item cart, enter valid checkout information, continue to the overview, and select Cancel.
    - expect: Cancel returns to the cart page as required, not to the inventory page.
    - expect: Both items remain in the cart and can be checked out again.
    - expect: DEFECT VALIDATION: the live application was observed navigating to inventory on overview Cancel. Keep the cart destination assertion strict and record failure if reproduced.

### 4. order-completion.spec.js — Order Completion

**Seed:** `tests/seed.spec.ts`

#### 4.1. Finish confirms the order, clears the cart, and Back Home returns to inventory

**File:** `order-completion.spec.js`

**Steps:**
  1. Starting from a fresh browser state, log in, add the Backpack and Bike Light, enter valid checkout information, verify the overview, and select Finish.
    - expect: A success confirmation displays 'Thank you for your order!'.
    - expect: The order is complete and the cart is cleared.
    - expect: Back Home is displayed; selecting it returns to the inventory page with an empty cart.

### 5. checkout-guards.spec.js — Checkout Guards, Cancellation, and Navigation

**Seed:** `tests/seed.spec.ts`

#### 5.1. Unauthenticated users cannot open checkout directly

**File:** `checkout-guards.spec.js`

**Steps:**
  1. Starting in a fresh logged-out browser state, navigate directly to the checkout information URL.
    - expect: The user is redirected to the login page and cannot access checkout.

#### 5.2. Checkout cannot be started with an empty cart

**File:** `checkout-guards.spec.js`

**Steps:**
  1. Starting from a fresh browser state, log in without adding products, open the empty cart, and select Checkout if available.
    - expect: Checkout is blocked while the cart is empty; the user remains on the cart or is otherwise prevented from reaching checkout information.
    - expect: DEFECT VALIDATION: live behavior was observed advancing from an empty cart to checkout step one. Keep the nonempty-cart guard assertion strict and record failure if reproduced.

#### 5.3. Cancel at checkout information returns to cart; browser Back preserves the checkout journey

**File:** `checkout-guards.spec.js`

**Steps:**
  1. Starting from a fresh browser state, log in, add one item, open Checkout, and select Cancel.
    - expect: The user returns to the cart and the item remains present.
  2. Repeat from a fresh browser state, enter the checkout information page with an item in the cart, then use the browser Back button.
    - expect: The browser returns to the cart without placing an order or losing the item.
    - expect: Forward navigation, if used, does not duplicate or clear cart contents.

#### 5.4. Cart remains empty after completed order and checkout routes remain protected

**File:** `checkout-guards.spec.js`

**Steps:**
  1. Starting from a fresh browser state, complete a valid single-item order, then attempt to revisit checkout using browser navigation or the checkout URL.
    - expect: The completed order does not repopulate the cart.
    - expect: Checkout remains inaccessible without a newly populated cart and valid authenticated session.

### 6. mobile-checkout.spec.js — Responsive and Mobile Checkout

**Seed:** `tests/seed.spec.ts`

#### 6.1. Cart and checkout journey fit a 390x844 mobile viewport

**File:** `mobile-checkout.spec.js`

**Steps:**
  1. Starting from a fresh browser state, set the viewport to 390x844, log in, add the Backpack and Bike Light, and inspect the cart page.
    - expect: Cart item names, descriptions, quantities, prices, total, Continue Shopping, and Checkout remain available at the mobile viewport.
    - expect: No horizontal overflow or clipped controls prevent interaction.
  2. Continue through checkout information and the overview at 390x844, using valid customer values.
    - expect: All mandatory fields and their labels are visible and usable.
    - expect: Overview item details, payment/shipping information, subtotal, tax, total, Cancel, and Finish fit and remain usable without horizontal overflow.
  3. Complete the order at 390x844 and select Back Home.
    - expect: The completion confirmation and Back Home action are visible and usable.
    - expect: Back Home returns to inventory without horizontal overflow.
